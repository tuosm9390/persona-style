"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ko } from "../lib/i18n/ko";
import { en } from "../lib/i18n/en";

export type Language = "ko" | "en";

interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
  changeLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ko");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("persona-style-lang") as Language | null;
    if (saved && (saved === "ko" || saved === "en")) {
      setLanguage(saved);
    } else if (typeof navigator !== "undefined") {
      const browserLang = navigator.language.startsWith("en") ? "en" : "ko";
      setLanguage(browserLang);
    }
    // Set mounted last to avoid synchronous render loop
    setIsMounted(true);
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("persona-style-lang", lang);
    }
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: unknown = language === "ko" ? ko : en;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
    }
    
    return typeof value === "string" ? value : key;
  };

  // Consistent value during hydration
  const contextValue = {
    language: isMounted ? language : "ko",
    t,
    changeLanguage
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
