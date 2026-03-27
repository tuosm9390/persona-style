import { NextRequest, NextResponse } from "next/server";
import { analyzeRequestSchema, validateRequest } from "@/lib/validation";
import { analysisService } from "@/features/analyze/services/analysisService";
import { GeminiErrorInfo } from "@/lib/gemini";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);

  try {
    const body = await request.json();
    const validation = await validateRequest(analyzeRequestSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { image, text, language = "ko" } = validation.data;

    const result = await analysisService.performAnalysis({
      image,
      text,
      language,
      requestId
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    // GeminiErrorInfo 형식인 경우 처리
    if (error && typeof error === 'object' && 'type' in error && 'message' in error) {
      const errorInfo = error as GeminiErrorInfo;
      const lang = "ko"; // 기본적으로 한국어 메시지 반환 (필요시 바디에서 추출한 language 사용 가능)
      
      return NextResponse.json(
        { error: errorInfo.message[lang], errorType: errorInfo.type },
        { status: errorInfo.status }
      );
    }

    // 기타 예외 처리
    logger.error("Fatal analysis API error", error, { requestId });
    return NextResponse.json(
      { error: "분석 중 예기치 않은 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
