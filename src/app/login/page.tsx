"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Mail, Github } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);

  const getAuthRedirectUrl = React.useCallback(() => {
    return `${window.location.origin}/auth/callback`;
  }, []);

  // 이미 로그인되어 있으면 홈으로 리다이렉트
  React.useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    const redirectUrl = getAuthRedirectUrl();

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;
      toast.success("로그인 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요!");
      } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "로그인 시도 중 오류가 발생했습니다.";
      toast.error(message);
      } finally {
      setIsLoading(false);
      }
      };

      const handleSocialLogin = async (provider: 'github' | 'google') => {
      const redirectUrl = getAuthRedirectUrl();
      
      console.log(`Attempting ${provider} login with redirectUrl: ${redirectUrl}`);

      try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
        },
      });
      if (error) throw error;
      } catch (error: unknown) {
      console.error(`${provider} login error:`, error);
      let message = "소셜 로그인 중 오류가 발생했습니다.";
      
      if (error instanceof Error) {
        if (error.message.includes("missing OAuth secret")) {
          message = `${provider === 'google' ? 'Google' : 'Github'} 로그인 설정이 완료되지 않았습니다. 관리자에게 문의하세요.`;
        } else {
          message = error.message;
        }
      }
      
      toast.error(message);
      }
      };


  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Header />
      <main className="container flex-1 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-muted bg-background/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">PersonaStyle 시작하기</CardTitle>
              <CardDescription>
                로그인하고 나만의 스타일 분석 기록을 안전하게 보관하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Magic Link Form */}
              <form onSubmit={handleMagicLinkLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    이메일 주소
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
                  {isLoading ? "전송 중..." : "이메일로 로그인 링크 받기"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">또는 소셜 계정으로 로그인</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="rounded-full" onClick={() => handleSocialLogin('github')}>
                  <Github className="mr-2 h-4 w-4" /> Github으로 계속하기
                </Button>
                <Button variant="outline" className="rounded-full" onClick={() => handleSocialLogin('google')}>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google로 계속하기
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <p className="mt-8 text-center text-sm text-muted-foreground">
            계속 진행함으로써 PersonaStyle의 <a href="/terms" className="underline hover:text-primary">이용약관</a> 및 <a href="/privacy" className="underline hover:text-primary">개인정보 처리방침</a>에 동의하게 됩니다.
          </p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
