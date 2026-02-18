"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ko } from "../lib/i18n/ko";
import { en } from "../lib/i18n/en";

export type Language = "ko" | "en";

interface LanguageContextType {
  language: Language;
  t: (key: string) => any;
  changeLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ko");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("persona-style-lang") as Language;
    if (saved && (saved === "ko" || saved === "en")) {
      setLanguage(saved);
    } else {
      // Default to browser language or 'ko' if not set
      const browserLang = navigator.language.startsWith("en") ? "en" : "ko";
      setLanguage(browserLang);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("persona-style-lang", lang);
  };

  const t = (key: string): any => {
    const keys = key.split(".");
    let value: any = language === "ko" ? ko : en;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k as keyof typeof value];
      } else {
        console.warn(`Translation missing for key: ${key}`);
        return key; // Fallback
      }
    }
    return value;
  };

  if (!isClient) {
    // Return children directly or a loading state to avoid hydration mismatch
    // But since we defaulted to 'ko' in state, we can just render.
    // However, to be safe with hydration, we might want to wait until client, 
    // or accept that initial render matches 'ko'.
    // Here we choose to render, assuming 'ko' is safe default.
    return (
      <LanguageContext.Provider value={{ language: "ko", t, changeLanguage }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
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
