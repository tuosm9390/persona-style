"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-muted/20 py-8 mt-auto">
      <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-foreground">PersonaStyle</span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>
        
        <div className="flex gap-6">
          <Link href="/guide" className="hover:text-primary transition-colors">
            {t("nav.guide") || "Style Guide"}
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors">
            {t("nav.terms") || "Terms of Service"}
          </Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">
            {t("nav.privacy") || "Privacy Policy"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
