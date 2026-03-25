# Data Model: 정밀 시각 분석 결과 (Visual Analysis Profile)

**Feature**: 고도화된 이미지 분석 프롬프트 엔지니어링 (003-advanced-prompt-engineering)

## Entities

### 1. VisualAnalysisProfile (Value Object / JSON Storage)
사진에서 정밀하게 분해된 시각적 특징들의 집합입니다. Supabase `analyses` 테이블의 `visual_profile` (JSONB) 컬럼에 저장됩니다.

| Field | Type | Description | Validation / Constraints |
|-------|------|-------------|--------------------------|
| `hair` | Object | 헤어 스타일 및 색상 | 필수 |
| `hair.style` | String | 스타일 (예: long_wavy, short_straight) | Enum candidates |
| `hair.color` | String | 기본 색상 및 하이라이트 | |
| `face` | Object | 얼굴 형태 및 톤 정보 | 필수 |
| `face.shape` | String | 얼굴형 (oval, round, square, etc.) | Enum |
| `face.tone` | String | 피부 밝기 및 언더톤 (warm, cool) | |
| `body` | Object | 체형 및 자세 정보 | 필수 |
| `body.type` | String | 체형 특징 (inverted_triangle, rectangle, etc.) | |
| `body.posture` | String | 자세 (upright, leaning, etc.) | |
| `apparel` | Object | 현재 착용 중인 의상 정보 | 필수 |
| `apparel.top` | Object | 상의 정보 (category, color, fit) | |
| `apparel.bottom`| Object | 하의 정보 (category, color, fit) | |
| `personal_color`| String | 최종 진단된 퍼스널 컬러 | 예: Spring Warm |
| `metadata` | Object | 분석 환경 정보 (조명, 화질 등) | |
| `metadata.anonymized` | Boolean | 익명화 처리 여부 (커뮤니티 공유 시 true) | Default: false |
| `metadata.version` | String | 사용된 프롬프트 엔진 버전 | |

## Validation Rules (Zod)
```typescript
const VisualAnalysisSchema = z.object({
  hair: z.object({
    style: z.string(),
    color: z.string(),
  }),
  face: z.object({
    shape: z.enum(['oval', 'round', 'square', 'heart', 'oblong']),
    tone: z.string(),
  }),
  body: z.object({
    type: z.string(),
    posture: z.string(),
  }),
  apparel: z.object({
    top: z.object({ category: z.string(), color: z.string(), fit: z.string() }),
    bottom: z.object({ category: z.string(), color: z.string(), fit: z.string() }),
  }),
  personal_color: z.string(),
});
```

## State Transitions
1. **Raw Image Upload**: 사용자가 이미지를 업로드함.
2. **Analysis Requested**: Gemini API에 정밀 분석 프롬프트 전송.
3. **Data Extracted**: AI가 JSON 데이터를 반환함.
4. **Validation**: API 경계에서 Zod 스키마 검증 수행.
5. **Storage/Response**: 유효한 데이터가 DB에 저장되거나 사용자에게 반환됨.
