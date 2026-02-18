"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { AnalysisResultDisplay } from "@/components/features/AnalysisResult";
import { Button } from "@/components/ui/button";
import { FormattedText } from "@/components/ui/formatted-text";
import { getExamples } from "@/lib/examples";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ExamplesPage() {
  const { t, language } = useLanguage();
  const examples = React.useMemo(() => getExamples(language), [language]);
  const [selectedId, setSelectedId] = React.useState(examples[0].id);
  const router = useRouter();

  const selectedExample = examples.find((ex) => ex.id === selectedId) || examples[0];

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Header />
      <main className="container flex-1 py-12 px-4 md:px-6">
        {/* Intro */}
        <div className="text-center space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              {t("examples.badge")}
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight md:text-4xl">
              {t("examples.title")}
            </h1>
            <FormattedText
              text={t("examples.description")}
              className="text-muted-foreground max-w-2xl mx-auto mt-4 text-center"
            />
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 sticky top-20 z-10 bg-background/80 backdrop-blur-md p-4 rounded-full border shadow-sm max-w-fit mx-auto">
          {examples.map((ex) => (
            <Button
              key={ex.id}
              variant={selectedId === ex.id ? "default" : "ghost"}
              onClick={() => setSelectedId(ex.id)}
              className="rounded-full px-4 sm:px-6 transition-all duration-300"
              size="sm"
            >
              {ex.name}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-br from-primary/5 to-secondary/20 rounded-2xl border border-primary/10 p-8 mb-8 text-center">
                <h2 className="text-2xl font-bold mb-2">{selectedExample.name}</h2>
                <FormattedText
                  text={selectedExample.description}
                  className="text-muted-foreground"
                />
              </div>

              <AnalysisResultDisplay
                result={selectedExample.result}
                onReset={() => router.push('/analyze')}
                resetLabel={t("examples.button")}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-center mt-12 pb-12">
          <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("common.backToHome")}
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
