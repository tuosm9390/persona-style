import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import type { AnalysisResult } from "@/lib/types";

// Retry configuration
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000; // 2 seconds

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
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      const is429 =
        error.message?.includes("429") ||
        error.message?.includes("Too Many Requests") ||
        error.message?.includes("quota");

      // Only retry on rate limit errors
      if (!is429 || attempt === maxRetries) {
        throw error;
      }

      // Parse retry delay from error if available, otherwise use exponential backoff
      let delayMs = BASE_DELAY_MS * Math.pow(2, attempt);

      const retryMatch = error.message?.match(/retry\s+in\s+([\d.]+)s/i);
      if (retryMatch) {
        delayMs = Math.max(parseFloat(retryMatch[1]) * 1000, delayMs);
      }

      console.log(
        `Rate limited. Attempt ${attempt + 1}/${maxRetries}. Retrying in ${Math.round(delayMs / 1000)}s...`
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

    // Build image generation prompt from analysis result
    const prompt = buildStyleImagePrompt(result);

    console.log("Generating style image with prompt:", prompt.substring(0, 200) + "...");

    // Use Gemini 2.5 Flash Image model with retry logic
    const model = getGeminiModel("gemini-3-pro-image-preview");

    const imageResult = await withRetry(async () => {
      return await model.generateContent(prompt);
    });

    const response = imageResult.response;

    // Extract image data from response parts (official API format)
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      return NextResponse.json(
        { error: "이미지 생성 결과가 없습니다." },
        { status: 500 }
      );
    }

    const parts = candidates[0].content?.parts;
    if (!parts || parts.length === 0) {
      return NextResponse.json(
        { error: "응답에 이미지 데이터가 포함되어 있지 않습니다." },
        { status: 500 }
      );
    }

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

    if (!imageBase64) {
      return NextResponse.json(
        {
          error: "이미지가 생성되지 않았습니다. 텍스트만 반환되었습니다.",
          textResponse,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageData: imageBase64,
      mimeType: imageMimeType,
      textResponse,
      prompt,
    });
  } catch (error: any) {
    console.error("Image generation error:", error);

    const statusCode = error.status || 500;

    // Detailed error classification
    if (
      error.message?.includes("429") ||
      error.message?.includes("quota") ||
      error.message?.includes("Too Many Requests")
    ) {
      // Check if it's a daily quota (unrecoverable by retry)
      const isDailyQuota = error.message?.includes("PerDay");

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

    if (error.message?.includes("API key")) {
      return NextResponse.json(
        {
          error: "API 키가 설정되지 않았습니다. .env.local에 GEMINI_API_KEY를 설정해주세요.",
          code: "API_KEY_MISSING",
        },
        { status: 401 }
      );
    }

    if (error.message?.includes("safety") || error.message?.includes("SAFETY")) {
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
        details: error.message?.substring(0, 200),
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
