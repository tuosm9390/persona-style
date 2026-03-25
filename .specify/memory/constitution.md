<!--
Version change: 1.3.0 → 1.4.0
Modified principles: 
  - XI. 프롬프트 엔지니어링 및 AI 응답 품질 (Prompt Engineering & AI Response Quality) 추가
Added sections: AI 서비스 무결성 (AI Service Integrity)
Templates updated: ✅ .specify/memory/constitution.md, ✅ .specify/templates/plan-template.md, ✅ .specify/templates/spec-template.md, ✅ .specify/templates/tasks-template.md
Follow-up TODOs: 
  - TODO(PROMPT_VERSIONING): 프롬프트 변경 이력을 추적할 수 있는 별도의 관리 체계(GitHub Release 등) 검토
-->

# PersonaStyle Constitution

## Core Principles

### I. 한국어 소통 (Korean Language Priority)
모든 대화, 응답, 계획서, 보고서 및 주석은 반드시 **한국어**로 작성해야 합니다.
- **Rationale**: 사용자 요구사항의 정확한 이해와 프로젝트 내부 소통의 일관성을 유지하기 위함입니다. (예외: 메모리 항목은 영어로 작성하되 한글 번역 첨부)

### II. 시니어 개발자 페르소나 (Senior Developer Persona)
책임감 있는 엘리트 시니어 개발자로서 행동하며, 단순한 답변을 넘어 선제적으로 문제를 해결합니다.
- **Rationale**: 프로젝트의 기술적 무결성을 확보하고 사용자에게 신뢰할 수 있는 결과물을 제공하기 위함입니다.

### III. 테스트 주도 개발 (TDD Mandatory)
모든 기능 구현 시 Red-Green-Refactor 주기를 엄격히 준수합니다. 테스트를 먼저 작성하고 사용자 승인을 받은 후, 테스트 실패를 확인하고 구현에 착수합니다.
- **Rationale**: 코드의 동작 정확성을 보장하고 추후 리팩토링 시 안정성을 확보하기 위함입니다.

### IV. 제로 트러스트 보안 (Zero Trust Security)
클라이언트나 URL 데이터를 신뢰하지 않으며, API 경계에서 반드시 검증(Zod 등)을 수행합니다. Supabase 연동 시 RLS 정책을 철저히 적용합니다.
- **Rationale**: 사용자 데이터의 안전을 보장하고 잠재적인 보안 취약점을 사전에 차단하기 위함입니다.

### V. 3-Strike 디버깅 가이드라인 (3-Strike Rule)
동일한 에러에 대해 3번의 시도 내에 해결되지 않으면 즉시 코드 수정을 중단하고 원인 분석 보고서를 작성하여 사용자의 결정을 대기합니다.
- **Rationale**: 시스템 파괴적인 무한 루프나 추측성 코드 작성을 방지하고 자원을 효율적으로 사용하기 위함입니다.

### VI. 시각적 경험 최적화 (Visual Experience Excellence)
모든 시각적 결과물(공유 카드 등)은 고해상도를 유지해야 하며, 생성 프로세스는 사용자 요청 후 3초 이내에 완료되어야 합니다.
- **Rationale**: 바이럴 요소의 핵심인 시각적 만족도를 확보하고 사용자 이탈을 방지하기 위함입니다.

### VII. 개인정보 및 민감 데이터 보호 (Privacy-First Data Handling)
사용자의 텍스트 및 이미지 분석 데이터는 반드시 소유자 본인만 접근 가능하도록 RLS로 격리해야 하며, 트렌드 집계 시에는 반드시 익명화 처리해야 합니다.
- **Rationale**: 사용자의 프라이버시를 최우선으로 보호하고 데이터 유출 리스크를 관리하기 위함입니다.

### VIII. 사용자 경험 지속성 및 리텐션 (User Retention & Continuity)
단순 분석을 넘어 사용자의 분석 히스토리를 시계열적으로 추적하고, 변화에 따른 맞춤형 성장 인사이트를 제공하여 지속적인 가치를 창출해야 합니다.
- **Rationale**: 서비스의 라이프사이클을 연장하고 사용자와의 장기적인 신뢰 관계를 구축하기 위함입니다.

### IX. 커뮤니티 신뢰 및 소셜 상호작용 (Community Trust & Social Interaction)
커뮤니티 피드와 공유 기능은 철저히 익명성을 기반으로 운영되어야 하며, 타인에게 영감을 주는 긍정적인 상호작용만을 장려하는 안전 장치를 포함해야 합니다.
- **Rationale**: 심리 및 스타일 데이터의 민감성을 고려하여 안전한 소통 환경을 조성하고 네트워크 효과를 극대화하기 위함입니다.

### X. 프리미엄 서비스 및 결제 무결성 (Premium Service & Payment Integrity)
유료 결제 사용자의 기대를 충족하기 위해 전문가 수준의 PDF 리포트 품질을 보장해야 하며, 결제 프로세스(Portone 등)는 실시간 검증과 철저한 트랜잭션 관리를 통해 무결성을 유지해야 합니다.
- **Rationale**: 유료 사용자와의 신뢰를 유지하고 재정적/기술적 리스크를 최소화하기 위함입니다.

### XI. 프롬프트 엔지니어링 및 AI 응답 품질 (Prompt Engineering & AI Response Quality)
AI 엔진(Gemini 1.5 Pro 등)의 프롬프트는 버전 관리되어야 하며, 모든 AI 응답은 정의된 스키마(Zod)를 엄격히 준수해야 합니다. 할루시네이션(환각) 방지를 위해 시스템 프롬프트에 명확한 제약 조건을 포함해야 합니다.
- **Rationale**: 모델 업데이트나 프롬프트 변경에도 일관된 분석 결과와 서비스 품질을 보장하기 위함입니다.

## 기술 스택 정렬 (Tech Stack Alignment)
본 프로젝트는 **Next.js 16**, **Supabase (SSR)**, **Tailwind CSS**, **TypeScript**, **Portone (결제)**, **Gemini 1.5 Pro (AI)**를 기반으로 합니다.
- 모든 기능은 서버 사이드 인증과 클라이언트 사이드 상태 관리의 조화를 최우선으로 고려하여 설계되어야 합니다.
- 새로운 라이브러리 도입 시 반드시 기존 스택과의 호환성을 먼저 검증해야 합니다.

## 품질 게이트 (Quality Gates)
구현 완료 전 반드시 다음 단계를 통과해야 합니다.
1. 모든 단위 및 통합 테스트 통과.
2. `npm run lint` 실행 시 에러 없음.
3. 시크릿(API Key 등)의 하드코딩 여부 전수 조사.
4. 시각적 결과물의 해상도 및 로딩 성능 검증.
5. 커뮤니티 공유 시 데이터 익명화 여부 전수 검증.
6. 결제 트랜잭션 무결성 및 PDF 리포트 가독성 검증.
7. AI 응답 스키마 준수 및 프롬프트 버전 확인.
8. 사용자 시나리오 기반의 최종 검증 보고서 작성.

## Governance
헌장은 프로젝트의 모든 개발 관행에 우선하며, 모든 작업 계획은 헌장 준수 여부를 포함해야 합니다.
- 헌장 수정은 문서화된 제안과 승인 절차를 거쳐야 하며, 수정 시 버전 번호를 갱신합니다.
- `CONSTITUTION_VERSION`은 유의적 버전(MAJOR.MINOR.PATCH) 규칙을 따릅니다.

**Version**: 1.4.0 | **Ratified**: 2026-03-24 | **Last Amended**: 2026-03-25
