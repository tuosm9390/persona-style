# Implementation Plan: Viral Engine Construction

**Branch**: `001-viral-engine-construction` | **Date**: 2026-03-24 | **Spec**: [/specs/001-viral-engine-construction/spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-viral-engine-construction/spec.md`

## Summary

Persona Style 프로젝트의 바이럴 성장을 위해 고퀄리티 공유 카드 생성, 페르소나 매칭(궁합), 그리고 실시간 트렌드 대시보드를 구축합니다. Next.js 서버 사이드 렌더링과 Supabase Real-time/캐싱 기술을 활용하여 성능과 사용자 경험을 동시에 확보하는 기술적 접근을 취합니다.

## Technical Context

**Language/Version**: TypeScript / Node.js 20+  
**Primary Dependencies**: Next.js 16, Supabase SSR, Gemini API, Zod, Satori, Resvg  
**Storage**: Supabase (PostgreSQL)  
**Testing**: Jest, React Testing Library  
**Target Platform**: Vercel (Web)
**Project Type**: Web Application  
**Performance Goals**: 이미지 생성 3초 이내, 대시보드 데이터 1시간 이내 최신화  
**Constraints**: <200ms p95 API 응답, Supabase RLS 정책 준수  
**Scale/Scope**: 초기 1만 사용자 대응 가능한 아키텍처

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **한국어 준수**: 모든 문서 및 소통이 한국어로 작성되었는가?
- [x] **TDD 계획**: 테스트 케이스가 구현보다 먼저 정의되었는가?
- [x] **보안 검증**: API 경계 데이터 검증 및 Supabase RLS 정책이 고려되었는가?
- [x] **3-Strike 인지**: 에러 발생 시 무한 루프 방지 지침을 숙지하였는가?
- [x] **기술 스택 일치**: Next.js 16 + Supabase SSR 환경에 적합한 설계인가?

## Project Structure

### Documentation (this feature)

```text
specs/001-viral-engine-construction/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── checklists/
    └── requirements.md  # Specification checklist
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── api/
│   │   ├── share/       # Image generation API
│   │   ├── match/       # Persona matching API
│   │   └── trend/       # Trend statistics API
│   ├── feed/            # Social feed (existing)
│   └── trend/           # Trend dashboard page
├── components/
│   ├── features/
│   │   ├── ShareCard/   # Enhanced share card components
│   │   ├── Matcher/     # Matching UI components
│   │   └── Trend/       # Dashboard visualization
├── lib/
│   ├── matching.ts      # Matching logic & vector math
│   ├── storage.ts       # Image storage helpers
│   └── trend.ts         # Statistics aggregation logic
└── types/
    └── viral.ts         # New viral feature types
```

**Structure Decision**: 기존 Next.js 16 App Router 구조를 유지하며, `src/components/features`와 `src/lib` 폴더를 확장하여 기능을 모듈화합니다.

## Complexity Tracking

> **No violations found.**
