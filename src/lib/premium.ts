import { getGeminiModel } from './gemini';
import { DeepAnalysisResult } from '@/types/premium';

export async function generateDeepAnalysis(history: any): Promise<DeepAnalysisResult> {
  const model = getGeminiModel('gemini-1.5-pro'); // Premium 전용 고성능 모델 사용
  
  const prompt = `
    당신은 전문 심리 분석가이자 스타일 컨설턴트입니다.
    다음 사용자의 페르소나 분석 데이터를 바탕으로 심층 리포트를 작성해 주세요.
    
    분석 데이터:
    - 페르소나 유형: ${history.persona_type}
    - 핵심 키워드: ${history.core_keywords?.join(', ')}
    - 성격 분위기: ${history.analysis?.personalityVibe}
    
    작성 지침:
    1. 커리어 조언: 이 페르소나가 직업 환경에서 가질 수 있는 강점과 보완점.
    2. 대인관계 팁: 타인과 소통할 때 유의할 점과 매력을 극대화하는 방법.
    3. 상세 스타일 가이드: 단순한 패션 추천을 넘어, 브랜드나 소재, 상황별 코디 전략 제안.
    4. 종합 요약: 사용자의 정체성을 한 문장으로 정의.
    
    형식: 아래 JSON 구조로만 응답해 주세요.
    {
      "career_advice": "...",
      "relationship_tips": "...",
      "detailed_styling_guide": "...",
      "overall_summary": "..."
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // JSON 추출 및 파싱 (간략화)
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || '{}';
    return JSON.parse(jsonStr) as DeepAnalysisResult;
  } catch (error) {
    console.error('Gemini 1.5 Pro error:', error);
    throw new Error('심층 분석 생성에 실패했습니다.');
  }
}
