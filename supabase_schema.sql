-- Supabase Database Schema for PersonaStyle
-- 이 SQL 스크립트를 Supabase SQL Editor에서 실행하여 테이블을 생성하세요.

-- 1. 분석 기록(history) 테이블 생성
CREATE TABLE analysis_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  input_type TEXT NOT NULL, -- 'photo', 'text', 'combined'
  summary JSONB NOT NULL,
  analysis JSONB NOT NULL,
  fashion JSONB NOT NULL,
  beauty JSONB NOT NULL,
  action_items JSONB NOT NULL,
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
