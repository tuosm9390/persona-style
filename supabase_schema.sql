-- Supabase Database Schema for PersonaStyle
-- 이 SQL 스크립트를 Supabase SQL Editor에서 실행하여 테이블을 생성하세요.

-- 0. 확장 활성화
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. 분석 기록(history) 테이블 생성 및 확장
CREATE TABLE analysis_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  input_type TEXT NOT NULL, -- 'photo', 'text', 'combined'
  summary JSONB NOT NULL,
  analysis JSONB NOT NULL,
  fashion JSONB NOT NULL,
  beauty JSONB NOT NULL,
  action_items JSONB NOT NULL,
  
  -- 고도화된 정밀 분석 필드 추가
  visual_profile JSONB,
  
  -- 바이럴 엔진 관련 필드 추가
  persona_type TEXT,
  core_keywords TEXT[],
  design_config JSONB DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT TRUE,
  share_count INT DEFAULT 0,
  embedding VECTOR(1536), -- Gemini Embedding 크기 (모델에 따라 조정 필요)

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Row Level Security (RLS) 활성화
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

-- 3. RLS 정책: 사용자는 자신의 기록만 보고 추가할 수 있습니다.
CREATE POLICY "Users can view their own history" 
ON analysis_history FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own history" 
ON analysis_history FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own history" 
ON analysis_history FOR DELETE 
USING (auth.uid() = user_id);

-- 4. 페르소나 매칭 기록 테이블 생성
CREATE TABLE persona_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID REFERENCES analysis_history(id) ON DELETE CASCADE,
  target_id UUID REFERENCES analysis_history(id) ON DELETE CASCADE,
  score INT NOT NULL,
  analysis_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. 매칭 테이블 RLS 활성화
ALTER TABLE persona_matches ENABLE ROW LEVEL SECURITY;

-- 6. 매칭 테이블 RLS 정책: 소스 또는 타겟 분석의 소유자만 볼 수 있음
CREATE POLICY "Users can view matches they are part of" 
ON persona_matches FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM analysis_history WHERE id = source_id AND user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM analysis_history WHERE id = target_id AND user_id = auth.uid())
);

-- 7. 벡터 유사도 계산 RPC
CREATE OR REPLACE FUNCTION calculate_similarity(source_id UUID, target_id UUID)
RETURNS FLOAT AS $$
DECLARE
  v1 VECTOR(1536);
  v2 VECTOR(1536);
BEGIN
  SELECT embedding INTO v1 FROM analysis_history WHERE id = source_id;
  SELECT embedding INTO v2 FROM analysis_history WHERE id = target_id;
  
  -- 코사인 유사도 반환 (1 - 코사인 거리)
  RETURN 1 - (v1 <=> v2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. 트렌드 통계 테이블 생성
CREATE TABLE persona_stats (
  id SERIAL PRIMARY KEY,
  persona_type TEXT UNIQUE NOT NULL,
  count INT DEFAULT 0,
  ratio FLOAT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. 통계 갱신 RPC (익명화 처리 강화)
CREATE OR REPLACE FUNCTION refresh_persona_stats()
RETURNS VOID AS $$
DECLARE
  total_count INT;
BEGIN
  -- 공개 설정된 데이터만 대상으로 하며, 식별자(user_id)는 전혀 참조하지 않음
  SELECT COUNT(*) INTO total_count FROM analysis_history WHERE is_public = TRUE;
  
  IF total_count > 0 THEN
    -- 기존 데이터 삭제 후 통계적 결과만 재삽입 (Aggregation Only)
    TRUNCATE persona_stats;
    
    INSERT INTO persona_stats (persona_type, count, ratio, updated_at)
    SELECT 
      persona_type, 
      COUNT(*), 
      (COUNT(*)::FLOAT / total_count * 100),
      now()
-- 10. 프리미엄 리포트 테이블 생성
CREATE TABLE premium_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID REFERENCES analysis_history(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  deep_analysis_json JSONB NOT NULL,
  pdf_url TEXT,
  payment_id UUID, -- payment_transactions와 연결 (추후 FK 추가 가능)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. 결제 트랜잭션 테이블 생성
CREATE TYPE payment_status AS ENUM ('ready', 'paid', 'cancelled', 'failed');

CREATE TABLE payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  imp_uid TEXT,
  merchant_uid TEXT UNIQUE NOT NULL,
  amount INT NOT NULL,
  status payment_status DEFAULT 'ready',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. RLS 활성화
ALTER TABLE premium_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- 13. RLS 정책 (원칙 VII 준수)
-- 결제 완료된 건에 대해서만 소유자가 접근 가능
CREATE POLICY "Users can view their own paid premium reports" 
ON premium_reports FOR SELECT 
USING (
  auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM payment_transactions 
    WHERE id = premium_reports.payment_id AND status = 'paid'
  )
);

CREATE POLICY "Users can view their own transactions" 
ON payment_transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
ON payment_transactions FOR UPDATE 
USING (auth.uid() = user_id);

-- 14. Storage Bucket 설정 안내 (SQL로 직접 생성이 제한될 수 있으므로 주석으로 기록)
-- insert into storage.buckets (id, name, public) values ('premium_pdfs', 'premium_pdfs', false);
-- CREATE POLICY "Premium PDF Access" ON storage.objects FOR SELECT USING (bucket_id = 'premium_pdfs' AND auth.uid() = owner);

-- 15. 추가 RLS 정책 (Insert)
CREATE POLICY "Users can insert their own premium reports" 
ON premium_reports FOR INSERT 
WITH CHECK (auth.uid() = user_id);
