import { SupabaseClient } from '@supabase/supabase-js';
import { generateMatchingSummary } from './gemini';

export async function calculatePersonaMatch(
  supabase: SupabaseClient,
  sourceId: string,
  targetId: string
) {
  // 1. 벡터 유사도 계산 (RPC 호출)
  // supabase_schema.sql에 match_vectors 함수가 정의되어 있다고 가정
  const { data: scoreData, error: scoreError } = await supabase.rpc('calculate_similarity', {
    source_id: sourceId,
    target_id: targetId,
  });

  if (scoreError) throw scoreError;

  const score = Math.round(scoreData * 100);

  // 2. Gemini를 이용한 궁합 텍스트 생성
  const { data: source } = await supabase.from('analysis_history').select('persona_type, core_keywords').eq('id', sourceId).single();
  const { data: target } = await supabase.from('analysis_history').select('persona_type, core_keywords').eq('id', targetId).single();

  const summary = await generateMatchingSummary(
    source?.persona_type,
    target?.persona_type,
    score
  );

  // 3. 결과 저장
  const { data: match, error: matchError } = await supabase
    .from('persona_matches')
    .insert({
      source_id: sourceId,
      target_id: targetId,
      score,
      analysis_text: summary,
    })
    .select()
    .single();

  if (matchError) throw matchError;

  return match;
}
