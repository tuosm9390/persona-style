Date: 2026-03-26 14:20:00
Author: Antigravity

# 프로젝트 린트 이슈 수정 구현 계획서

## 1. 개요
`npm run lint` 실행 결과 발생한 42개의 이슈를 해결하기 위한 구체적인 수정 계획입니다.

## 2. 작업 단위 및 단계별 계획

### 단계 1: React Hook 및 컨텍스트 최적화 (Priority: High)
- **`src/contexts/LanguageContext.tsx`**: `useEffect` 내에서 `setLanguage`를 동기적으로 호출하는 로직 수정 (지연 호출 혹은 초기화 로직 변경).
- **`src/app/premium/loading/page.tsx`**: `useEffect` 의존성 배열에 `steps.length` 추가.

### 단계 2: 타입 시스템 강화 및 `any` 제거 (Priority: High)
- **`src/app/api/analyze/route.ts`**, **`src/app/api/premium/analyze/route.ts`** 등: `any`를 구체적인 인터페이스(예: `AnalysisResult`, `AnalysisData`)로 교체.
- **`src/components/ui/input.tsx`**, **`src/components/ui/textarea.tsx`**: 빈 인터페이스 에러 해결 (속성 추가 혹은 타입 별칭 사용).

### 단계 3: JSX 문법 및 이스케이프 수정 (Priority: Medium)
- **`src/app/about/page.tsx`**, **`src/app/premium/[id]/page.tsx`**, **`src/app/terms/page.tsx`**: unescaped entities (`"`, `'`) 수정.

### 단계 4: 코드 스타일 및 미사용 코드 정리 (Priority: Medium)
- **`eslint --fix`** 실행하여 `prefer-const` 등 자동 수정 가능한 항목 처리.
- 프로젝트 전반의 `no-unused-vars` 경고 항목 수동 제거.

### 단계 5: Next.js 이미지 최적화 적용 (Priority: Low)
- **`src/components/features/AnalysisResult.tsx`**: `<img>`를 `next/image`의 `Image` 컴포넌트로 교체.

## 3. 검증 전략
- 각 단계 완료 후 `npx eslint <fixed_file_path>` 실행하여 해당 파일의 에러가 해결되었는지 확인.
- 모든 단계 완료 후 전체 `npm run lint`를 실행하여 0개 에러 보장.
- `npx tsc --noEmit`을 통해 타입 무결성 최종 확인.
