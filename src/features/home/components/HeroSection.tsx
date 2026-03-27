"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[1px] border-foreground/[0.03] rounded-full scale-[1.5]" />
      </div>

      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col items-center text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 max-w-4xl"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-primary/10 bg-white/50 backdrop-blur-sm text-[10px] uppercase tracking-[0.2em] font-bold text-primary/60 mb-4">
              <Sparkles className="h-3 w-3" />
              <span>{t("home.badge")}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium leading-[1.1] tracking-[-0.03em] text-balance">
              {t("home.title.prefix")} <br />
              <span className="text-luxury block md:inline">{t("home.title.highlight")}</span>
              <span className="font-sans font-light tracking-tighter ml-2">{t("home.title.suffix")}</span>
            </h1>

            <p className="mx-auto max-w-[640px] text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              {t("home.description")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4 min-[400px]:flex-row items-center"
          >
            <Button size="lg" className="h-14 px-10 text-base rounded-full shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95" asChild>
              <Link href="/analyze" className="flex items-center justify-center gap-2">
                {t("common.startAnalysis")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="lg" className="h-14 px-10 text-base rounded-full hover:bg-white/50 transition-colors" asChild>
              <Link href="/examples">
                {t("common.seeExamples")}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
