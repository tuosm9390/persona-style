# API Contracts: 정밀 이미지 분석 (Advanced Analysis)

**Feature**: 고도화된 이미지 분석 프롬프트 엔지니어링 (003-advanced-prompt-engineering)

## Endpoints

### POST `/api/analyze` (확장)
이미지를 업로드하고 고도화된 프롬프트를 통해 정밀 분석 데이터를 생성합니다.

**Request Header**:
- `Content-Type: multipart/form-data`

**Request Body**:
- `image`: File (Required)
- `mode`: String (Optional, default: 'advanced')

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "profile": {
      "hair": { "style": "long_wavy", "color": "dark_brown" },
      "face": { "shape": "oval", "tone": "neutral_warm" },
      "body": { "type": "hourglass", "posture": "straight" },
      "apparel": {
        "top": { "category": "blouse", "color": "cream", "fit": "regular" },
        "bottom": { "category": "jeans", "color": "blue", "fit": "slim" }
      },
      "personal_color": "Autumn Mute"
    },
    "report": "고객님은 가을 뮤트 타입으로, 부드러운 크림색 블라우스와 중청 데님이 피부톤을 가장 돋보이게 합니다...",
    "generated_at": "2026-03-25T14:00:00Z"
  }
}
```

**Error Responses**:
- `400 Bad Request`: 이미지 파일 누락 또는 지원하지 않는 형식.
- `422 Unprocessable Entity`: AI 분석 결과가 JSON 스키마(Zod)를 통과하지 못함.
- `500 Internal Server Error`: AI 모델 응답 지연 또는 시스템 오류.

## Constraints
- **Timeout**: 전체 처리 시간은 3초 이내여야 함 (Constitution VI 준수).
- **Concurrency**: Gemini 1.5 Pro의 Rate Limit을 고려하여 API 설계.
