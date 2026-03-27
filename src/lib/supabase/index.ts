/**
 * Supabase 클라이언트 통합 익스포트
 * 클라이언트 사이드와 서버 사이드용 클라이언트를 구분하여 제공합니다.
 */

export { 
  createClient as createBrowserClient, 
  supabase as defaultBrowserClient,
  isSupabaseConfigured 
} from './client';

export { 
  createServerSupabaseClient 
} from './server';
