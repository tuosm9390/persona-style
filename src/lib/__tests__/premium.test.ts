import { generateDeepAnalysis } from '../premium';

describe('Premium Deep Analysis Service', () => {
  it('should generate deep analysis based on persona history', async () => {
    // 목업 데이터 정의
    const mockHistory = {
      persona_type: '철학적 몽상가',
      core_keywords: ['창의적', '심오함', '사색가'],
      analysis: { personalityVibe: '차분하고 사색적인 분위기' }
    };

    // 실제 API 호출 대신 로직 흐름 테스트 (프롬프트 구성 등)
    // 여기서는 함수가 정의되어 있는지와 호출 가능한지만 우선 체크 (TDD Red)
    expect(generateDeepAnalysis).toBeDefined();
  });
});
