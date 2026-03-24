# API Contracts: Premium Expert Report

## 1. Request Premium Analysis
**Endpoint**: `POST /api/premium/analyze`
**Description**: 결제 완료 후 심층 분석을 시작합니다.

### Request Body
```json
{
  "analysis_id": "uuid",
  "payment_id": "uuid"
}
```

### Response (200 OK)
```json
{
  "report_id": "uuid",
  "status": "processing",
  "estimated_time": "3s"
}
```

---

## 2. Generate PDF Report
**Endpoint**: `GET /api/premium/pdf/[report_id]`
**Description**: 분석 결과를 바탕으로 PDF 파일을 생성하고 스트리밍합니다.

### Response (200 OK)
- **Content-Type**: `application/pdf`
- **Body**: Binary PDF data

---

## 3. Payment Verification (Webhook)
**Endpoint**: `POST /api/payment/verify`
**Description**: Portone 결제 완료 후 서버 측 검증을 수행합니다.

### Request Body
```json
{
  "imp_uid": "string",
  "merchant_uid": "string"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "payment_id": "uuid",
  "status": "paid"
}
```
