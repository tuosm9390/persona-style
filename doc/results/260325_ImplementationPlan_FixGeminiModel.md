Date: 2026-03-25 14:20:00
Author: Antigravity

# 📜 Gemini Model Update 및 API 정상화 계획서

## 1. 목적
하드코딩된 레거시 모델(`gemini-1.5-pro`)을 최신 고성능 모델(`gemini-2.5-pro`)로 교체하여 프리미엄 분석 API의 404 에러를 해결하고 시스템 안정성을 강화합니다.

## 2. 작업 상세
### Step 1: `src/lib/gemini.ts` 수정
- `PREMIUM_MODEL` 상수를 추가하여 고성능 모델을 중앙에서 관리할 수 있도록 합니다.
- 기본 모델 리스트(`FALLBACK_MODELS`, `IMAGE_MODELS`)의 주석과 구성을 검토합니다.

### Step 2: `src/lib/premium.ts` 수정
- 하드코딩된 `"gemini-1.5-pro"`를 `PREMIUM_MODEL`로 변경합니다.

### Step 3: `src/app/api/premium/analyze/route.ts` 수정
- `getGeminiModelJson("gemini-1.5-pro")`를 `getGeminiModelJson(PREMIUM_MODEL)`로 변경합니다.

### Step 4: 문서 업데이트
- `specs/002-premium-expert-report/quickstart.md`의 모델 정보를 최신화합니다.

## 3. 검증 계획 (Verification Plan)
1. **API 호출 테스트**: 로컬 개발 서버 또는 테스트 스크립트를 사용하여 `/api/premium/analyze` 엔드포인트가 정상적으로 200 응답을 반환하는지 확인합니다.
2. **JSON 응답 검증**: 생성된 결과가 `DeepAnalysisResult` 타입에 부합하는 유효한 JSON인지 파악합니다.
3. **통합 테스트**: 기존 `FALLBACK_MODELS`를 사용하는 일반 분석 기능에 영향이 없는지 확인합니다.

## 4. 일정
- 리서치 및 분석: 완료
- 구현 및 테스트: 즉시 실행 (예상 소요 시간 20분)
