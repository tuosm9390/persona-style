"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { UploadForm } from "@/components/features/UploadForm";
import { TextInput } from "@/components/features/TextInput";
import { AnalysisResultDisplay } from "@/components/features/AnalysisResult";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormattedText } from "@/components/ui/formatted-text";
import { Sparkles, Loader2, Camera, PenLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AnalysisResult } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

type AnalysisMode = "photo" | "text";

export default function AnalyzePage() {
  const { t, language } = useLanguage();
  const [mode, setMode] = React.useState<AnalysisMode>("photo");
  const [image, setImage] = React.useState<File | null>(null);
  const [imageBase64, setImageBase64] = React.useState<string>("");
  const [text, setText] = React.useState("");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [loadingStep, setLoadingStep] = React.useState<string>("");
  const [result, setResult] = React.useState<AnalysisResult | null>(null);

  const handleImageSelect = (file: File | null) => {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageBase64("");
    }
  };

  const handleAnalyze = async () => {
    if (!imageBase64 && !text) {
      toast.error(t("analyze.error.noInput") || "사진을 업로드하거나 자기소개를 입력해주세요.");
      return;
    }

    setIsAnalyzing(true);
    setLoadingStep("uploading");

    try {
      // Short delay to show uploading state
      await new Promise(resolve => setTimeout(resolve, 800));

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
      await new Promise(resolve => setTimeout(resolve, 800));

      setResult(data.result);

      // Save to history
      const inputType = imageBase64 && text ? "combined" : imageBase64 ? "photo" : "text";
      if (typeof window !== "undefined") {
        const { saveAnalysisToHistory } = await import("@/lib/history");
        saveAnalysisToHistory(data.result, inputType);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : t("common.error");
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
      setLoadingStep("");
    }
  };

  const handleReset = () => {
    setResult(null);
    setImage(null);
    setImageBase64("");
    setText("");
  };

  if (result) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/30">
        <Header />
        <main className="container flex-1 py-12 px-4 md:px-6">
          <AnalysisResultDisplay result={result} onReset={handleReset} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Header />
      <main className="container flex-1 py-12 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl space-y-8"
        >
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-display font-bold tracking-tight md:text-4xl">
              {t("analyze.title")}
            </h1>
            <h1 className="text-3xl font-display font-bold tracking-tight md:text-4xl">
              {t("analyze.title")}
            </h1>
            <FormattedText
              text={t("analyze.description")}
              className="text-muted-foreground max-w-[600px] mx-auto"
            />
          </div>

          {/* Mode Selector */}
          <div className="flex justify-center gap-3">
            <Button
              variant={mode === "photo" ? "default" : "outline"}
              onClick={() => setMode("photo")}
              className="rounded-full"
            >
              <Camera className="mr-2 h-4 w-4" />
              {t("analyze.tabs.photo")}
            </Button>
            <Button
              variant={mode === "text" ? "default" : "outline"}
              onClick={() => setMode("text")}
              className="rounded-full"
            >
              <PenLine className="mr-2 h-4 w-4" />
              {t("analyze.tabs.text")}
            </Button>
          </div>

          {/* Input Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === "photo" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "photo" ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 md:grid-cols-2"
            >
              {mode === "photo" ? (
                <>
                  <Card className="border-muted bg-background/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5 text-primary" />
                        {t("analyze.tabs.photo")}
                      </CardTitle>
                      <CardDescription>
                        <FormattedText as="span" text={t("analyze.description")} />
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UploadForm onImageSelect={handleImageSelect} />
                    </CardContent>
                  </Card>
                  <Card className="border-muted bg-background/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PenLine className="h-5 w-5 text-primary" />
                        {t("analyze.tabs.text")}
                      </CardTitle>
                      <CardDescription>
                        {t("analyze.textInput.label")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TextInput onTextChange={setText} value={text} />
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="border-muted bg-background/50 backdrop-blur-sm md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PenLine className="h-5 w-5 text-primary" />
                      {t("analyze.tabs.text")}
                    </CardTitle>
                    <CardDescription>
                      {t("analyze.textInput.label")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TextInput onTextChange={setText} value={text} />
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>



          {/* Submit */}
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              className="w-full md:w-auto min-w-[200px] text-lg h-12 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              onClick={handleAnalyze}
              disabled={
                isAnalyzing ||
                (mode === "photo" ? !imageBase64 : !text)
              }
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t(`analyze.loading.${loadingStep}`) || t("common.analyzing")}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  {t("analyze.button")}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
