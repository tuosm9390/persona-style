"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  BookOpen,
  Briefcase,
  Users,
  Palette,
  Sparkles,
  Zap,
  Target,
  Heart,
  ShoppingBag,
  Info,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { FormattedText } from "@/components/ui/formatted-text";
import { createClient } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { PremiumReport, DeepAnalysisResult } from "@/types/premium";

export default function PremiumReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [report, setReport] = useState<PremiumReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data, error } = await supabase
          .from("premium_reports")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setReport(data as PremiumReport);
      } catch (error: unknown) {
        console.error("Fetch report error:", error);
        toast.error("리포트를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [id, supabase]);

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    const toastId = toast.loading("리포트 파일을 생성하고 있습니다. 잠시만 기다려주세요...");

    try {
      const response = await fetch(`/api/premium/pdf/${id}`);
      
      if (!response.ok) {
        throw new Error("PDF 생성에 실패했습니다.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `PersonaStyle_Report_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("다운로드가 시작되었습니다.", { id: toastId });
    } catch (error) {
      console.error("Download error:", error);
      toast.error("리포트 다운로드 중 오류가 발생했습니다.", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-5xl py-12 space-y-10">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="grid gap-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container max-w-5xl py-20 text-center space-y-4">
        <Info className="h-12 w-12 mx-auto text-muted-foreground" />
        <h1 className="text-2xl font-bold">리포트를 찾을 수 없습니다.</h1>
        <p className="text-muted-foreground">
          결제가 완료되었는지 또는 링크가 올바른지 확인해주세요.
        </p>
        <Button onClick={() => (window.location.href = "/")}>
          홈으로 돌아가기
        </Button>
      </div>
    );
  }

  const analysis: DeepAnalysisResult = report.deep_analysis_json;

  return (
    <div className="container max-w-5xl py-12 space-y-12 bg-background/50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b pb-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            Premium Expert Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {analysis.summary?.title || "심층 전문가 리포트"}
          </h1>
          <div className="flex flex-wrap gap-2 pt-2">
            {analysis.summary?.keywords?.map((keyword: string, i: number) => (
              <Badge
                key={i}
                variant="secondary"
                className="rounded-full px-3 py-1"
              >
                #{keyword}
              </Badge>
            ))}
          </div>
        </div>
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          size="lg"
          className="rounded-full shadow-xl gap-2 h-14 px-8 text-lg font-bold hover:scale-105 transition-transform disabled:opacity-70 disabled:hover:scale-100"
        >
          {isDownloading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Download className="h-5 w-5" />
          )}
          {isDownloading ? "생성 중..." : "PDF 다운로드"}
        </Button>
      </div>

      {/* Main Analysis Sections */}
      <div className="grid gap-12">
        {/* Brand Aura & Archetype */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold">브랜드 아우라 및 아키타입</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-primary/20 shadow-sm">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  당신의 아우라
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 text-lg leading-relaxed italic text-muted-foreground">
                &quot;{analysis.summary?.brandAura}&quot;
              </CardContent>
            </Card>
            <Card className="border-2 border-secondary/20 shadow-sm">
              <CardHeader className="bg-secondary/5">
                <CardTitle className="text-xl flex items-center gap-2 text-secondary-foreground">
                  <Target className="h-5 w-5 text-secondary" />
                  바이브 아키타입
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 leading-relaxed">
                <FormattedText text={analysis.deepAnalysis?.vibeArchetype} />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Strategic Styling */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
              <Palette className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold">전략적 스타일링 가이드</h2>
          </div>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Off-Duty Luxury
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">
                  {analysis.strategicStyling?.offDutyLuxury}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Social Influence
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">
                  {analysis.strategicStyling?.socialInfluence}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Business Executive
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">
                  {analysis.strategicStyling?.businessExecutive}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-xl">
                  컬러 심리학 및 구조적 조화
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-8 pt-2">
                <div className="space-y-2">
                  <h4 className="font-bold flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Color Psychology
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {analysis.deepAnalysis?.colorPsychology}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Structural Harmony
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {analysis.deepAnalysis?.structuralHarmony}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Expert Recommendations */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 text-red-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold">전문가 제언 및 커리어 전략</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-primary/5 border-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Career Advice
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed">
                {analysis.expertRecommendations?.careerAdvice}
              </CardContent>
            </Card>
            <Card className="bg-secondary/5 border-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Lifestyle Upgrade
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed">
                {analysis.expertRecommendations?.lifestyleUpgrade}
              </CardContent>
            </Card>
            <Card className="bg-pink-50 border-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-pink-700">
                  <Heart className="h-5 w-5" />
                  Relationship Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-pink-900/80">
                {analysis.expertRecommendations?.relationshipTips}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Action Plan */}
        <section className="bg-slate-900 text-white p-8 rounded-3xl space-y-8 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap className="h-64 w-64" />
          </div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              성장을 위한 액션 플랜
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <Badge className="bg-primary text-primary-foreground font-black">
                  IMMEDIATE (24H)
                </Badge>
                <p className="text-slate-300 leading-relaxed">
                  {analysis.actionPlan?.immediate}
                </p>
              </div>
              <div className="space-y-3">
                <Badge className="bg-slate-700 text-white font-black">
                  SHORT TERM (30D)
                </Badge>
                <p className="text-slate-300 leading-relaxed">
                  {analysis.actionPlan?.shortTerm}
                </p>
              </div>
              <div className="space-y-3">
                <Badge className="bg-slate-700 text-white font-black">
                  LONG TERM (1Y)
                </Badge>
                <p className="text-slate-300 leading-relaxed">
                  {analysis.actionPlan?.longTerm}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Capsule Wardrobe */}
        {analysis.detailedCapsuleWardrobe && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold">마스터 캡슐 워드로브</h2>
            </div>
            <div className="grid gap-6">
              {analysis.detailedCapsuleWardrobe.map((capsule, idx: number) => (
                <Card key={idx} className="overflow-hidden">
                  <div className="grid md:grid-cols-3">
                    <div className="p-6 bg-muted/50 border-r md:col-span-1">
                      <h3 className="text-xl font-bold mb-4">
                        {capsule.category}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed italic">
                        {capsule.reasoning}
                      </p>
                    </div>
                    <div className="p-6 md:col-span-2">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {capsule.items.map((item: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="pt-12 border-t text-center text-muted-foreground text-sm">
        <p>© 2026 PersonaStyle Premium Expert Service. All rights reserved.</p>
        <p className="mt-2">
          본 리포트는 Gemini 2.5 Pro의 심층 분석 모델을 통해 생성되었습니다.
        </p>
      </div>
    </div>
  );
}
