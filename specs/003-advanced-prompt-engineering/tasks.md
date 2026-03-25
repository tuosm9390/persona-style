---
description: "고도화된 이미지 분석 프롬프트 엔지니어링 기능 구현 태스크 리스트"
---

# Tasks: 고도화된 이미지 분석 프롬프트 엔지니어링

**Input**: Design documents from `/specs/003-advanced-prompt-engineering/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-contracts.md

**Tests**: 헌장(Constitution III)에 따라 모든 기능 구현 전 테스트 작성이 필수(TDD)입니다.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 실행 가능 (의존성 없는 개별 파일 작업)
- **[Story]**: 해당 태스크가 속한 사용자 스토리 (US1, US2, US3)

---

## Phase 1: Setup (공통 인프라 설정)

**Purpose**: 프로젝트 초기화 및 기초 구조 설정

- [X] T001 `specs/003-advanced-prompt-engineering/` 디렉토리 구조 검증 및 초기화
- [X] T002 `package.json`에 프롬프트 로직 검증을 위한 `vitest` 및 테스트 환경 설정 확인

---

## Phase 2: Foundational (공통 기반 작업)

**Purpose**: 모든 사용자 스토리에 공통적으로 필요한 데이터 모델 및 검증 스키마 구축

- [X] T003 [P] `src/lib/types.ts`에 시각 요소별 Enum(Fitzpatrick Scale 등) 및 Profile 인터페이스 정의
- [X] T004 [P] `src/lib/validation.ts`에 Zod 기반의 `VisualAnalysisSchema` 구현 (8개 필수 필드 포함)
- [X] T005 [P] `src/lib/prompts.ts`에 고도화 프롬프트 상수를 위한 기본 구조 생성

**Checkpoint**: 데이터 모델 및 검증 로직 준비 완료 - 사용자 스토리 구현 단계로 진입 가능

---

## Phase 3: User Story 1 - 일관된 퍼스널 컬러 분석 (Priority: P1) 🎯 MVP

**Goal**: 동일 이미지에 대해 90% 이상의 퍼스널 컬러 분석 일관성 확보

**Independent Test**: 동일한 사진을 10회 분석 요청하여 9회 이상 일치하는지 확인

### Tests for User Story 1 (MANDATORY) ⚠️

- [X] T006 [P] [US1] `src/lib/__tests__/prompts.test.ts`에 이미지 분석 결과 일관성 검증 유닛 테스트 작성 (Fail 확인 필수)

### Implementation for User Story 1

- [X] T007 [US1] `src/lib/prompts.ts`에 Reference Scale 및 이미지 정규화 지침을 포함한 `BASE_ANALYSIS_PROMPT` 구현
- [X] T008 [US1] `src/app/api/analyze/route.ts`를 업데이트하여 고도화된 프롬프트를 Gemini API에 전달하도록 수정
- [X] T009 [US1] 작성한 테스트(T006)를 실행하여 일관성 지표(90%) 통과 확인 (Pass)

**Checkpoint**: 퍼스널 컬러 분석의 일관성이 확보되어 MVP 수준의 신뢰도 달성

---

## Phase 4: User Story 2 - 시각적 요소의 정밀 분해 및 구조화 (Priority: P2)

**Goal**: 헤어, 얼굴, 피부, 체형 등 시각적 특징을 JSON으로 정밀 추출

**Independent Test**: 분석 결과 JSON 응답에 모든 필수 필드(8종 이상)가 정확히 포함되어 있는지 확인

### Tests for User Story 2 (MANDATORY) ⚠️

- [X] T010 [P] [US2] `src/lib/__tests__/prompts.test.ts`에 JSON 스키마 추출 및 Zod 검증 유닛 테스트 작성 (Fail 확인)

### Implementation for User Story 2

- [X] T011 [US2] `src/lib/prompts.ts`를 확장하여 위상 분석(Topological Analysis) 지침 및 JSON 출력 포맷 명시
- [X] T012 [US2] Gemini API 호출 부에서 JSON Mode 또는 Response Schema 옵션을 활성화하도록 `src/lib/gemini.ts` 수정
- [X] T013 [US2] API 핸들러(`src/app/api/analyze/route.ts`)에서 수신된 JSON을 Zod로 검증하고 오류 처리 로직 추가

**Checkpoint**: 시각적 요소가 정밀하게 분해되어 데이터화 가능해짐

---

## Phase 5: User Story 3 - 세분화된 분석 데이터를 통한 인사이트 제공 (Priority: P3)

**Goal**: 분해된 데이터를 기반으로 맞춤형 스타일 가이드 및 리포트 생성

**Independent Test**: 리포트 내용이 추출된 JSON 데이터(체형, 자세 등)를 구체적으로 인용하는지 확인

### Tests for User Story 3

- [X] T014 [P] [US3] `src/lib/__tests__/reports.test.ts`에 JSON 데이터 기반 리포트 생성 로직 테스트 작성

### Implementation for User Story 3

- [X] T015 [US3] `src/lib/reports.ts` 신규 생성 및 JSON 프로필을 분석하여 텍스트 리포트를 구성하는 로직 구현
- [X] T016 [US3] `src/components/features/AnalysisResult.tsx` 컴포넌트를 수정하여 분해된 시각 정보들을 화면에 렌더링

**Checkpoint**: 정밀 분석 데이터를 활용한 고차원적인 사용자 인사이트 제공 완료

---

## Phase 6: Retention & Community (헌장 v1.2.0 대응)

**Purpose**: 사용자 리텐션 강화를 위한 시계열 저장 및 커뮤니티 안전 공유 구현

- [X] T021 [US3] Supabase `analyses` 테이블에 `visual_profile` JSONB 컬럼 추가를 위한 migration 작성
- [X] T022 [US3] 분석 완료 후 결과를 DB에 저장하고 시계열 히스토리에 반영하는 로직 구현
- [X] T023 [US3] 커뮤니티 공유 시 데이터 익명화 처리를 수행하는 유틸리티 함수 작성

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: 성능, 보안, 품질 전반의 최종 검증

- [X] T017 [P] 이미지 분석 및 JSON 추출 전체 프로세스가 3초 이내에 완료되는지 성능 측정
- [X] T018 [P] Supabase RLS 정책을 확인하여 분석 프로필 데이터가 소유자 본인에게만 노출되는지 검증
- [X] T019 [P] `npm run lint` 및 `npx tsc`를 실행하여 코드 품질 및 타입 안정성 확인
- [X] T020 최종 검증 보고서 작성 및 `quickstart.md` 가이드 최신화
- [X] T024 [P] Zod 검증 실패 및 DB 저장 실패 시 '3-Strike Rule'에 따른 오류 리포팅 동작 검증

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** -> **Foundational (Phase 2)**: 기본 환경과 스키마가 정의되어야 기능 구현 가능
- **Foundational (Phase 2)** -> **User Stories (Phase 3+)**: 모델링 완료 후 각 스토리 병렬 진행 가능
- **Phase 3 (US1)** -> **Phase 4 (US2)**: 일관된 분석 프롬프트가 먼저 확립되어야 정밀 분해로 확장 용이
- **Phase 5/6**: 분석 데이터가 구조화된 후 저장 및 리포트 생성이 가능함

### Execution Strategy

1. **MVP First**: Phase 1, 2를 완료한 후 Phase 3(US1)를 최우선으로 구현하여 분석 신뢰도를 즉시 확보합니다.
2. **Incremental Delivery**: US1 성공 확인 후 US2(데이터 구조화)와 US3(UI 반영)를 순차적으로 추가합니다.
3. **TDD Discipline**: 각 단계마다 `Tests -> Implement -> Validate` 주기를 철저히 준수합니다.

---

## Parallel Example: User Story 2

```bash
# JSON 스키마 정의와 테스트 작성을 병렬로 진행 가능:
Task: "src/lib/validation.ts에 Zod 스키마 구현"
Task: "src/lib/__tests__/prompts.test.ts에 JSON 추출 테스트 작성"
```

---

## Notes

- 모든 태스크는 헌장의 '한국어 소통' 및 '3-Strike Rule'을 준수해야 합니다.
- API 성능 목표(3초)는 Gemini API의 응답 속도에 크게 의존하므로, 프롬프트 최적화를 통해 지연 시간을 최소화합니다.
- 데이터 익명화 원칙(Constitution VII)에 따라 트렌드 집계용 데이터와 개인 프로필 데이터를 엄격히 분리합니다.
