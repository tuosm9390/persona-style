Date: 2026-03-25 14:15:00
Author: Antigravity

# 📜 Premium Analysis API Error 분석 보고서

## 1. 문제 개요
사용자가 프리미엄 심층 분석 리포트를 생성하는 과정에서 500 에러(Internal Server Error)가 발생했습니다.
서버 로그 확인 결과, Gemini API 호출 시 `models/gemini-1.5-pro`를 찾을 수 없다는 404 에러가 근본 원인인 것으로 파악되었습니다.

## 2. 에러 로그 상세
```text
Premium analysis error: Error: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent: [404 Not Found] models/gemini-1.5-pro is not found for API version v1beta, or is not supported for generateContent.
```

## 3. 원인 분석 (Root Cause)
1. **모델 가용성 문제**: 현재 프로젝트의 `src/lib/gemini.ts`에 정의된 최신 모델 리스트(`FALLBACK_MODELS`)에는 `gemini-2.5-pro`, `gemini-2.5-flash` 등이 포함되어 있으나, `src/app/api/premium/analyze/route.ts` 및 `src/lib/premium.ts`에는 과거 버전인 `gemini-1.5-pro`가 하드코딩되어 있습니다.
2. **API 엔드포인트 변경**: Google Gemini API `v1beta` 버전에서 `gemini-1.5-pro` 모델이 더 이상 지원되지 않거나, `gemini-2.5` 시리즈로 완전히 대체된 것으로 보입니다. (현재 시점 2026년 기준)
3. **일관성 부족**: 일반 분석(`/api/analyze`)은 `FALLBACK_MODELS`를 순회하며 유연하게 대응하고 있으나, 프리미엄 기능은 특정 모델에 고정되어 있어 장애에 취약한 상태입니다.

## 4. 해결 전략 (Hypothesis)
1. **모델 업데이트**: 하드코딩된 `gemini-1.5-pro`를 현재 환경에서 지원되는 최고 사양 모델인 `gemini-2.5-pro`로 교체합니다.
2. **중앙 집중식 관리**: `src/lib/gemini.ts`에 `PREMIUM_MODEL` 상수를 추가하여 모델 변경 시 한 곳에서 관리할 수 있도록 개선합니다.
3. **Specs 동기화**: `specs/002-premium-expert-report/quickstart.md` 등 문서상의 모델 가이드라인도 현실에 맞게 업데이트합니다.

## 5. 기대 효과
- 프리미엄 심층 분석 기능 정상화.
- 향후 모델 업그레이드 시 유지보수 편의성 증대.
- API 호출 안정성 확보.
