---
description: "Task list for Viral Engine Construction feature implementation"
---

# Tasks: Viral Engine Construction

**Input**: Design documents from `/specs/001-viral-engine-construction/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Includes exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Install viral engine dependencies (`satori`, `@resvg/resvg-js`) in `package.json`
- [X] T002 Enable `pgvector` extension in Supabase via SQL migration in `supabase_schema.sql`
- [X] T003 [P] Configure Vercel Cron Job schedule for trend aggregation in `vercel.json` (or equivalent config)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T004 Define shared viral feature types and design tokens (colors, geometric pattern sets per persona) in `src/types/viral.ts`
- [X] T005 Implement image storage helper functions in `src/lib/storage.ts`
- [X] T006 [P] Setup API Zod validation middleware for viral endpoints in `src/middleware.ts` (or helper)
- [X] T007 Update `persona_analyses` table schema with `design_config` and `share_count` in `supabase_schema.sql`

---

## Phase 3: User Story 1 - 공유용 아이덴티티 카드 고도화 (Priority: P1) 🎯 MVP

**Goal**: 사용자가 페르소나 분석 결과를 고퀄리티 이미지로 생성하고 소셜 미디어에 공유할 수 있도록 함

**Independent Test**: `/api/share/[id]` 호출 시 3초 이내에 9:16 비율의 PNG 이미지가 정상적으로 반환되는지 확인

### Tests for User Story 1 (MANDATORY) ⚠️

- [X] T008 [P] [US1] Create integration test for share card image generation in `src/app/api/share/__tests__/route.test.ts`
- [X] T009 [P] [US1] Create unit test for ShareCard React component in `src/components/features/ShareCard/__tests__/ShareCard.test.tsx`

### Implementation for User Story 1

- [X] T010 [P] [US1] Create ShareCard UI component for image rendering in `src/components/features/ShareCard/index.tsx`
- [X] T011 [US1] Implement image generation API route using Satori in `src/app/api/share/[id]/route.ts`
- [X] T012 [US1] Add '이미지로 저장' 및 '공유하기' 버튼을 분석 결과 페이지 `src/app/analyze/page.tsx`에 추가
- [X] T013 [US1] Implement share count increment logic in `src/app/api/share/[id]/route.ts`

---

## Phase 4: User Story 2 - 페르소나 매칭 (궁합 테스트) (Priority: P2)

**Goal**: 두 페르소나 간의 유사도를 분석하여 궁합 점수와 팁을 제공

**Independent Test**: 두 분석 ID를 전달했을 때 0~100점 사이의 점수와 분석 텍스트가 포함된 결과가 반환되는지 확인

### Tests for User Story 2 (MANDATORY) ⚠️

- [X] T014 [P] [US2] Create unit test for cosine similarity matching logic in `src/lib/__tests__/matching.test.ts`
- [X] T015 [P] [US2] Create integration test for matching API in `src/app/api/match/__tests__/route.test.ts`

### Implementation for User Story 2

- [X] T016 [P] [US2] Implement `persona_matches` table migration in `supabase_schema.sql`
- [X] T017 [US2] Implement vector similarity calculation and matching service in `src/lib/matching.ts`
- [X] T018 [US2] Implement matching API route in `src/app/api/match/route.ts`
- [X] T019 [US2] Create matching result UI component in `src/components/features/Matcher/index.tsx`
- [X] T020 [US2] Implement matching input and result page in `src/app/match/page.tsx`

---

## Phase 5: User Story 3 - 글로벌 페르소나 트렌드 대시보드 (Priority: P3)

**Goal**: 전체 사용자 통계를 집계하여 실시간 트렌드 시각화

**Independent Test**: 트렌드 페이지 접속 시 페르소나 분포 차트가 정상적으로 렌더링되는지 확인

### Tests for User Story 3 (MANDATORY) ⚠️

- [X] T021 [P] [US3] Create integration test for trend statistics API in `src/app/api/trend/__tests__/route.test.ts`

### Implementation for User Story 3

- [X] T022 [P] [US3] Implement `persona_stats` table and aggregation RPC in `supabase_schema.sql`
- [X] T023 [US3] Implement statistics aggregation logic in `src/lib/trend.ts`
- [X] T024 [US3] Implement trend statistics API route in `src/app/api/trend/route.ts`
- [X] T025 [US3] Create trend visualization components (using Recharts 등) in `src/components/features/Trend/index.tsx`
- [X] T026 [US3] Implement trend dashboard page in `src/app/trend/page.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T027 [P] Update `README.md` with viral engine usage and API documentation
- [X] T028 Performance optimization for image generation (caching, font loading optimization)
- [X] T029 [P] Final linting and type checking (`npm run lint`, `tsc`)
- [ ] T030 Run `quickstart.md` validation to ensure all setup steps work

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 시작 즉시 실행 가능
- **Foundational (Phase 2)**: Phase 1 완료 후 실행, 모든 User Story의 블로킹 요소
- **User Stories (Phase 3+)**: Foundational 단계 완료 후 병렬 또는 순차(P1 -> P2 -> P3) 진행 가능
- **Polish (Final Phase)**: 모든 User Story 구현 및 테스트 완료 후 진행

### User Story Dependencies

- **US1 (P1)**: Foundational 완료 후 독립적 진행 가능 (MVP)
- **US2 (P2)**: Foundational 완료 후 진행, US1의 분석 데이터(ID)를 입력값으로 사용
- **US3 (P3)**: Foundational 완료 후 진행, 전체 분석 데이터 집계 기반

---

## Parallel Example: User Story 1

```bash
# US1 테스트와 UI 컴포넌트 생성을 동시에 진행 가능:
Task: "T008 [P] [US1] Create integration test for share card image generation in src/app/api/share/__tests__/route.test.ts"
Task: "T010 [P] [US1] Create ShareCard UI component for image rendering in src/components/features/ShareCard/index.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 & 2 (인프라 및 기초) 완료
2. Phase 3 (US1: 공유 카드) 구현 및 테스트
3. **검증**: 독립적으로 이미지 생성이 3초 이내에 되는지 확인 후 1차 배포

### Incremental Delivery

1. MVP 배포 후 US2 (궁합 테스트) 추가
2. 마지막으로 US3 (트렌드 대시보드) 추가하여 플랫폼 완성

---

## Notes

- 모든 태스크는 `Red-Green-Refactor` 주기를 따르며, 테스트 코드를 먼저 작성합니다.
- `src/lib` 폴더의 로직은 순수 함수 위주로 작성하여 테스트 용이성을 확보합니다.
- Supabase RLS 정책을 항상 확인하여 개인정보 유출을 방지합니다.
