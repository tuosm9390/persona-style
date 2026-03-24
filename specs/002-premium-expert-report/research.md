# Research Report: Premium Expert Report

**Feature**: Premium Expert Report
**Date**: 2026-03-24
**Status**: Completed

## Findings

### 1. PDF Generation Library (Vercel Integration)

- **Decision**: **react-pdf/renderer** 활용
- **Rationale**: 
    - Puppeteer는 서버리스 환경에서 바이너리 크기 및 메모리 사용량 제한으로 인해 실행 속도가 느리고 설정이 복잡함.
    - `react-pdf`는 React 컴포넌트 방식으로 레이아웃을 정의할 수 있어 유지보수가 쉽고, Vercel Serverless Functions에서 훨씬 가볍고 빠르게 동작함 (3초 이내 생성 원칙 준수 유리).
    - SVG 기반 렌더링으로 고해상도 출력이 보장됨.
- **Alternatives considered**: 
    - `Puppeteer/Playwright`: 정밀한 HTML 렌더링이 가능하나 성능 및 인프라 오버헤드 큼.
    - `jsPDF`: 복잡한 레이아웃 구현의 어려움.

### 2. Payment Gateway Integration

- **Decision**: **Portone (구 아임포트)** 활용 (국내 사용자 위주 우선)
- **Rationale**: 
    - 국내 신용카드, 계좌이체, 카카오페이 등 다양한 결제 수단을 단일 SDK로 쉽게 통합 가능.
    - Supabase Webhook과 연동하여 결제 상태를 실시간으로 처리하기 적합한 구조 제공.
    - 향후 글로벌 확장 시 Stripe로의 전환이 용이한 추상화 레이어 구축 예정.
- **Alternatives considered**: 
    - `Stripe`: 글로벌 확장에 유리하나 국내 특정 결제 수단 지원 제한적.

### 3. Gemini 1.5 Pro Prompt Engineering

- **Decision**: **Chain-of-Thought (CoT) Prompting**
- **Rationale**: 
    - 심층 분석 리포트는 논리적 추론 단계가 필요하므로, 단계별 분석(성격 -> 관계 -> 커리어)을 유도하는 프롬프트 체인을 구성하여 정확도를 높임.
    - 토큰 사용량 최적화를 위해 핵심 데이터만 임베딩하여 전달.

## Next Steps
- `data-model.md` 설계 (PremiumReport, PaymentTransaction 테이블)
- `/contracts/` 정의 (결제 승인 및 리포트 생성 API)
