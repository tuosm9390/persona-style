import { getGeminiModel, PREMIUM_MODEL } from "./gemini";
import { DeepAnalysisResult } from "@/types/premium";
import { HistoryItem } from "./types";

export async function generateDeepAnalysis(
  history: HistoryItem,
): Promise<DeepAnalysisResult> {
  const model = getGeminiModel(PREMIUM_MODEL);

  const prompt = `
    당신은 전문 심리 분석가이자 스타일 컨설턴트입니다.
    다음 사용자의 페르소나 분석 데이터를 바탕으로 심층 리포트를 작성해 주세요.
    
    분석 데이터:
    - 페르소나 유형: ${history.persona_type || history.summary.title}
    - 핵심 키워드: ${history.core_keywords?.join(", ") || history.summary.keywords.join(", ")}
    - 성격 분위기: ${history.analysis.personalityVibe}
    
    작성 지침:
    1. executive_summary: 전체 리포트 요약.
    2. color_theory: 색채학적 분석 (언더톤, 계절, 추천/기피 색상 등).
    3. structural_analysis: 신체 구조 및 얼굴형 분석 최적화 전략.
    4. lifestyle_curation: TPO(직장, 일상, 특별한 날)별 스타일링 제안.
    5. market_trends: 어울리는 브랜드 및 최신 트렌드 연계.
    6. long_term_strategy: 지속 가능한 퍼스널 브랜딩 전략.
    
    형식: JSON 구조로 응답해 주세요. (DeepAnalysisResult 인터페이스 준수)
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || "{}";
    return JSON.parse(jsonStr) as DeepAnalysisResult;
  } catch (error) {
    console.error("Premium analysis error:", error);
    throw new Error("심층 분석 생성에 실패했습니다.");
  }
}
