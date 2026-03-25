Date: 2026-03-25 14:30:00
Author: Antigravity

# 🛠️ Implementation Plan - Phase 2: Premium Report & Monetization

본 계획서는 `Persona-Style`의 수익 모델인 **프리미엄 전문가 리포트**를 구현하고, 사용자 결제 유도 및 PDF 다운로드 기능을 완성하기 위한 2단계 계획입니다.

---

## 1. 목표 (Objectives)
- **심층 리포트 생성**: Gemini 1.5 Pro를 활용하여 커리어, 관계, 스타일에 대한 2,000자 이상의 고품질 분석 텍스트 생성.
- **PDF 템플릿 구현**: `react-pdf`를 활용한 전문가 수준의 고퀄리티 PDF 리포트 생성.
- **결제 게이트웨이 준비**: 실제 결제 연동 전 결제 유도 UI(Paywall) 및 모의 결제 로직 구현.

---

## 2. 세부 작업 내역 (Tasks)

### Task 1: 프리미엄 분석 API 고도화 (Priority: P1)
- **대상 파일**: `src/app/api/premium/analyze/route.ts`, `lib/prompts.ts`
- **내용**: 
  - 프리미엄 전용 심층 분석 프롬프트 작성 (커리어 조언, 상세 아이템 매칭 등 포함).
  - Gemini 1.5 Pro 모델을 사용하여 고해상도 인사이트 추출.
- **검증**: API 호출 시 2,000자 이상의 구조화된 심층 리포트 데이터 반환 확인.

### Task 2: 전문가용 PDF 리포트 생성기 (Priority: P1)
- **대상 파일**: `src/components/features/PremiumReport/PDFTemplate.tsx`, `src/app/api/premium/pdf/[id]/route.tsx`
- **내용**:
  - `react-pdf/renderer`를 사용한 A4 규격 디자인 템플릿 구현.
  - 시각적 분석 결과(색상 팔레트, 체형 정보)를 포함한 다면적 레이아웃.
- **검증**: 리포트 다운로드 시 레이아웃이 깨지지 않는 정상적인 PDF 파일 생성 확인.

### Task 3: 결제 Paywall UI 및 상태 관리 (Priority: P2)
- **대상 파일**: `src/app/checkout/page.tsx`, `src/components/features/Payment/Paywall.tsx`
- **내용**:
  - 유료 리포트의 가치를 강조하는 '베네핏' 안내 컴포넌트.
  - Supabase를 활용한 결제 상태(PaymentTransaction) 관리 및 리포트 잠금 해제 로직.
- **검증**: 미결제 유저가 프리미엄 섹션 접근 시 안내 팝업 노출 및 결제 프로세스 진입 확인.

---

## 3. 테스트 전략 (Testing Strategy)

### 3.1 유닛 테스트
- PDF 생성기 함수가 유효하지 않은 데이터 입력 시 적절한 폴백(Fallback)을 제공하는지 테스트.
- 결제 상태 체크 미들웨어/함수의 보안 로직 검증.

### 3.2 사용자 경험 검증
- 결제 유도 문구가 매력적으로 구성되었는지, 결제 동선이 매끄러운지 확인.

---

## 4. 리스크 관리 (Risk Management)
- **PDF 한글 폰트 이슈**: `react-pdf`에서 한글 폰트 로딩 시 발생할 수 있는 깨짐 현상을 방지하기 위해 `Font.register` 최적화.
- **API 비용 관리**: Gemini 1.5 Pro의 고비용을 고려하여, 프리미엄 분석 결과는 Supabase에 캐싱하여 재결제 시 추가 비용 방지.

---

## 5. 일정 (Timeline)
- **Day 1**: Task 1 (프리미엄 API) 및 Task 2 (PDF 기본 템플릿) 완료.
- **Day 2**: Task 2 (디자인 고도화) 및 Task 3 (결제 UI) 완료.
- **Day 3**: 최종 통합 테스트 및 Phase 2 마무리.

---
**Approval Required: Phase 2 구현을 시작하시겠습니까?**
