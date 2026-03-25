Date: 2026-03-25 11:30:00
Author: Antigravity

# 🛠️ Implementation Plan - Phase 1: Viral Engine & Infrastructure

본 계획서는 `Persona-Style` 프로젝트의 초기 바이럴 유입을 극대화하고, 현재 발견된 치명적 UI 버그를 수정하여 안정적인 서비스 기반을 마련하기 위한 1단계 구현 계획입니다.

---

## 1. 목표 (Objectives)
- **UI 무결성 확보**: 랜딩 페이지 및 분석 페이지의 중복 렌더링 버그 수정.
- **바이럴 엔진 구축**: 분석 결과를 9:16 비율의 이미지(인스타그램 스토리 최적화)로 생성 및 공유하는 기능 구현.
- **인증 기반 마련**: Supabase Auth 연동을 통한 사용자 데이터 자산화 준비.

---

## 2. 세부 작업 내역 (Tasks)

### Task 1: 치명적 UI 버그 수정 (Priority: P0)
- **대상 파일**: `src/app/page.tsx`, `src/app/analyze/page.tsx`
- **내용**: 
  - 랜딩 페이지 Features 섹션의 중복 렌더링 로직 제거.
  - 분석 페이지의 카드 헤더 및 설명 중복 배치 수정.
- **검증**: `npm run lint` 통과 및 실제 화면에서 중복 요소 제거 확인.

### Task 2: 인스타그램용 공유 카드 엔진 구현 (Priority: P1)
- **대상 파일**: `src/components/features/ShareCard.tsx`, `lib/storage.ts`
- **내용**:
  - `html-to-image` 또는 `Canvas API`를 활용한 9:16 비율 이미지 생성기 구현.
  - 페르소나 유형별 동적 테마(색상, 패턴) 적용.
  - 생성된 이미지를 Supabase Storage에 업로드 및 공유 링크 생성.
- **검증**: 분석 결과 페이지에서 '공유 이미지 저장' 버튼 클릭 시 3초 이내에 PNG 이미지 생성 및 다운로드 확인.

### Task 3: Supabase Auth 및 데이터 연동 (Priority: P2)
- **대상 파일**: `src/contexts/AuthContext.tsx`, `lib/history.ts`
- **내용**:
  - 소셜 로그인(Google, Kakao 등) UI 및 연동 로직 완성.
  - 분석 결과를 로그인한 사용자의 프로필에 영구 저장하는 로직 강화.
- **검증**: 로그인 후 분석 수행 시 `PersonaAnalysis` 테이블에 유저 ID와 함께 데이터가 정상 저장되는지 확인.

---

## 3. 테스트 전략 (Testing Strategy)

### 3.1 유닛 테스트
- `ShareCard` 컴포넌트가 페르소나 데이터를 입력받아 올바른 테마 클래스를 적용하는지 테스트.
- `lib/gemini.ts`의 응답 파싱 로직이 다양한 페르소나 유형에 대해 견고하게 작동하는지 검증.

### 3.2 수동 검증 (QA)
- 모바일 브라우저 환경에서 생성된 공유 카드의 텍스트 가독성 및 레이아웃 정밀 확인.
- 실제 인스타그램 스토리 업로드 테스트를 통한 규격 적합성 확인.

---

## 4. 리스크 관리 (Risk Management)
- **이미지 생성 부하**: 클라이언트 사이드 렌더링(`html-to-image`)을 우선 사용하여 서버 부하를 최소화하되, 기기 호환성 문제 발생 시 `resvg` 등 서버 사이드 렌더링으로 전환 고려.
- **인증 지연**: 소셜 로그인 승인 대기 기간 발생 시, 익명 유저로 먼저 진행 후 나중에 데이터를 연동하는 방식(Lazy Auth) 적용.

---

## 5. 일정 (Timeline)
- **Day 1**: Task 1 (버그 수정) 및 Task 2 (공유 엔진 기본 구조) 완료.
- **Day 2**: Task 2 (디자인 테마 적용) 및 Task 3 (Auth 연동) 완료.
- **Day 3**: 통합 테스트 및 최적화 후 Phase 1 종료.

---
**Approval Required: 위 계획대로 진행하시겠습니까?**
