# Persona Style

## 프로젝트 개요 (Overview)
**Persona Style**은 사용자의 사진, 텍스트 등의 입력을 기반으로 전문가 수준의 심리, 패션, 뷰티 분석을 제공하고 최적의 "페르소나"를 도출하는 플랫폼입니다.
Gemini 1.5 Pro 모델을 활용해 개인화된 스타일/심리 분석을 수행하고, 도출된 디자인 리포트를 PDF나 고퀄리티 이미지 매체로 내보내어 SNS를 통한 바이럴 엔진 구동, 타 유저와의 "페르소나 매칭"까지 기능하는 Full-Stack 애플리케이션입니다.

## 핵심 파이프라인 (Core Pipeline)
1. **분석 기록 및 벡터 임베딩 (Analysis & Embedding)**
   - 다양한 Input(사진/텍스트 등)에 대해 분석 결과(summary, fashion, visual_profile 등)를 JSON 형태로 도출해 `analysis_history`에 저장합니다.
   - 이때 각 분석 결과는 Gemini Embedding 모델을 통해 `VECTOR(1536)` 차원으로 변환 및 저장되어 향후 "사용자 간 매칭"과 유사도 분석에 활용됩니다.
2. **바이럴 엔드포인트 및 바이럴 매칭 엔진 (Viral Matching)**
   - 렌더링 속도가 빠른 `satori`와 `@resvg/resvg-js`를 서버 사이드에서 활용하여 모바일 공유에 최적화된 9:16 카드 이미지를 즉시 생성해 반환합니다.
   - Supabase PostGIS/Vector 확장의 Cosine Similarity(`1 - (v1 <=> v2)`) RPC를 활용해 페르소나 매칭 점수를 빠르고 정확하게 도출합니다(`persona_matches`).
3. **프리미엄 심층 보고서 (Premium Export)**
   - PortOne SDK로 결제 시스템을 통합하여(`payment_transactions`), 결제 성공/콜백 시 `premium_reports` 레코드를 활성화합니다.
   - React-PDF와 HTML-to-Image를 하이브리드로 사용하여 클라이언트/서버에서 고해상도 A4 분량의 PDF 리포트(Deep Analysis)를 제공합니다.

## 프로젝트 구조 (Project Structure)
```text
persona-style/
├── src/
│   ├── app/                # UI 라우트 컴포넌트 
│   │   └── api/            # Viral(share, match, trend) 및 Premium API
│   ├── components/         # Radix UI, Framer Motion 기반 애니메이션 UI
│   └── lib/                # Supabase SSR, Sentry 로깅 등 공통 모듈
├── supabase_schema.sql         # 분석 결과, 벡터 임베딩, 임포트 DB 스키마
└── sentry.*.config.ts          # 클라이언트/서버/엣지 환경 모니터링
```

## 상세 기능 구현 (Technical Implementation)
- **Supabase RLS 및 익명화 통계 아키텍처**
  민감할 수 있는 개인 분석 리포트의 보안을 강화하고자 엄격한 Row Level Security(RLS)를 적용했습니다. 트렌드 통계를 생성할 때(`refresh_persona_stats` RPC) `user_id`를 완전히 배제한 채 Aggregation Only 전략으로 테이블을 재삽입하여 보안과 성능을 모두 챙겼습니다.
- **고도화된 Report Export Engine**
  Next.js Edge Runtime과 `Satori`를 결합하여 오픈그래프/바이럴 공유용 이미지는 Edge 레이어에서 수십 ms 안에 생성합니다. 복잡한 분석 도표가 들어간 A4 PDF 페이퍼워크 생성 단계는 Node 런타임의 `@react-pdf/renderer`로 워크로드를 분리하여 병목을 최소화했습니다.

## 사용 기술 및 라이브러리 (Tech Stack)
- **Frontend Core**: Next.js 16, React 19, Tailwind CSS v4, Framer Motion
- **Backend / Database**: Supabase SSR (`pgvector` 확장 포함), Zod
- **AI / LLM**: `@google/generative-ai` (Gemini 1.5 Pro)
- **PDF & Image Generation**: `satori`, `@react-pdf/renderer`, `html-to-image`, `@resvg/resvg-js`
- **Monitroing & Payments**: `@sentry/nextjs`, PortOne 결제 시스템
