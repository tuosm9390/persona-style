import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * 서버 환경(API Route, Server Action, Server Component)에서 사용할 Supabase 클라이언트를 생성합니다.
 * @supabase/ssr의 createServerClient를 사용하여 쿠키 기반 인증을 처리합니다.
 */
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // 서버 컴포넌트에서 호출될 경우 setAll이 무시될 수 있습니다.
          // 미들웨어에서 이미 처리되도록 구성하는 것이 일반적입니다.
        }
      },
    },
  });
};
