import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel, FALLBACK_MODELS } from "../../../../lib/gemini";
import {
  IMAGE_ANALYSIS_PROMPT,
  TEXT_ANALYSIS_PROMPT,
  COMBINED_ANALYSIS_PROMPT,
} from "../../../../lib/prompts";

/**
 * Parse Gemini API retry delay from error message
 * e.g. "Please retry in 38.79s" → 39790 (ms)
 */
function parseRetryDelay(errorMessage?: string): number | null {
  if (!errorMessage) return null;
  const match = errorMessage.match(/Please retry in ([\d.]+)s/);
  if (match?.[1]) {
    return Math.ceil(parseFloat(match[1]) * 1000) + 1000;
  }
  return null;
}

/**
 * Check if the error indicates the daily quota is fully exhausted (limit: 0).
 * When limit: 0, retrying with the same model is pointless.
 */
function isDailyQuotaExhausted(errorMessage?: string): boolean {
  if (!errorMessage) return false;
  return errorMessage.includes("limit: 0");
}

/**
 * Build the prompt array based on input type
 */
function buildPrompt(image?: string, text?: string) {
  if (image && text) {
    const imageData = image.split(",")[1] || image;
    const mimeType = image.startsWith("data:")
      ? image.split(";")[0].split(":")[1]
      : "image/jpeg";
    return [
      { inlineData: { mimeType, data: imageData } },
      `${COMBINED_ANALYSIS_PROMPT}\n\n${text}`,
    ];
  } else if (image) {
    const imageData = image.split(",")[1] || image;
    const mimeType = image.startsWith("data:")
      ? image.split(";")[0].split(":")[1]
      : "image/jpeg";
    return [
      { inlineData: { mimeType, data: imageData } },
      IMAGE_ANALYSIS_PROMPT,
    ];
  } else {
    return `${TEXT_ANALYSIS_PROMPT}\n\n${text}`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, text } = body as { image?: string; text?: string };

    if (!image && !text) {
      return NextResponse.json(
        { error: "이미지 또는 텍스트를 입력해주세요." },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(image, text);
    let lastError: any = null;

    // Try each model in fallback order
    for (const modelName of FALLBACK_MODELS) {
      console.log(`Trying model: ${modelName}`);
      const model = getGeminiModel(modelName);

      // Retry up to 2 times per model
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const result = await model.generateContent(prompt as any);

          if (!result?.response) {
            throw new Error("AI 모델에서 응답을 받지 못했습니다.");
          }

          const responseText = result.response.text();

          // Parse JSON — handle markdown code blocks
          let jsonStr = responseText;
          const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (jsonMatch) {
            jsonStr = jsonMatch[1].trim();
          }

          const analysisResult = JSON.parse(jsonStr);
          console.log(`✅ Success with model: ${modelName}`);
          return NextResponse.json({
            result: analysisResult,
            model: modelName,
          });
        } catch (error: any) {
          lastError = error;
          const is429 =
            error.status === 429 || error.message?.includes("429");

          if (is429) {
            // If daily quota is fully gone (limit: 0), skip to next model
            if (isDailyQuotaExhausted(error.message)) {
              console.log(
                `❌ ${modelName}: Daily quota exhausted (limit: 0). Trying next model...`
              );
              break; // Break inner retry loop, continue to next model
            }

            // Temporary rate limit — wait and retry with same model
            const retryDelay = parseRetryDelay(error.message) || 3000;
            if (attempt < 1) {
              console.log(
                `⏳ ${modelName}: Temporary rate limit. Waiting ${retryDelay}ms...`
              );
              await new Promise((r) => setTimeout(r, retryDelay));
              continue; // Retry same model
            }
          }

          // Non-429 errors or exhausted retries — try next model
          console.log(
            `❌ ${modelName} attempt ${attempt + 1} failed: ${error.message?.slice(0, 100)}`
          );

          if (!is429) {
            // For non-rate-limit errors, don't try other models
            throw error;
          }

          break; // Move to next model
        }
      }
    }

    // All models exhausted
    console.error("All models exhausted. Last error:", lastError?.message);
    return NextResponse.json(
      {
        error:
          "현재 AI 서비스 사용량이 일시적으로 제한되었습니다. 잠시 후 다시 시도해주세요. (약 1~2분 후 재시도를 권장합니다)",
        errorType: "RATE_LIMIT",
      },
      { status: 429 }
    );
  } catch (error: unknown) {
    console.error("Analysis error:", error);

    // User-friendly Korean error messages
    let message = "분석 중 오류가 발생했습니다.";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        message = "API 키가 설정되지 않았습니다. 관리자에게 문의하세요.";
        statusCode = 401;
      } else if (error.message.includes("JSON")) {
        message =
          "AI 응답을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.";
      } else if (
        error.message.includes("429") ||
        error.message.includes("quota")
      ) {
        message =
          "현재 AI 서비스 사용량이 일시적으로 제한되었습니다. 약 1~2분 후 다시 시도해주세요.";
        statusCode = 429;
      } else if (error.message.includes("fetch")) {
        message = "AI 서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.";
        statusCode = 503;
      }
    }

    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
