import { NextRequest, NextResponse } from "next/server";
import { getGeminiModelJson, FALLBACK_MODELS } from "@/lib/gemini";
import {
  getTextAnalysisPrompt,
  getImageAnalysisPrompt,
  getCombinedAnalysisPrompt,
} from "@/lib/prompts";
import { visualAnalysisSchema, analyzeRequestSchema, validateRequest } from "@/lib/validation";

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
 * Check if the error indicates the project has exceeded its spending cap.
 * This is a hard limit at the project level.
 */
function isSpendingCapExceeded(errorMessage?: string): boolean {
  if (!errorMessage) return false;
  return errorMessage.includes("exceeded its spending cap") || errorMessage.includes("billing");
}

/**
 * Build the prompt array based on input type
 */
function buildPrompt(image?: string, text?: string, language: string = "ko") {
  if (image && text) {
    const imageData = image.split(",")[1] || image;
    const mimeType = image.startsWith("data:")
      ? image.split(";")[0].split(":")[1]
      : "image/jpeg";
    return [
      { inlineData: { mimeType, data: imageData } },
      getCombinedAnalysisPrompt(language) + `\n\n${text}`,
    ];
  } else if (image) {
    const imageData = image.split(",")[1] || image;
    const mimeType = image.startsWith("data:")
      ? image.split(";")[0].split(":")[1]
      : "image/jpeg";
    return [
      { inlineData: { mimeType, data: imageData } },
      getImageAnalysisPrompt(language),
    ];
  } else {
    return getTextAnalysisPrompt(language) + `\n\n${text}`;
  }
}

export async function POST(request: NextRequest) {
  let language = "ko";
  try {
    const body = await request.json();
    const validation = await validateRequest(analyzeRequestSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { image, text, language: langParam } = validation.data;
    language = langParam;

    const prompt = buildPrompt(image, text, language);
    let lastError: Error | null = null;

    // Try each model in fallback order
    for (const modelName of FALLBACK_MODELS) {
      console.log(`Trying model: ${modelName}`);
      const model = getGeminiModelJson(modelName);

      // Retry up to 2 times per model
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const result = await model.generateContent(prompt as any);

          if (!result?.response) {
            throw new Error("AI 모델에서 응답을 받지 못했습니다.");
          }

          const responseText = result.response.text();
          const analysisResult = JSON.parse(responseText);

          // Validate VisualAnalysisProfile if present in the response
          if (analysisResult.profile) {
            const validation = visualAnalysisSchema.safeParse(analysisResult.profile);
            if (!validation.success) {
              console.error("Visual profile validation failed:", validation.error.format());
            }
          }

          console.log(`✅ Success with model: ${modelName}`);
          return NextResponse.json({
            result: analysisResult,
            model: modelName,
          });
        } catch (err: unknown) {
          lastError = err instanceof Error ? err : new Error(String(err));
          
          // Type guard for potential status property from Gemini API error
          const status = (err && typeof err === 'object' && 'status' in err) ? (err as { status: number }).status : undefined;
          const is429 = status === 429 || lastError.message?.includes("429");

          if (is429) {
            // Check for Hard Project Limits (Spending Cap)
            if (isSpendingCapExceeded(lastError.message)) {
              console.error("🚨 PROJECT CRITICAL: Spending cap exceeded. All Gemini requests blocked.");
              return NextResponse.json(
                {
                  error:
                    language === "ko"
                      ? "AI 서비스 운영 비용 한도가 초과되었습니다. 관리자에게 문의하거나 잠시 후 다시 시도해주세요."
                      : "AI service spending cap exceeded. Please contact the administrator.",
                  errorType: "SPENDING_CAP",
                },
                { status: 429 }
              );
            }

            // If daily quota is fully gone (limit: 0), skip to next model
            if (isDailyQuotaExhausted(lastError.message)) {
              console.log(
                `❌ ${modelName}: Daily quota exhausted (limit: 0). Trying next model...`
              );
              break; // Break inner retry loop, continue to next model
            }

            // Temporary rate limit — wait and retry with same model
            const retryDelay = parseRetryDelay(lastError.message) || 3000;
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
            `❌ ${modelName} attempt ${attempt + 1} failed: ${lastError.message?.slice(0, 100)}`
          );

          if (!is429) {
            // For non-rate-limit errors, don't try other models
            throw lastError;
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
          language === "ko"
            ? "현재 AI 서비스 사용량이 모두 소진되었습니다. 잠시 후 다시 시도해주세요."
            : "AI service quota exhausted. Please try again later.",
        errorType: "RATE_LIMIT",
      },
      { status: 429 }
    );
  } catch (error: unknown) {
    console.error("Analysis error:", error);

    // Basic map for error messages based on language
    const isKo = language === "ko";
    let message = isKo ? "분석 중 오류가 발생했습니다." : "An error occurred during analysis.";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        message = isKo
          ? "API 키가 설정되지 않았습니다. 관리자에게 문의하세요."
          : "API Key is missing. Please contact administrator.";
        statusCode = 401;
      } else if (error.message.includes("JSON")) {
        message = isKo
          ? "AI 응답을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요."
          : "Failed to parse AI response. Please try again.";
      } else if (
        error.message.includes("429") ||
        error.message.includes("quota")
      ) {
        message = isKo
          ? "현재 AI 서비스 사용량이 일시적으로 제한되었습니다. 약 1~2분 후 다시 시도해주세요."
          : "AI service temporarily limited. Please try again in 1-2 minutes.";
        statusCode = 429;
      } else if (error.message.includes("fetch")) {
        message = isKo
          ? "AI 서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요."
          : "Cannot connect to AI server. Please check your internet connection.";
        statusCode = 503;
      }
    }

    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
