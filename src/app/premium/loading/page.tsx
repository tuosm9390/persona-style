"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

function PremiumLoadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const analysisId = searchParams.get("analysis_id");
  const paymentId = searchParams.get("payment_id");
  const [step, setStep] = useState(0);

  const steps = [
    { icon: <ShieldCheck className="h-5 w-5" />, text: "결제 정보를 확인하고 있습니다..." },
    { icon: <Zap className="h-5 w-5" />, text: "Gemini 2.5 Pro 모델을 연결 중입니다..." },
    { icon: <Sparkles className="h-5 w-5" />, text: "당신만을 위한 심층 브랜드 전략을 수립하고 있습니다..." },
    { icon: <Loader2 className="h-5 w-5 animate-spin" />, text: "고해상도 PDF 리포트를 생성하고 있습니다..." },
  ];

  useEffect(() => {
    if (!analysisId) {
      toast.error("잘못된 접근입니다.");
      router.push("/");
      return;
    }

    const generateReport = async () => {
      try {
        // Start steps animation
        const interval = setInterval(() => {
          setStep((s) => (s < steps.length - 1 ? s + 1 : s));
        }, 3000);

        const response = await fetch("/api/premium/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analysis_id: analysisId, payment_id: paymentId }),
        });

        const data = await response.json();
        clearInterval(interval);

        if (response.ok && data.result) {
          toast.success("프리미엄 리포트가 생성되었습니다!");
          router.push(`/premium/${data.result.id}`);
        } else {
          throw new Error(data.error || "리포트 생성에 실패했습니다.");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "오류가 발생했습니다.";
        toast.error(message);
        router.push(`/checkout?analysis_id=${analysisId}`);
      }
    };

    generateReport();
  }, [analysisId, paymentId, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          <div className="relative bg-primary rounded-full w-full h-full flex items-center justify-center shadow-2xl">
            <Sparkles className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display tracking-tight">Creating Your Masterpiece</h1>
          <p className="text-muted-foreground text-sm">잠시만 기다려주세요. 최고 수준의 AI가 당신을 분석하고 있습니다.</p>
        </div>

        <div className="bg-muted/30 rounded-2xl p-6 border border-foreground/[0.03]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-4 text-left"
            >
              <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm text-primary">
                {steps[step].icon}
              </div>
              <p className="text-sm font-medium">{steps[step].text}</p>
            </motion.div>
          </AnimatePresence>
          
          <div className="mt-6 w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
              className="bg-primary h-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PremiumLoadingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PremiumLoadingContent />
    </Suspense>
  );
}
