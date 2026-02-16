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
import { Sparkles, Loader2, Camera, PenLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AnalysisResult } from "../../../lib/types";

type AnalysisMode = "photo" | "text";

export default function AnalyzePage() {
  const [mode, setMode] = React.useState<AnalysisMode>("photo");
  const [image, setImage] = React.useState<File | null>(null);
  const [imageBase64, setImageBase64] = React.useState<string>("");
  const [text, setText] = React.useState("");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [result, setResult] = React.useState<AnalysisResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

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
      setError("사진을 업로드하거나 자기소개를 입력해주세요.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageBase64 || undefined,
          text: text || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "분석 중 오류가 발생했습니다.");
      }

      setResult(data.result);

      // Save to history
      const inputType = imageBase64 && text ? "combined" : imageBase64 ? "photo" : "text";
      if (typeof window !== "undefined") {
        const { saveAnalysisToHistory } = await import("../../../lib/history");
        saveAnalysisToHistory(data.result, inputType);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "분석 중 오류가 발생했습니다.";
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setImage(null);
    setImageBase64("");
    setText("");
    setError(null);
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
              나만의 스타일을 찾아보세요
            </h1>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              사진을 업로드하거나 자기소개를 작성해주세요.
              AI가 당신에게 가장 어울리는 패션과 뷰티 스타일을 추천해드립니다.
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex justify-center gap-3">
            <Button
              variant={mode === "photo" ? "default" : "outline"}
              onClick={() => setMode("photo")}
              className="rounded-full"
            >
              <Camera className="mr-2 h-4 w-4" />
              사진으로 분석
            </Button>
            <Button
              variant={mode === "text" ? "default" : "outline"}
              onClick={() => setMode("text")}
              className="rounded-full"
            >
              <PenLine className="mr-2 h-4 w-4" />
              자기소개로 분석
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
                        사진 업로드
                      </CardTitle>
                      <CardDescription>
                        전신 또는 얼굴 사진을 업로드해주세요.
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
                        추가 설명 (선택)
                      </CardTitle>
                      <CardDescription>
                        원하는 스타일이나 상황을 알려주시면 더 정확한 추천이
                        가능해요.
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
                      자기소개
                    </CardTitle>
                    <CardDescription>
                      피부톤, 체형, 성격, 선호하는 분위기, 스타일링이 필요한
                      상황 등을 자유롭게 작성해주세요.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TextInput onTextChange={setText} value={text} />
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-5 text-center space-y-3"
            >
              <p className="text-sm font-medium text-red-800">{error}</p>
              <p className="text-xs text-red-600/70">
                문제가 지속되면 잠시 후 다시 시도해주세요.
              </p>
            </motion.div>
          )}

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
                  AI 분석 중...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  스타일 분석 시작
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
