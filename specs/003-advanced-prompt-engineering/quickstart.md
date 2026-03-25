# Quickstart: 고도화된 이미지 분석 프롬프트 엔지니어링

**Feature**: 고도화된 이미지 분석 프롬프트 엔지니어링 (003-advanced-prompt-engineering)

## Prerequisites
- **Gemini 1.5 Pro API Key**: `.env.local` 파일에 `GOOGLE_GENERATIVE_AI_API_KEY`가 설정되어 있어야 합니다.
- **Zod**: 스키마 검증을 위해 설치되어 있어야 합니다.

## Implementation Steps

### 1. 프롬프트 정의
`src/lib/prompts.ts` (또는 유사 파일)에 새로운 `ADVANCED_ANALYSIS_PROMPT`를 작성합니다.
- `Reference Scale` 정의 포함.
- `JSON Output Instruction` 및 `Schema` 상세 명시.

### 2. Zod 스키마 작성
`src/lib/validation.ts`에 `VisualAnalysisProfile` 검증을 위한 스키마를 정의합니다.

### 3. API 핸들러 업데이트
`src/app/api/analyze/route.ts`에서 새로운 프롬프트를 사용하여 Gemini API를 호출하고, 결과 JSON을 Zod로 검증하는 로직을 추가합니다.

## Testing
1. **유닛 테스트**: `src/lib/__tests__/prompts.test.ts`를 생성하여 다양한 이미지 설명에 대해 JSON이 올바르게 생성되는지 테스트합니다.
2. **E2E 테스트**: 브라우저에서 사진을 업로드하고 개발자 도구의 Network 탭에서 `/api/analyze` 응답의 JSON 구조가 `data-model.md`와 일치하는지 확인합니다.

## Validation Script
아래 명령어를 통해 기본 린트 및 타입 체크를 수행하십시오.
```bash
npm run lint
npx tsc --noEmit
```
