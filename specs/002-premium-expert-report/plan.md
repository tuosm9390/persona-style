# Implementation Plan: Premium Expert Report

**Branch**: `002-premium-expert-report` | **Date**: 2026-03-24 | **Spec**: [/specs/002-premium-expert-report/spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-premium-expert-report/spec.md`

## Summary

Persona Style의 수익화를 위해 Gemini 1.5 Pro 기반의 심층 분석 리포트를 제공하고, 고해상도 PDF 시각화 및 결제 게이트웨이 연동 기초를 구축합니다. 헌장 v1.1.0의 시각적 품질(3초 이내 생성) 및 데이터 보호 원칙을 최우선으로 준수합니다.

## Technical Context

**Language/Version**: TypeScript / Node.js 20+  
**Primary Dependencies**: Next.js 16, Supabase SSR, Gemini 1.5 Pro API, Zod, react-pdf/renderer, Portone  
**Storage**: Supabase (PostgreSQL), Supabase Storage (for PDF files)  
**Testing**: Jest, React Testing Library  
**Target Platform**: Vercel (Web)
**Project Type**: Web Application  
**Performance Goals**: 리포트 생성 3초 이내 (최대 5초), 고해상도 출력  
**Constraints**: 유료 결제 여부에 따른 RLS 정책 적용, 개인정보 암호화  
**Scale/Scope**: 프리미엄 사용자 1,000명 대응 가능한 초기 아키텍처

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **한국어 준수**: 모든 문서 및 소통이 한국어로 작성되었는가?
- [x] **TDD 계획**: 테스트 케이스가 구현보다 먼저 정의되었는가?
- [x] **보안 검증**: API 경계 데이터 검증 및 Supabase RLS 정책이 고려되었는가?
- [x] **3-Strike 인지**: 에러 발생 시 무한 루프 방지 지침을 숙지하였는가?
- [x] **이미지 품질 보장**: 생성 시간이 3초 이내이며 고해상도 출력이 고려되었는가?
- [x] **데이터 프라이버시**: 분석 데이터의 익명화 및 RLS 접근 제어가 설계되었는가?
- [x] **기술 스택 일치**: Next.js 16 + Supabase SSR 환경에 적합한 설계인가?

## Project Structure

### Documentation (this feature)

```text
specs/002-premium-expert-report/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── api/
│   │   ├── premium/     # Premium analysis & PDF generation API
│   │   └── payment/     # Payment webhook & status API
│   ├── premium/         # Premium report dashboard/view
│   └── checkout/        # Payment gateway UI
├── components/
│   ├── features/
│   │   ├── PremiumReport/ # High-res report components
│   │   └── Payment/       # Checkout & Pricing components
├── lib/
│   ├── premium.ts       # Gemini 1.5 Pro deep analysis logic
│   └── pdf.ts           # PDF generation service
└── types/
    └── premium.ts       # Premium feature & Payment types
```

**Structure Decision**: 기존 App Router 구조를 유지하며, 유료 기능 전용 `premium` 및 `payment` 모듈을 신설하여 격리합니다.

## Complexity Tracking

> **No violations found.**
