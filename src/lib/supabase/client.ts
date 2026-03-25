import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * 브라우저 환경에서 사용할 Supabase 클라이언트를 생성합니다.
 * @supabase/ssr의 createBrowserClient를 사용하여 쿠키 기반 인증을 자동으로 처리합니다.
 */
export const createClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window === "undefined") {
      return createBrowserClient(
        "https://placeholder-project.supabase.co",
        "placeholder-anon-key"
      );
    }
    throw new Error("Supabase URL and Anon Key are required");
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

// 기존 코드와의 호환성을 위해 기본 클라이언트를 생성해둡니다.
export const supabase = (supabaseUrl && supabaseAnonKey) ? createClient() : null;

/**
 * Supabase가 설정되어 있는지 확인하는 유틸리티 함수입니다.
 */
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
