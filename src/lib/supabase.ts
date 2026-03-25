import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * 브라우저 환경에서 사용할 Supabase 클라이언트를 생성합니다.
 * @supabase/ssr의 createBrowserClient를 사용하여 쿠키 기반 인증을 자동으로 처리합니다.
 */
export const createClient = () => {
  // 빌드 타임이나 환경 변수가 없는 환경에서 에러가 발생하여 빌드가 중단되는 것을 방지하기 위해 
  // 더미 값을 사용하거나 null 체크를 유도합니다.
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window === "undefined") {
      // 서버/빌드 환경에서는 더미 클라이언트를 반환하여 prerendering 오류를 방지합니다.
      return createBrowserClient(
        "https://placeholder-project.supabase.co",
        "placeholder-anon-key"
      );
    }
    // 브라우저 환경에서 실제로 필요할 때만 에러를 발생시킵니다.
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
