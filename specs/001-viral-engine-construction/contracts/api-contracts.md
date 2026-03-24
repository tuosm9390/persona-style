# API Contracts: Viral Engine

## 1. Image Generation API
**Endpoint**: `GET /api/share/[analysis_id]`
**Description**: 분석 결과를 기반으로 공유용 9:16 카드를 생성합니다.

### Parameters
- `analysis_id`: string (UUID) - 대상 분석 ID
- `format`: enum (png, svg) - 이미지 형식 (기본: png)

### Response (200 OK)
- **Content-Type**: `image/png` or `image/svg+xml`
- **Body**: Binary image data

---

## 2. Persona Matching API
**Endpoint**: `POST /api/match`
**Description**: 두 페르소나의 궁합을 분석합니다.

### Request Body
```json
{
  "source_id": "uuid",
  "target_id": "uuid"
}
```

### Response (200 OK)
```json
{
  "match_id": "uuid",
  "score": 85,
  "summary": "서로의 다른 성향이 상호 보완적인 최고의 파트너입니다.",
  "tips": [
    "상대방의 논리적인 설명을 경청해 주세요.",
    "함께 새로운 창의적인 활동을 시도해 보세요."
  ]
}
```

---

## 3. Trend Statistics API
**Endpoint**: `GET /api/trend`
**Description**: 실시간(1시간 캐싱) 페르소나 분포 통계를 반환합니다.

### Response (200 OK)
```json
{
  "last_updated": "2026-03-24T14:00:00Z",
  "total_count": 10500,
  "distributions": [
    {
      "persona_type": "철학적 몽상가",
      "count": 2100,
      "ratio": 20.0,
      "rank": 1
    },
    {
      "persona_type": "현실적 개척자",
      "count": 1890,
      "ratio": 18.0,
      "rank": 2
    }
  ]
}
```
