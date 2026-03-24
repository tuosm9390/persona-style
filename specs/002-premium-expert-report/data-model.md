# Data Model: Premium Expert Report

## Entities

### 1. `premium_reports`
사용자의 심층 분석 결과 및 생성된 리포트 파일 정보를 저장합니다.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | 리포트 고유 ID |
| analysis_id | uuid (FK) | 기반이 되는 기본 분석 ID |
| user_id | uuid (FK) | 소유 사용자 ID |
| deep_analysis_json | jsonb | Gemini 1.5 Pro가 생성한 심층 분석 데이터 |
| pdf_url | text | 생성된 PDF 파일의 저장 경로 (Supabase Storage) |
| payment_id | uuid (FK) | 연결된 결제 트랜잭션 ID |
| created_at | timestamp | 생성 일시 |

### 2. `payment_transactions`
결제 진행 상태 및 이력을 관리합니다.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | 트랜잭션 고유 ID |
| user_id | uuid (FK) | 결제 사용자 ID |
| imp_uid | text | Portone 결제 고유 번호 |
| merchant_uid | text | 상점 주문 번호 |
| amount | int | 결제 금액 |
| status | enum | 결제 상태 (ready, paid, cancelled, failed) |
| paid_at | timestamp | 결제 완료 일시 |
| created_at | timestamp | 요청 생성 일시 |

## Validation Rules
- **Access Control**: `premium_reports`는 `payment_transactions.status = 'paid'`인 경우에만 소유자에게 노출됨 (RLS 정책).
- **Integrity**: 하나의 `analysis_id` 당 하나의 유효한 `premium_reports`만 존재 가능.
