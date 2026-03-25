"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { UploadForm } from "@/components/features/UploadForm";
import { TextInput } from "@/components/features/TextInput";
import { AnalysisResultDisplay } from "@/components/features/AnalysisResult";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, Loader2, Camera, PenLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AnalysisResult } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { compressImage } from "@/lib/utils";

type AnalysisMode = "photo" | "text";

export default function AnalyzePage() {
  const { t, language } = useLanguage();
  const [mode, setMode] = React.useState<AnalysisMode>("photo");
  const [imageBase64, setImageBase64] = React.useState<string>("");
  const [text, setText] = React.useState("");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [loadingStep, setLoadingStep] = React.useState<string>("");
  const [result, setResult] = React.useState<AnalysisResult | null>(null);

  const handleImageSelect = async (file: File | null) => {
    if (file) {
      try {
        // Compress image before setting it to base64
        const compressed = await compressImage(file, 1024, 0.7);
        setImageBase64(compressed);
      } catch (err) {
        console.error("Compression error:", err);
        // Fallback to original reader if compression fails
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageBase64(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setImageBase64("");
    }
  };

  const handleAnalyze = async () => {
    if (!imageBase64 && !text) {
      toast.error(
        t("analyze.error.noInput") ||
          "사진을 업로드하거나 자기소개를 입력해주세요.",
      );
      return;
    }

    setIsAnalyzing(true);
    setLoadingStep("uploading");

    try {
      // Short delay to show uploading state
      await new Promise((resolve) => setTimeout(resolve, 800));

      setLoadingStep("analyzing");
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageBase64 || undefined,
          text: text || undefined,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("common.error"));
      }

      setLoadingStep("generating");
      // Simulate finishing step
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Save to history and get the final ID (Supabase UUID or local ID)
      const inputType =
        imageBase64 && text ? "combined" : imageBase64 ? "photo" : "text";

      let finalResult = { ...data.result };
      if (typeof window !== "undefined") {
        const { saveAnalysisToHistory } = await import("@/lib/history");
        const savedId = await saveAnalysisToHistory(data.result, inputType);
        finalResult.id = savedId;
      }

      setResult(finalResult);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("common.error");
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
      setLoadingStep("");
    }
  };

  const handleReset = () => {
    setResult(null);
    // setImage(null);
    setImageBase64("");
    setText("");
  };

  if (result) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
        <Header />
        <main className="container flex-1 pt-32 pb-20 px-4 md:px-6">
          <AnalysisResultDisplay result={result} onReset={handleReset} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Header />
      <main className="container flex-1 pt-32 pb-20 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-5xl space-y-12"
        >
          {/* Title Area */}
          <div className="text-center space-y-4">
            <div className="inline-block px-3 py-1 rounded-full border border-primary/5 bg-primary/[0.02] text-[10px] uppercase tracking-[0.2em] font-bold text-primary/40 mb-2">
              Step 01. Personal Data
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-semibold tracking-tight text-primary">
              {t("analyze.title")}
            </h1>
            <p className="text-muted-foreground max-w-[600px] mx-auto font-light leading-relaxed">
              {t("analyze.description")}
            </p>
          </div>

          {/* Mode Selector - Premium Style */}
          <div className="flex justify-center p-1.5 bg-foreground/[0.03] rounded-full max-w-sm mx-auto border border-foreground/[0.05]">
            <button
              onClick={() => setMode("photo")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-all",
                mode === "photo"
                  ? "bg-white text-primary shadow-sm"
                  : "text-muted-foreground hover:text-primary",
              )}
            >
              <Camera className="h-3.5 w-3.5" />
              {t("analyze.tabs.photo")}
            </button>
            <button
              onClick={() => setMode("text")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-all",
                mode === "text"
                  ? "bg-white text-primary shadow-sm"
                  : "text-muted-foreground hover:text-primary",
              )}
            >
              <PenLine className="h-3.5 w-3.5" />
              {t("analyze.tabs.text")}
            </button>
          </div>

          {/* Input Area with Glass Effect */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-8 md:grid-cols-2 items-stretch"
            >
              {mode === "photo" ? (
                <>
                  <div className="glass-card rounded-2xl p-8 flex flex-col space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                        <Camera className="h-5 w-5" />
                      </div>
                      <h2 className="font-display text-2xl font-bold">
                        {t("analyze.photoInput.label")}
                      </h2>
                    </div>
                    <UploadForm onImageSelect={handleImageSelect} />
                  </div>

                  <div className="glass-card rounded-2xl p-8 flex flex-col space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                        <PenLine className="h-5 w-5" />
                      </div>
                      <h2 className="font-display text-2xl font-bold">
                        {t("analyze.textInput.label")}
                      </h2>
                    </div>
                    <TextInput
                      onTextChange={setText}
                      value={text}
                      className="flex-1 min-h-[200px]"
                      placeholder={t("analyze.textInput.placeholder")}
                    />
                  </div>
                </>
              ) : (
                <div className="glass-card rounded-2xl p-8 md:col-span-2 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                      <PenLine className="h-5 w-5" />
                    </div>
                    <h2 className="font-display text-2xl font-bold">
                      {t("analyze.textInput.label")}
                    </h2>
                  </div>
                  <TextInput
                    onTextChange={setText}
                    value={text}
                    className="min-h-[300px]"
                    placeholder={t("analyze.textInput.placeholder")}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Submit Button - Enhanced */}
          <div className="flex justify-center pt-8">
            <Button
              size="lg"
              className="group relative overflow-hidden w-full md:w-auto min-w-[280px] h-16 rounded-full text-lg font-bold uppercase tracking-widest transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 active:scale-95 disabled:opacity-50"
              onClick={handleAnalyze}
              disabled={
                isAnalyzing || (mode === "photo" ? !imageBase64 : !text)
              }
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">
                    {t(`analyze.loading.${loadingStep}`) ||
                      t("common.analyzing")}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  <span>{t("analyze.button")}</span>
                </div>
              )}
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
