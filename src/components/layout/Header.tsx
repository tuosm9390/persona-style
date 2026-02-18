"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export function Header() {
  const { t, language, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    changeLanguage(language === "ko" ? "en" : "ko");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-display text-xl font-bold tracking-tight">{t("header.title")}</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4">

          <Link href="/history" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hidden sm:block">
            {t("header.menu.history")}
          </Link>
          <Link href="/examples" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hidden sm:block">
            {t("header.menu.examples")}
          </Link>
          <Button variant="ghost" size="sm" onClick={toggleLanguage} className="w-16 px-0 gap-1">
            <Globe className="h-4 w-4" />
            <span className="text-xs font-medium uppercase">{language === "ko" ? "EN" : "KR"}</span>
          </Button>
          <Button size="sm" asChild>
            <Link href="/analyze">{t("common.startAnalysis")}</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
