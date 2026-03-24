# Data Model: Viral Engine

## Entities

### 1. `persona_analyses` (기존 테이블 확장)
사용자의 페르소나 분석 결과 및 공유 설정을 관리합니다.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | 분석 결과 고유 ID |
| user_id | uuid (FK) | 분석 수행 사용자 ID |
| persona_type | text | 도출된 페르소나 유형 |
| core_keywords | text[] | 핵심 키워드 목록 |
| design_config | jsonb | 이미지 생성에 사용된 색상, 패턴 정보 |
| is_public | boolean | 공개 여부 (기본: true) |
| share_count | int | 공유된 횟수 |
| created_at | timestamp | 생성 일시 |

### 2. `persona_matches`
두 사용자 간의 궁합 테스트 결과를 기록합니다.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | 매칭 결과 고유 ID |
| source_id | uuid (FK) | 첫 번째 분석 ID |
| target_id | uuid (FK) | 두 번째 분석 ID |
| score | int | 궁합 점수 (0-100) |
| analysis_text | text | 궁합 요약 및 팁 |
| created_at | timestamp | 생성 일시 |

### 3. `persona_stats`
트렌드 대시보드를 위한 집계 데이터를 저장합니다. (1시간 단위 갱신)

| Field | Type | Description |
|-------|------|-------------|
| id | serial (PK) | 레코드 고유 ID |
| persona_type | text | 페르소나 유형명 |
| count | int | 발생 빈도 |
| ratio | float | 전체 대비 비율 |
| updated_at | timestamp | 최신화 일시 |

## Validation Rules
- **Score**: 0 이상 100 이하의 정수.
- **Privacy**: `target_id` 사용자의 `is_public`이 false인 경우 매칭 정보 노출 금지.
- **Consistency**: `persona_stats`의 합계 비율은 항상 100%에 수렴해야 함.
