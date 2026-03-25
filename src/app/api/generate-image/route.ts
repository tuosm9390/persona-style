import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel, IMAGE_MODELS } from "@/lib/gemini";
import type { AnalysisResult } from "@/lib/types";

// Retry configuration
const MAX_RETRIES = 2;
const BASE_DELAY_MS = 3000; // 3 seconds

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Exponential backoff retry wrapper for API calls
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;
      const err = error as Error;

      const isRateLimit =
        err.message?.includes("429") ||
        err.message?.includes("Too Many Requests") ||
        err.message?.includes("quota");

      const isServiceUnavailable = 
        err.message?.includes("503") || 
        err.message?.includes("Service Unavailable") ||
        err.message?.includes("high demand");

      // Only retry on rate limit (429) or temporary server issues (503)
      if ((!isRateLimit && !isServiceUnavailable) || attempt === maxRetries) {
        throw error;
      }

      let delayMs = BASE_DELAY_MS * Math.pow(2, attempt);
      console.log(
        `⚠️ ${isServiceUnavailable ? 'Server busy' : 'Rate limited'}. Attempt ${attempt + 1}/${maxRetries}. Waiting ${Math.round(delayMs / 1000)}s...`
      );
      await sleep(delayMs);
    }
  }

  throw lastError;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { result } = body as { result: AnalysisResult };

    if (!result) {
      return NextResponse.json(
        { error: "분석 결과가 필요합니다." },
        { status: 400 }
      );
    }

    const prompt = buildStyleImagePrompt(result);
    let lastError: unknown = null;

    // Try each image-capable model in order
    for (const modelName of IMAGE_MODELS) {
      try {
        console.log(`🎨 Generating image with model: ${modelName}`);
        const model = getGeminiModel(modelName);

        const imageResult = await withRetry(async () => {
          return await model.generateContent(prompt);
        });

        const response = imageResult.response;
        const candidates = response.candidates;

        if (!candidates || candidates.length === 0) continue;

        const parts = candidates[0].content?.parts;
        if (!parts || parts.length === 0) continue;

        let imageBase64: string | null = null;
        let imageMimeType: string | null = null;
        let textResponse: string | null = null;

        for (const part of parts) {
          if (part.text) {
            textResponse = part.text;
          } else if (part.inlineData) {
            imageBase64 = part.inlineData.data;
            imageMimeType = part.inlineData.mimeType;
          }
        }

        if (imageBase64) {
          console.log(`✅ Success with image model: ${modelName}`);
          return NextResponse.json({
            success: true,
            imageData: imageBase64,
            mimeType: imageMimeType,
            textResponse,
            model: modelName,
          });
        }
      } catch (err: unknown) {
        lastError = err;
        const error = err as Error;
        console.warn(`❌ Model ${modelName} failed: ${error.message?.substring(0, 100)}`);

        // If billing/spending cap error, stop everything
        if (error.message?.includes("spending cap") || error.message?.includes("billing")) {
          break;
        }
        // Continue to next model for 503 or 429
      }
    }

    // If we get here, all models failed
    throw lastError || new Error("모든 이미지 생성 모델 시도가 실패했습니다.");

  } catch (error: unknown) {
    console.error("Image generation error:", error);
    const err = error as any; // Safe cast for property access after checking

    const statusCode = err.status || 500;
    const message = err.message || "";

    // Detailed error classification
    if (
      message.includes("429") ||
      message.includes("quota") ||
      message.includes("Too Many Requests")
    ) {
      // Check if it's a daily quota (unrecoverable by retry)
      const isDailyQuota = message.includes("PerDay");

      return NextResponse.json(
        {
          error: isDailyQuota
            ? "일일 이미지 생성 할당량이 초과되었습니다. 내일 다시 시도해주세요. (태평양 시간 자정에 리셋됩니다)"
            : "이미지 생성 요청이 너무 많습니다. 1분 후 다시 시도해주세요.",
          code: "QUOTA_EXCEEDED",
          isDailyQuota,
        },
        { status: 429 }
      );
    }

    if (message.includes("API key")) {
      return NextResponse.json(
        {
          error: "API 키가 설정되지 않았습니다. .env.local에 GEMINI_API_KEY를 설정해주세요.",
          code: "API_KEY_MISSING",
        },
        { status: 401 }
      );
    }

    if (message.includes("safety") || message.includes("SAFETY")) {
      return NextResponse.json(
        {
          error: "안전 필터에 의해 이미지 생성이 차단되었습니다. 다른 스타일로 시도해주세요.",
          code: "SAFETY_BLOCKED",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "이미지 생성 중 오류가 발생했습니다.",
        code: "UNKNOWN_ERROR",
        details: message.substring(0, 200),
      },
      { status: statusCode }
    );
  }
}

function buildStyleImagePrompt(result: AnalysisResult): string {
  const { summary, fashion, beauty, analysis } = result;

  // Extract key style elements
  const styleKeywords = summary.keywords.join(", ");
  const mainColors = fashion.colorsToWear.slice(0, 3).join(", ");

  // Build detailed prompt for fashion lookbook style image
  const prompt = `Create a professional fashion lookbook photograph featuring a complete styled outfit.

Style Concept: ${summary.title}
Keywords: ${styleKeywords}
Personality: ${analysis.personalityVibe}

Outfit Details:
- Top: ${fashion.tops}
- Bottom: ${fashion.bottoms}
- Outerwear: ${fashion.outerwear}
- Shoes: ${fashion.shoes}
- Accessories: ${fashion.accessories}

Color Palette: ${mainColors}

Hair & Makeup:
- Hair: ${beauty.hairStyle}, ${beauty.hairColor}
- Makeup: ${beauty.lipColor}, ${beauty.eyeMakeup}

Photography Style:
- Clean, minimalist editorial fashion photography
- Soft natural lighting, studio quality
- Simple neutral backdrop
- High fashion editorial aesthetic
- Shot on medium format camera
- Professional lookbook presentation

The image should capture the essence of "${summary.description}"`;

  return prompt;
}
