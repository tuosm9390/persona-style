# Implementation Plan: 고도화된 이미지 분석 프롬프트 엔지니어링

**Branch**: `003-advanced-prompt-engineering` | **Date**: 2026-03-25 | **Spec**: [specs/003-advanced-prompt-engineering/spec.md]
**Input**: Feature specification from `/specs/003-advanced-prompt-engineering/spec.md`

## Summary
이미지 분석의 일관성을 확보하고 시각적 요소를 정밀하게 분해하여 구조화된 JSON 데이터로 추출하기 위해 Gemini 1.5 Pro 기반의 고도화된 프롬프트를 설계하고, Zod를 통한 API 경계 검증을 구현합니다.

## Technical Context

**Language/Version**: TypeScript / Node.js 20+  
**Primary Dependencies**: Next.js 16, Gemini 1.5 Pro API, Zod  
**Storage**: Supabase PostgreSQL (JSONB for analysis profile)  
**Testing**: Vitest (Unit tests for prompts), Playwright (E2E for API)  
**Target Platform**: Vercel / Web
**Project Type**: Web Service API  
**Performance Goals**: 이미지 분석 및 데이터 추출 < 3s (Constitution VI 준수)  
**Constraints**: Gemini API Rate Limit, High Resolution Artifacts  
**Scale/Scope**: 전신 인물 사진 분석, 필수 시각 요소 8종 이상 추출

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **한국어 준수**: 모든 문서 및 소통이 한국어로 작성되었는가?
- [x] **TDD 계획**: 테스트 케이스가 구현보다 먼저 정의되었는가?
- [x] **보안 검증**: API 경계 데이터 검증 및 Supabase RLS 정책이 고려되었는가?
- [x] **3-Strike 인지**: 에러 발생 시 무한 루프 방지 지침을 숙지하였는가?
- [x] **이미지 품질 보장**: 생성 시간이 3초 이내이며 고해상도 출력이 고려되었는가?
- [x] **데이터 프라이버시**: 분석 데이터의 익명화 및 RLS 접근 제어가 설계되었는가?
- [x] **리텐션/커뮤니티**: 시계열 추적 가치 및 익명 공유 안전 장치가 고려되었는가?
- [x] **기술 스택 일치**: Next.js 16 + Supabase SSR 환경에 적합한 설계인가?

## Project Structure

### Documentation (this feature)

```text
specs/003-advanced-prompt-engineering/
├── spec.md              # Feature Specification
├── plan.md              # This file
├── research.md          # Phase 0: Prompt & JSON Strategy
├── data-model.md        # Phase 1: VisualAnalysisProfile Schema
├── quickstart.md        # Implementation Guide
├── contracts/
│   └── api-contracts.md # API POST /api/analyze definition
└── tasks.md             # Implementation Tasks (To be generated)
```

### Source Code (repository root)

```text
src/
├── app/api/analyze/     # Main API Handler
├── lib/
│   ├── prompts.ts       # Structured Prompt Templates
│   ├── validation.ts    # Zod Schemas
│   └── types.ts         # TypeScript Interfaces
└── __tests__/
    └── prompts.test.ts  # Logic tests for prompt output
```

**Structure Decision**: 기존 Next.js 16 기반의 폴더 구조를 따르며, 프롬프트와 검증 로직은 `lib/` 폴더에 모듈화하여 관리합니다.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |
