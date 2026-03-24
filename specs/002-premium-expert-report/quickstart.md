# Quickstart: Premium Expert Report Implementation

## 1. Library Installation
```bash
npm install @react-pdf/renderer
# Portone SDK는 클라이언트 사이드 script로 추가
```

## 2. Gemini 1.5 Pro Integration
`src/lib/premium.ts`에 심층 분석 전용 프롬프트를 작성합니다. 기존 `gemini.ts`의 인프라를 활용하되, 모델명을 `gemini-1.5-pro`로 지정하여 호출합니다.

## 3. PDF Layout Design
`src/components/features/PremiumReport/PDFTemplate.tsx` 파일을 생성하고 `react-pdf/renderer`의 `Document`, `Page`, `View`, `Text` 컴포넌트를 사용하여 A4 레이아웃을 구성합니다.

## 4. Payment Flow
1. 클라이언트에서 Portone SDK 호출.
2. 결제 완료 후 `imp_uid`를 서버 `/api/payment/verify`로 전달.
3. 서버에서 Portone API를 통해 금액 일치 여부 확인 후 `payment_transactions` 상태 업데이트.
4. 결제 성공 시 `premium_reports` 생성 트리거.

## 5. Security & RLS
- `premium_reports` 테이블에 결제 완료 상태를 체크하는 RLS Policy를 적용합니다.
- `SELECT` 정책 예시: 
  ```sql
  USING (auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM payment_transactions WHERE id = payment_id AND status = 'paid'
  ))
  ```
