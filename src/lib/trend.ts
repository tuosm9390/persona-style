import { SupabaseClient } from '@supabase/supabase-js';

export async function getPersonaStats(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('persona_stats')
    .select('*')
    .order('count', { ascending: false });

  if (error) throw error;
  return data;
}

export async function refreshStats(supabase: SupabaseClient) {
  const { error } = await supabase.rpc('refresh_persona_stats');
  if (error) throw error;
}
