---
description: "Task list for Premium Expert Report feature implementation"
---

# Tasks: Premium Expert Report

**Input**: Design documents from `/specs/002-premium-expert-report/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Includes exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Install premium report dependencies (`@react-pdf/renderer`) in `package.json`
- [X] T002 Create private Supabase Storage bucket (`premium_pdfs`) via SQL or Console (Principle VII 준수)
- [X] T003 [P] Add Portone (아임포트) SDK script to `src/app/layout.tsx` or equivalent component

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T004 Define shared premium and payment types in `src/types/premium.ts`
- [X] T005 Implement `payment_transactions` and `premium_reports` tables in `supabase_schema.sql`
- [X] T006 [P] Implement dual-check RLS policies (Owner ID + Payment Status) for `premium_reports` in `supabase_schema.sql` (Constitution Principle VII)
- [X] T007 Implement payment verification service in `src/lib/payment.ts` using Portone API

---

## Phase 3: User Story 1 - 전문가 수준의 심층 분석 리포트 (Priority: P1) 🎯 MVP

**Goal**: Gemini 1.5 Pro를 통해 사용자의 성향을 다각도로 분석한 심층 리포트 생성

**Independent Test**: `/api/premium/analyze` 호출 시 결제 완료된 건에 대해 고품질 심층 분석 텍스트가 정상 생성되는지 확인

### Tests for User Story 1 (MANDATORY) ⚠️

- [X] T008 [P] [US1] Create unit test for Gemini 1.5 Pro deep analysis prompt in `src/lib/__tests__/premium.test.ts`
- [X] T009 [P] [US1] Create integration test for premium analysis API in `src/app/api/premium/__tests__/analyze.test.ts`

### Implementation for User Story 1

- [X] T010 [P] [US1] Implement deep analysis service using Gemini 1.5 Pro in `src/lib/premium.ts`
- [X] T011 [US1] Implement premium analysis API route in `src/app/api/premium/analyze/route.ts`
- [X] T012 [US1] Add logic to fetch and process existing analysis history for deep context in `src/lib/premium.ts`

---

## Phase 4: User Story 2 - 고해상도 프리미엄 레이아웃 시각화 (Priority: P2)

**Goal**: 분석 결과를 고품질 PDF 리포트로 시각화하여 제공 (3초 이내 생성 원칙 준수)

**Independent Test**: 리포트 다운로드 요청 시 3초 이내에 선명한 PDF 파일이 반환되는지 확인 (Constitution Principle VI)

### Tests for User Story 2 (MANDATORY) ⚠️

- [X] T013 [P] [US2] Create unit test for PDF generation logic in `src/lib/__tests__/pdf.test.ts`
- [X] T014 [P] [US2] Create integration test for PDF download API in `src/app/api/premium/__tests__/pdf.test.ts`

### Implementation for User Story 2

- [X] T015 [P] [US2] Create high-res PDF template using `react-pdf/renderer` in `src/components/features/PremiumReport/PDFTemplate.tsx`
- [X] T016 [US2] Implement PDF generation and storage service using Signed URLs in `src/lib/pdf.ts`
- [X] T017 [US2] Implement PDF download API route in `src/app/api/premium/pdf/[id]/route.tsx`
- [X] T018 [US2] Create premium report viewer UI in `src/app/premium/[id]/page.tsx`

---

## Phase 5: User Story 3 - 프리미엄 기능 결제 게이트웨이 UI (Priority: P3)

**Goal**: 유료 리포트 구매를 위한 안내 및 결제 프로세스 구현

**Independent Test**: 결제 버튼 클릭 시 Portone 결제창이 뜨고, 완료 후 리포트 접근 권한이 부여되는지 확인

### Tests for User Story 3 (MANDATORY) ⚠️

- [X] T019 [P] [US3] Create integration test for payment verification API in `src/app/api/payment/__tests__/verify.test.ts`

### Implementation for User Story 3

- [X] T020 [P] [US3] Create pricing and feature comparison component in `src/components/features/Payment/PricingCard.tsx`
- [X] T021 [US3] Implement payment verification API route in `src/app/api/payment/verify/route.ts`
- [X] T022 [US3] Create checkout page with Portone integration in `src/app/checkout/page.tsx`
- [X] T023 [US3] Implement 'Unlock Premium' CTA in existing analysis result page `src/app/analyze/page.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T024 [P] Update `README.md` with premium feature and payment documentation
- [X] T025 Performance optimization for PDF generation (caching, font bundling)
- [X] T026 [P] Security hardening for payment callbacks and RLS policies
- [X] T027 Final linting and type checking (`npm run lint`, `tsc`)
- [ ] T028 Run `quickstart.md` validation to ensure all setup steps work

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 시작 즉시 실행 가능
- **Foundational (Phase 2)**: Phase 1 완료 후 실행, 모든 User Story의 블로킹 요소
- **User Stories (Phase 3+)**: Foundational 단계 완료 후 병렬 또는 순차(P1 -> P2 -> P3) 진행 가능
- **Polish (Final Phase)**: 모든 User Story 구현 및 테스트 완료 후 진행

### User Story Dependencies

- **US1 (P1)**: Foundational 완료 후 진행 (결제 완료 상태 기반)
- **US2 (P2)**: US1의 분석 데이터 결과가 있어야 리포트 생성 가능
- **US3 (P3)**: Foundational 완료 후 진행 가능, 최종적으로 US1/US2와 결합

---

## Parallel Example: User Story 2

```bash
# PDF 템플릿 제작과 API 테스트를 동시에 진행 가능:
Task: "T013 [P] [US2] Create unit test for PDF generation logic in src/lib/__tests__/pdf.test.ts"
Task: "T015 [P] [US2] Create high-res PDF template using react-pdf/renderer in src/components/features/PremiumReport/PDFTemplate.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 & 2 (인프라 및 기초) 완료
2. Phase 3 (US1: 심층 분석) 구현 및 테스트
3. **검증**: 결제 없이도 특정 관리자 계정에서 심층 분석이 가능하도록 우선 구현

### Incremental Delivery

1. US3 (결제 UI) 추가하여 실제 수익화 모델 연동
2. US2 (PDF 다운로드) 추가하여 프리미엄 경험 완성

---

## Notes

- 헌장 v1.1.0에 따라 모든 시각적 결과물은 **3초 이내 생성을 목표**로 최적화합니다.
- 개인정보 보호를 위해 유료 리포트 데이터에 대한 **격리된 RLS 정책**을 철저히 검증합니다.
- `Portone` 환경변수(`STORE_ID`, `CHANNEL_KEY` 등)를 `.env.local`에 안전하게 관리합니다.
