# Quickstart: Viral Engine Implementation

## 1. Environment Setup
- **Supabase Extensions**: `pgvector` 확장이 활성화되어 있는지 확인하세요.
- **Dependencies**: 
    ```bash
    npm install satori @resvg/resvg-js lucide-react
    ```

## 2. Image Generation (Satori)
`src/app/api/share/[id]/route.ts`에 Satori 엔진을 초기화하고, `src/components/features/ShareCard/` 내의 React 컴포넌트를 SVG로 변환하는 로직을 작성합니다.

## 3. Matching Logic
`src/lib/matching.ts`에서 두 페르소나의 벡터 유사도를 계산하는 함수를 구현합니다. Gemini API에 궁합 분석 프롬프트를 추가로 요청하여 텍스트 요약을 생성합니다.

## 4. Trend Aggregation
Supabase SQL Editor에서 `persona_stats` 테이블을 갱신하는 RPC 함수를 작성하고, Vercel Cron Jobs를 통해 1시간마다 호출되도록 설정합니다.

## 5. Frontend Integration
- **Share**: 분석 결과 페이지(`src/app/analyze/page.tsx`)에 '이미지로 저장' 버튼 추가.
- **Match**: `src/app/match/page.tsx` (신규) 페이지를 생성하여 두 사용자의 ID를 입력받거나 URL 파라미터로 처리.
- **Trend**: `src/app/trend/page.tsx` (신규) 페이지에서 차트 라이브러리(Recharts 등)를 사용하여 통계 시각화.
