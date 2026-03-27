import { NextRequest, NextResponse } from "next/server";
import { getGeminiModelJson, FALLBACK_MODELS, categorizeGeminiError, GeminiErrorInfo } from "@/lib/gemini";
import {
  getTextAnalysisPrompt,
  getImageAnalysisPrompt,
  getCombinedAnalysisPrompt,
} from "@/lib/prompts";
import { visualAnalysisSchema, analyzeRequestSchema, validateRequest } from "@/lib/validation";
import { Part } from "@google/generative-ai";
import { logger } from "@/lib/logger";

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
 * Build the prompt array based on input type
 */
function buildPrompt(image?: string, text?: string, language: string = "ko"): string | (string | Part)[] {
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
    return getTextAnalysisPrompt(language) + `\n\n${text || ""}`;
  }
}

export async function POST(request: NextRequest) {
  let language = "ko";
  const requestId = Math.random().toString(36).substring(7);

  try {
    const body = await request.json();
    const validation = await validateRequest(analyzeRequestSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { image, text, language: langParam } = validation.data;
    language = langParam;

    const prompt = buildPrompt(image, text, language);
    let lastErrorInfo: GeminiErrorInfo | null = null;

    logger.info("Starting analysis request", { requestId, hasImage: !!image, hasText: !!text });

    // Try each model in fallback order
    for (const modelName of FALLBACK_MODELS) {
      logger.info(`Trying model: ${modelName}`, { requestId });
      const model = getGeminiModelJson(modelName);

      // Retry up to 2 times per model
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const result = await model.generateContent(prompt);

          if (!result?.response) {
            throw new Error("AI 모델에서 응답을 받지 못했습니다.");
          }

          const responseText = result.response.text();
          const analysisResult = JSON.parse(responseText);

          // Validate VisualAnalysisProfile if present in the response
          if (analysisResult.profile) {
            const validation = visualAnalysisSchema.safeParse(analysisResult.profile);
            if (!validation.success) {
              logger.warn("Visual profile validation failed", { 
                requestId, 
                errors: validation.error.format() 
              });
            }
          }

          logger.info(`✅ Success with model: ${modelName}`, { requestId });
          return NextResponse.json({
            result: analysisResult,
            model: modelName,
          });
        } catch (err: unknown) {
          const errorInfo = categorizeGeminiError(err);
          lastErrorInfo = errorInfo;
          
          logger.warn(`${modelName} attempt ${attempt + 1} failed`, { 
            requestId, 
            errorType: errorInfo.type,
            error: errorInfo.message.en
          });

          // Case 1: Critical Project Limits (Spending Cap) - Stop immediately
          if (errorInfo.type === "SPENDING_CAP_EXHAUSTED" || errorInfo.type === "INVALID_API_KEY") {
            logger.error(`🚨 CRITICAL ERROR: ${errorInfo.type}`, { requestId });
            return NextResponse.json(
              { error: language === "ko" ? errorInfo.message.ko : errorInfo.message.en, errorType: errorInfo.type },
              { status: errorInfo.status }
            );
          }

          // Case 2: Daily Quota Exhausted for this model - Switch to next model
          if (errorInfo.type === "DAILY_QUOTA_EXHAUSTED") {
            break; // Break inner retry loop
          }

          // Case 3: Temporary Rate Limit - Wait and retry same model
          if (errorInfo.type === "RATE_LIMIT") {
            const retryDelay = parseRetryDelay(err instanceof Error ? err.message : "") || 3000;
            if (attempt < 1) {
              logger.info(`Waiting ${retryDelay}ms for rate limit...`, { requestId });
              await new Promise((r) => setTimeout(r, retryDelay));
              continue;
            }
          }

          // Case 4: Non-rate-limit errors (Parse, Network, Fatal) - Log and try next model
          if (attempt >= 1) {
            break;
          }
        }
      }
    }

    // All models exhausted
    const finalError = lastErrorInfo || categorizeGeminiError(new Error("Unknown error"));
    logger.error("All models exhausted", { requestId, finalErrorType: finalError.type });
    
    return NextResponse.json(
      { 
        error: language === "ko" ? finalError.message.ko : finalError.message.en,
        errorType: finalError.type 
      },
      { status: finalError.status }
    );
  } catch (error: unknown) {
    const errorInfo = categorizeGeminiError(error);
    logger.error("Fatal analysis error", { requestId, errorInfo });

    return NextResponse.json(
      { error: language === "ko" ? errorInfo.message.ko : errorInfo.message.en },
      { status: errorInfo.status }
    );
  }
}
