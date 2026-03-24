"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe, User, LogOut, History } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export function Header() {
  const { t, language, changeLanguage } = useLanguage();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    if (isSupabaseConfigured()) {
      // Get initial session
      supabase!.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase!.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    await supabase!.auth.signOut();
    window.location.href = "/";
  };

  const toggleLanguage = () => {
    changeLanguage(language === "ko" ? "en" : "ko");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-display text-xl font-bold tracking-tight text-primary">
              PersonaStyle
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-4 mr-2">
            <Link
              href="/feed"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Style Feed
            </Link>
            <Link
              href="/history"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1.5"
            >
              <History className="h-4 w-4" />
              {t("header.menu.history")}
            </Link>
            <Link
              href="/examples"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("header.menu.examples")}
            </Link>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="w-12 px-0 gap-1 md:w-16"
          >
            <Globe className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase md:text-xs">
              {language === "ko" ? "EN" : "KR"}
            </span>
          </Button>

          {user ? (
            <div className="flex items-center gap-2 border-l pl-2 md:pl-4">
              <Link href="/history" className="flex items-center gap-2 hover:bg-muted p-1.5 rounded-full transition-colors">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-medium hidden lg:block max-w-[100px] truncate">{user.email}</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              asChild
              className="hidden sm:inline-flex text-xs font-bold"
            >
              <Link href="/login">로그인</Link>
            </Button>
          )}

          <Button size="sm" asChild className="rounded-full px-4 h-9 shadow-sm ml-1">
            <Link href="/analyze">{t("common.startAnalysis")}</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
