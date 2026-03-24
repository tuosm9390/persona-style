# Research Report: Viral Engine Implementation

**Feature**: Viral Engine Construction
**Date**: 2026-03-24
**Status**: Completed

## Findings

### 1. Image Generation Strategy (Next.js 16)

- **Decision**: **Satori + Resvg** 활용 (Edge Runtime 지원)
- **Rationale**: 
    - HTML/CSS(Tailwind)를 SVG로 직접 변환하여 고품질 이미지 생성이 가능하며, Canvas API보다 유지보수가 쉬움.
    - Vercel OG 라이브러리와 호환되어 3초 이내의 빠른 응답 속도 보장.
    - 서버 부하를 최소화하면서 9:16 비율의 다양한 디자인 템플릿 적용 가능.
- **Alternatives considered**: 
    - `node-canvas`: 무겁고 서버 사이드 설치 복잡성 높음.
    - `html-to-image` (Client-side): 클라이언트 환경에 따른 품질 차이 및 성능 문제 우려.

### 2. Persona Matching Algorithm

- **Decision**: **Cosine Similarity (코사인 유사도)** 기반 벡터 매칭
- **Rationale**: 
    - Gemini API가 생성한 페르소나 키워드 및 성향 점수를 수치화하여 벡터로 변환 후 유사도 측정.
    - 단순 키워드 매칭보다 문맥적 의미를 포함한 정확도 높은 '궁합 점수' 산출 가능.
    - Supabase pgvector 확장을 활용하여 데이터베이스 레벨에서 빠른 계산 가능.
- **Alternatives considered**: 
    - 단순 문자열 일치 (Jaccard Similarity): 의미적 깊이 부족.

### 3. Trend Statistics Aggregation

- **Decision**: **Supabase RPC + Cron Jobs**
- **Rationale**: 
    - 실시간 집계는 트래픽 증가 시 DB 부하가 크므로, 1시간 단위로 집계 테이블을 업데이트하는 방식 채택.
    - 집계 결과를 `persona_stats` 테이블에 캐싱하여 조회 성능 극대화.
- **Alternatives considered**: 
    - Real-time aggregation on every request: 확장성 문제.

## Next Steps
- `data-model.md` 설계 (Trend 및 Matching 이력 테이블 추가)
- API 컨트랙트 정의 (share, match, trend 엔드포인트)
