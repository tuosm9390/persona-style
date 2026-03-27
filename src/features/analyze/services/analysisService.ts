import { Part } from "@google/generative-ai";
import { 
  getGeminiModelJson, 
  FALLBACK_MODELS, 
  categorizeGeminiError, 
  GeminiErrorInfo 
} from "@/lib/gemini";
import {
  getTextAnalysisPrompt,
  getImageAnalysisPrompt,
  getCombinedAnalysisPrompt,
} from "@/lib/prompts";
import { visualAnalysisSchema } from "@/lib/validation";
import { logger } from "@/lib/logger";

export interface AnalysisOptions {
  image?: string;
  text?: string;
  language?: string;
  requestId?: string;
}

export class AnalysisService {
  /**
   * 프롬프트 배열을 빌드합니다.
   */
  private buildPrompt(image?: string, text?: string, language: string = "ko"): string | (string | Part)[] {
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

  /**
   * 에러 메시지에서 재시도 대기 시간을 파싱합니다.
   */
  private parseRetryDelay(errorMessage?: string): number | null {
    if (!errorMessage) return null;
    const match = errorMessage.match(/Please retry in ([\d.]+)s/);
    if (match?.[1]) {
      return Math.ceil(parseFloat(match[1]) * 1000) + 1000;
    }
    return null;
  }

  /**
   * 페르소나 분석을 실행합니다. (재시도 및 폴백 로직 포함)
   */
  async performAnalysis(options: AnalysisOptions) {
    const { image, text, language = "ko", requestId = "unknown" } = options;
    const prompt = this.buildPrompt(image, text, language);
    let lastErrorInfo: GeminiErrorInfo | null = null;

    logger.info("Starting analysis service", { requestId, hasImage: !!image, hasText: !!text });

    for (const modelName of FALLBACK_MODELS) {
      logger.info(`Trying model: ${modelName}`, { requestId });
      const model = getGeminiModelJson(modelName);

      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const result = await model.generateContent(prompt);

          if (!result?.response) {
            throw new Error("AI 모델에서 응답을 받지 못했습니다.");
          }

          const responseText = result.response.text();
          const analysisResult = JSON.parse(responseText);

          // 데이터 정합성 검증 (Visual Profile)
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
          return {
            result: analysisResult,
            model: modelName,
          };
        } catch (err: unknown) {
          const errorInfo = categorizeGeminiError(err);
          lastErrorInfo = errorInfo;
          
          logger.warn(`${modelName} attempt ${attempt + 1} failed`, { 
            requestId, 
            errorType: errorInfo.type,
            errorMessage: errorInfo.message.en
          });

          // 즉시 중단이 필요한 치명적 에러
          if (errorInfo.type === "SPENDING_CAP_EXHAUSTED" || errorInfo.type === "INVALID_API_KEY") {
            throw errorInfo;
          }

          // 할당량 초과 시 다음 모델로 전환
          if (errorInfo.type === "DAILY_QUOTA_EXHAUSTED") {
            break;
          }

          // 일시적 제한 시 재시도
          if (errorInfo.type === "RATE_LIMIT") {
            const retryDelay = this.parseRetryDelay(err instanceof Error ? err.message : "") || 3000;
            if (attempt < 1) {
              logger.info(`Waiting ${retryDelay}ms for rate limit...`, { requestId });
              await new Promise((r) => setTimeout(r, retryDelay));
              continue;
            }
          }

          if (attempt >= 1) {
            break;
          }
        }
      }
    }

    throw lastErrorInfo || categorizeGeminiError(new Error("All models exhausted"));
  }
}

export const analysisService = new AnalysisService();
