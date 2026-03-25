"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Globe, User, LogOut, History } from "lucide-react";

export function Header() {
  const { t, language, changeLanguage } = useLanguage();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  const toggleLanguage = () => {
    changeLanguage(language === "ko" ? "en" : "ko");
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-foreground/[0.03] bg-background/80 backdrop-blur-xl transition-all duration-300">
      <div className="container flex h-20 items-center justify-between px-4 mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center group">
            <span className="font-display text-2xl font-bold tracking-tighter text-primary group-hover:text-accent transition-colors">
              Persona<span className="text-luxury font-medium ml-0.5">Style</span>
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-3 md:gap-6">
          <div className="hidden lg:flex items-center gap-8 mr-4">
            <Link
              href="/feed"
              className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted-foreground transition-all hover:text-primary hover:tracking-[0.25em]"
            >
              Style Feed
            </Link>
            <Link
              href="/history"
              className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted-foreground transition-all hover:text-primary hover:tracking-[0.25em]"
            >
              {t("header.menu.history")}
            </Link>
            <Link
              href="/examples"
              className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted-foreground transition-all hover:text-primary hover:tracking-[0.25em]"
            >
              {t("header.menu.examples")}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="h-9 w-12 px-0 rounded-full hover:bg-white/50 border border-transparent hover:border-foreground/5 transition-all"
            >
              <Globe className="h-4 w-4 mr-1 opacity-60" />
              <span className="text-[10px] font-bold uppercase">
                {language === "ko" ? "EN" : "KR"}
              </span>
            </Button>

            {user ? (
              <div className="flex items-center gap-2 border-l border-foreground/5 pl-2 md:pl-4">
                <Link href="/history" className="flex items-center gap-2 hover:bg-white/50 p-1 rounded-full transition-all group">
                  <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                    <User className="h-4 w-4" />
                  </div>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                asChild
                className="hidden sm:inline-flex text-[11px] font-bold uppercase tracking-wider h-9 rounded-full"
              >
                <Link href="/login">{t("header.menu.login") || "Login"}</Link>
              </Button>
            )}


            <Button size="sm" asChild className="rounded-full px-6 h-9 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all hover:-translate-y-0.5 ml-1 text-xs font-bold uppercase tracking-tight">
              <Link href="/analyze">{t("common.startAnalysis")}</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

