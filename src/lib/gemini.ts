import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

if (!apiKey) {
  console.warn(
    "⚠️ Gemini API key is missing. Set GEMINI_API_KEY in .env.local",
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

// Model configuration via environment variables
const DEFAULT_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-1.5-flash";
const PREMIUM_MODEL_NAME = process.env.NEXT_PUBLIC_GEMINI_PREMIUM_MODEL || "gemini-1.5-pro";

// Fallback model list — prioritizing stable models with higher quotas
const FALLBACK_MODELS = [
  PREMIUM_MODEL_NAME,
  DEFAULT_MODEL,
  "gemini-1.5-flash-8b",
];

// High-performance model for premium analysis
const PREMIUM_MODEL = PREMIUM_MODEL_NAME;

// Models capable of image generation (experimental/preview)
const IMAGE_MODELS = [
  process.env.NEXT_PUBLIC_GEMINI_IMAGE_MODEL || "gemini-1.5-flash",
  "gemini-1.5-pro",
];

export type GeminiErrorType = 
  | "RATE_LIMIT"
  | "DAILY_QUOTA_EXHAUSTED"
  | "SPENDING_CAP_EXHAUSTED"
  | "INVALID_API_KEY"
  | "FATAL"
  | "PARSE_ERROR"
  | "NETWORK_ERROR";

export interface GeminiErrorInfo {
  type: GeminiErrorType;
  message: { ko: string; en: string };
  status: number;
}

export const GEMINI_ERROR_MAP: Record<GeminiErrorType, GeminiErrorInfo> = {
  RATE_LIMIT: {
    type: "RATE_LIMIT",
    status: 429,
    message: {
      ko: "현재 AI 서비스 사용량이 일시적으로 제한되었습니다. 약 1~2분 후 다시 시도해주세요.",
      en: "AI service temporarily limited. Please try again in 1-2 minutes.",
    }
  },
  DAILY_QUOTA_EXHAUSTED: {
    type: "DAILY_QUOTA_EXHAUSTED",
    status: 429,
    message: {
      ko: "현재 AI 모델의 일일 사용량이 모두 소진되었습니다. 다른 모델로 전환하거나 잠시 후 시도해주세요.",
      en: "Daily quota exhausted for this model. Switching or try again later.",
    }
  },
  SPENDING_CAP_EXHAUSTED: {
     type: "SPENDING_CAP_EXHAUSTED",
     status: 429,
     message: {
       ko: "AI 서비스 운영 비용 한도가 초과되었습니다. 관리자에게 문의하거나 잠시 후 다시 시도해주세요.",
       en: "AI service spending cap exceeded. Please contact the administrator.",
     }
  },
  INVALID_API_KEY: {
    type: "INVALID_API_KEY",
    status: 401,
    message: {
      ko: "API 키가 설정되지 않았거나 유효하지 않습니다. 관리자에게 문의하세요.",
      en: "API Key is missing or invalid. Please contact administrator.",
    }
  },
  PARSE_ERROR: {
    type: "PARSE_ERROR",
    status: 500,
    message: {
      ko: "AI 응답을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.",
      en: "Failed to parse AI response. Please try again.",
    }
  },
  NETWORK_ERROR: {
    type: "NETWORK_ERROR",
    status: 503,
    message: {
      ko: "AI 서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.",
      en: "Cannot connect to AI server. Please check your internet connection.",
    }
  },
  FATAL: {
    type: "FATAL",
    status: 500,
    message: {
      ko: "분석 중 예기치 않은 오류가 발생했습니다.",
      en: "An unexpected error occurred during analysis.",
    }
  }
};

/**
 * Categorize a Gemini API error based on its properties and message
 */
export function categorizeGeminiError(error: unknown): GeminiErrorInfo {
  const err = error instanceof Error ? error : new Error(String(error));
  const message = err.message.toLowerCase();
  const status = (error && typeof error === 'object' && 'status' in error) ? (error as { status: number }).status : 500;

  if (status === 401 || message.includes("api key") || message.includes("invalid")) {
    return GEMINI_ERROR_MAP.INVALID_API_KEY;
  }

  if (status === 429 || message.includes("429") || message.includes("rate limit")) {
    if (message.includes("spending cap") || message.includes("billing")) {
      return GEMINI_ERROR_MAP.SPENDING_CAP_EXHAUSTED;
    }
    if (message.includes("limit: 0") || message.includes("quota exhausted")) {
      return GEMINI_ERROR_MAP.DAILY_QUOTA_EXHAUSTED;
    }
    return GEMINI_ERROR_MAP.RATE_LIMIT;
  }

  if (message.includes("json") || message.includes("parse")) {
    return GEMINI_ERROR_MAP.PARSE_ERROR;
  }

  if (message.includes("fetch") || message.includes("network") || status === 503) {
    return GEMINI_ERROR_MAP.NETWORK_ERROR;
  }

  return GEMINI_ERROR_MAP.FATAL;
}

export function getGeminiModel(modelName: string = "gemini-2.5-flash-image") {
  return genAI.getGenerativeModel({ model: modelName });
}

export function getGeminiModelJson(
  modelName: string = "gemini-2.5-flash-image",
) {
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: { responseMimeType: "application/json" },
  });
}

import { logger } from "./logger";

export async function generateMatchingSummary(
  sourceType?: string,
  targetType?: string,
  score: number = 0,
): Promise<string> {
  const model = getGeminiModel();
  const prompt = `
    Two people have the following persona styles:
    Person A: ${sourceType || "Unknown"}
    Person B: ${targetType || "Unknown"}
    
    Their compatibility score is ${score}/100.
    
    Based on these personas, write a short, engaging "Chemistry Report" in Korean.
    The report should include:
    1. A brief summary of how their styles complement each other.
    2. Two actionable tips for their relationship or communication.
    
    Keep the tone friendly and professional. Output only the Korean text.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    logger.error("Gemini matching error:", error);
    return "서로의 매력을 발견해가는 중입니다. 조금 더 대화해보면 어떨까요?";
  }
}

export { FALLBACK_MODELS, IMAGE_MODELS, PREMIUM_MODEL };
