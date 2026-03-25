"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnalysisResultDisplay } from "@/components/features/AnalysisResult";
import { Button } from "@/components/ui/button";
import { FormattedText } from "@/components/ui/formatted-text";
import { getExamples } from "@/lib/examples";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ExamplesPage() {
  const { t, language } = useLanguage();
  const examples = React.useMemo(() => getExamples(language), [language]);
  const [selectedId, setSelectedId] = React.useState(examples[0].id);
  const router = useRouter();

  const selectedExample =
    examples.find((ex) => ex.id === selectedId) || examples[0];

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Header />
      <main className="container flex-1 pt-32 pb-20 px-4 md:px-6">
        {/* Intro */}
        <div className="text-center space-y-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-block px-3 py-1 rounded-full border border-primary/5 bg-primary/[0.02] text-[10px] uppercase tracking-[0.2em] font-bold text-primary/40 mb-4">
              Inspiration
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-semibold tracking-tight text-primary">
              {t("examples.title")}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-6 font-light leading-relaxed">
              {t("examples.description")}
            </p>
          </motion.div>
        </div>

        {/* Tabs - Adjusted sticky top and premium polish */}
        <div className="sticky top-20 z-20 mb-16">
          <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-background/60 backdrop-blur-xl rounded-full border border-foreground/[0.03] shadow-2xl shadow-black/[0.02] max-w-fit mx-auto transition-all duration-500 hover:bg-background/80">
            {examples.map((ex) => (
              <Button
                key={ex.id}
                variant={selectedId === ex.id ? "default" : "ghost"}
                onClick={() => setSelectedId(ex.id)}
                className={cn(
                  "rounded-full px-6 transition-all duration-500 text-[11px] font-bold uppercase tracking-wider h-10",
                  selectedId === ex.id
                    ? "shadow-lg shadow-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-white/50",
                )}
                size="sm"
              >
                {ex.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="glass-card rounded-3xl p-10 mb-12 text-center space-y-4">
                <h2 className="text-3xl font-display font-bold text-primary italic tracking-tight">
                  {selectedExample.name}
                </h2>
                <p className="text-muted-foreground font-light max-w-2xl mx-auto italic">
                  &ldquo;{selectedExample.description}&rdquo;
                </p>
              </div>

              <AnalysisResultDisplay
                result={selectedExample.result}
                onReset={() => router.push("/analyze")}
                resetLabel={t("examples.button")}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-center mt-12 pb-12">
          <Button
            asChild
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("common.backToHome")}
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
