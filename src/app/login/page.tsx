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
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
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
      try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "소셜 로그인 중 오류가 발생했습니다.";
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
