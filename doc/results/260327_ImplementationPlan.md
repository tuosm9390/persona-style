Date: 2026-03-27 10:45:00
Author: Antigravity

# 🛠️ 프로젝트 리팩토링 구현 계획서 (Implementation Plan)

본 계획서는 `260327_AnalysisReport.md`에서 식별된 문제점들을 해결하기 위한 단계별 실행 계획을 정의합니다.

## 1. 단계별 목표 (Phases)

### Phase 1: 기반 구조 강화 및 타입 안전성 확보
- **목표**: 프로젝트 구조를 기능 중심으로 재편하고, 코드 전반의 타입 안전성을 높임.
- **주요 작업**:
  - `src/features` 디렉토리 생성 및 도메인별 하위 구조 설정.
  - `src/lib/logger.ts` 리팩토링 (`any` 제거 및 `unknown` 적용).
  - `src/lib/supabase` 인덱스 구조 개선 (Client/Server 명확화).
- **검증**: 컴파일 에러 유무 확인 및 린트 체크.

### Phase 2: 비즈니스 로직 분리 및 서비스 레이어 구축
- **목표**: API 라우트의 로직을 서비스 레이어로 이관하여 테스트 가능성과 유지보수성 향상.
- **주요 작업**:
  - `src/lib/gemini.ts` 정제 (모델 명칭 수정 및 공통 타입 정의).
  - `src/features/analyze/services/analysisService.ts` 구현 (AI 분석 로직 집약).
  - `src/app/api/analyze/route.ts` 리팩토링 (서비스 호출 방식으로 단순화).
- **검증**: `analyze` API 동작 테스트 및 에러 핸들링 유효성 검증.

### Phase 3: 프론트엔드 컴포넌트 최적화 및 구조 재편
- **목표**: 컴포넌트 응집도를 높이고 Next.js 서버 컴포넌트 활용을 최적화하여 성능 향상.
- **주요 작업**:
  - `src/components/features`의 컴포넌트들을 `src/features/{feature}/components`로 이동.
  - `app/page.tsx` 리팩토링 (정적 섹션을 서버 컴포넌트로 분리).
  - 상호작용이 필요한 부분만 클라이언트 컴포넌트로 격리.
- **검증**: 페이지 로딩 성능 체크 및 UI 상호작용 정상 동작 확인.

### Phase 4: 최종 정리 및 문서화
- **목표**: 전체적인 코드 정합성 확인 및 리팩토링 결과 문서화.
- **주요 작업**:
  - 사용되지 않는 유틸리티 및 타입 정리.
  - 전체 테스트 코드 실행 및 필요시 업데이트.
  - 리팩토링 결과 보고서 작성.

## 2. 세부 실행 계획 (Detailed Tasks)

### 2.1. 인프라 및 도메인 구조 (Phase 1)
- [ ] `mkdir src/features/analyze src/features/match src/features/premium`
- [ ] `src/lib/logger.ts`: `any` -> `unknown` 또는 인터페이스로 교체.
- [ ] `src/lib/supabase/index.ts` 생성:
  ```typescript
  export { createClient as createBrowserClient } from './client';
  export { createServerSupabaseClient } from './server';
  ```

### 2.2. 백엔드 로직 (Phase 2)
- [ ] `src/lib/gemini.ts`: 유효한 모델 명칭(`gemini-1.5-flash` 등)으로 기본값 수정.
- [ ] `analysisService.ts` 구현:
  - 프롬프트 생성 로직 통합.
  - 모델 재시도 및 폴백 로직 캡슐화.
  - 에러 처리 표준화.

### 2.3. 프론트엔드 (Phase 3)
- [ ] `app/page.tsx`:
  - `HeroSection`, `FeaturesSection` 등을 별도 서버 컴포넌트 파일로 추출.
  - 메인 `page.tsx`에서 `"use client"` 제거.

## 3. 리스크 관리
- **브레이킹 체인지**: 대규모 파일 이동으로 인한 임포트 경로 오류 위험. -> 에디터 자동 수정 기능을 활용하고 단계별로 빌드 테스트 수행.
- **AI 응답 변화**: 서비스 레이어 이관 중 프롬프트 누락 주의. -> 기존 코드와 1:1 대조 및 결과물 일관성 확인.

## 4. 일정 (Timeline)
- Phase 1: 1시간
- Phase 2: 2시간
- Phase 3: 2시간
- Phase 4: 1시간
- **총 소요 시간**: 약 6시간 (예상)
