"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Palette,
  Shirt,
  Gem,
  ListChecks,
  ChevronRight,
  ArrowLeft,
  Circle,
  Square,
  Triangle,
  Heart,
  Diamond,
  User,
  Hourglass,
  RectangleHorizontal,
  Cloud,
  Sun,
  Moon,
  Wind,
  Watch,
  Footprints,
  Spline,
  PanelTop,
  Download,
  Share2,
} from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormattedText } from "@/components/ui/formatted-text";
import { ShareCard } from "./ShareCard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
  resetLabel?: string;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

function ColorChip({ color }: { color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium">
      {color}
    </span>
  );
}

function getColorValue(colorName: string): string {
  const normalizedColorName = colorName.toLowerCase();
  const colorMap: Record<string, string> = {
    화이트: "#FFFFFF",
    white: "#FFFFFF",
    아이보리: "#FFFFF0",
    ivory: "#FFFFF0",
    베이지: "#F5F5DC",
    beige: "#F5F5DC",
    그레이: "#808080",
    gray: "#808080",
    차콜: "#36454F",
    charcoal: "#36454F",
    블랙: "#000000",
    black: "#000000",
    네이비: "#000080",
    navy: "#000080",
    레드: "#DC143C",
    red: "#DC143C",
    코랄: "#FF7F50",
    coral: "#FF7F50",
    피치: "#FFE5B4",
    peach: "#FFE5B4",
    오렌지: "#FF8C00",
    orange: "#FF8C00",
    옐로우: "#FFD700",
    yellow: "#FFD700",
    브라운: "#8B4513",
    brown: "#8B4513",
    블루: "#4169E1",
    blue: "#4169E1",
    그린: "#228B22",
    green: "#228B22",
    퍼플: "#9370DB",
    purple: "#9370DB",
    핑크: "#FFC0CB",
    pink: "#FFC0CB",
  };

  for (const [key, value] of Object.entries(colorMap)) {
    if (normalizedColorName.includes(key)) return value;
  }
  return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
}

function getIconForType(type: string, value: string) {
  const normalizedValue = value.toLowerCase();
  switch (type) {
    case "faceShape":
      if (normalizedValue.includes("round") || normalizedValue.includes("둥근"))
        return <Circle className="h-5 w-5" />;
      if (
        normalizedValue.includes("square") ||
        normalizedValue.includes("각진")
      )
        return <Square className="h-5 w-5" />;
      if (
        normalizedValue.includes("triangle") ||
        normalizedValue.includes("역삼각형")
      )
        return <Triangle className="h-5 w-5 rotate-180" />;
      if (normalizedValue.includes("heart") || normalizedValue.includes("하트"))
        return <Heart className="h-5 w-5" />;
      if (
        normalizedValue.includes("diamond") ||
        normalizedValue.includes("다이아")
      )
        return <Diamond className="h-5 w-5" />;
      return <User className="h-5 w-5" />;
    case "bodyType":
      if (
        normalizedValue.includes("hourglass") ||
        normalizedValue.includes("모래시계")
      )
        return <Hourglass className="h-5 w-5" />;
      if (
        normalizedValue.includes("rectangle") ||
        normalizedValue.includes("직사각형")
      )
        return <RectangleHorizontal className="h-5 w-5" />;
      return <User className="h-5 w-5" />;
    case "colorSeason":
      if (normalizedValue.includes("spring") || normalizedValue.includes("봄"))
        return <Cloud className="h-5 w-5 text-green-400" />;
      if (
        normalizedValue.includes("summer") ||
        normalizedValue.includes("여름")
      )
        return <Sun className="h-5 w-5 text-yellow-400" />;
      if (
        normalizedValue.includes("autumn") ||
        normalizedValue.includes("가을")
      )
        return <Wind className="h-5 w-5 text-orange-400" />;
      if (
        normalizedValue.includes("winter") ||
        normalizedValue.includes("겨울")
      )
        return <Moon className="h-5 w-5 text-blue-400" />;
      return <Palette className="h-5 w-5" />;
    default:
      return <Sparkles className="h-5 w-5" />;
  }
}

function getFashionIcon(type: string) {
  switch (type) {
    case "tops":
      return <Shirt className="h-5 w-5" />;
    case "bottoms":
      return <Spline className="h-5 w-5" />;
    case "outerwear":
      return <PanelTop className="h-5 w-5" />;
    case "shoes":
      return <Footprints className="h-5 w-5" />;
    case "accessories":
      return <Watch className="h-5 w-5" />;
    default:
      return <Sparkles className="h-5 w-5" />;
  }
}

export function AnalysisResultDisplay({
  result,
  onReset,
  resetLabel,
}: AnalysisResultDisplayProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const actualResetLabel = resetLabel || t("common.retryAnalysis");
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = async () => {
    const analysisId = (result as any).id;
    if (!analysisId) {
      toast.error(t("common.error"));
      return;
    }
    setIsDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = `/api/share/${analysisId}`;
      link.download = `persona-style-${analysisId}.png`;
      link.click();
    } catch (err) {
      toast.error(t("common.error"));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const analysisId = (result as any).id;
    if (!analysisId) return;
    const shareUrl = `${window.location.origin}/analyze/${analysisId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Persona Style",
          text: result.summary.title,
          url: shareUrl,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success(t("common.share"));
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16 pt-20">
      <ShareCard result={result} cardRef={cardRef} />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="flex flex-col items-center gap-4 mb-2">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-secondary text-secondary-foreground">
            <Sparkles className="mr-1.5 h-3 w-3" />
            {t("result.badges.complete")}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              variant="outline"
              size="sm"
              className="rounded-full shadow-sm"
            >
              {isDownloading ? (
                <span className="animate-spin mr-2">◌</span>
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {t("common.download")}
            </Button>
            <Button
              onClick={handleShare}
              variant="default"
              size="sm"
              className="rounded-full shadow-md"
            >
              <Share2 className="mr-2 h-4 w-4" />
              {t("common.share")}
            </Button>
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-primary">
          {result.summary.title}
        </h1>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {result.summary.keywords.map((keyword, i) => (
            <span
              key={i}
              className="rounded-full bg-primary/[0.03] border border-primary/5 px-4 py-1 text-[10px] uppercase tracking-widest font-bold text-primary/60"
            >
              {keyword}
            </span>
          ))}
        </div>
        <FormattedText
          text={result.summary.description}
          className="mx-auto max-w-[600px] text-muted-foreground"
        />
      </motion.div>

      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {result.profile && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                {t("result.analysis.visualProfile")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                      Hair & Face
                    </h4>
                    <p>
                      • {t("result.beauty.hairStyle")}:{" "}
                      {result.profile.hair.style} ({result.profile.hair.color})
                    </p>
                    <p>
                      • {t("result.analysis.faceShape")}:{" "}
                      {result.profile.face.shape}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                      Body
                    </h4>
                    <p>
                      • {t("result.analysis.bodyType")}:{" "}
                      {result.profile.body.type}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                      Apparel
                    </h4>
                    <p>
                      • {t("result.fashion.tops")}:{" "}
                      {result.profile.apparel.top.color}{" "}
                      {result.profile.apparel.top.category}
                    </p>
                    <p>
                      • {t("result.fashion.bottoms")}:{" "}
                      {result.profile.apparel.bottom.color}{" "}
                      {result.profile.apparel.bottom.category}
                    </p>
                  </div>
                  <div className="pt-2">
                    <div className="inline-block rounded-lg bg-background p-3 border shadow-sm w-full">
                      <p className="text-xs font-bold text-primary mb-1">
                        {t("result.analysis.confidence")}
                      </p>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${result.profile.metadata.confidence * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5 text-primary" />
              {t("result.analysis.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: t("result.analysis.colorSeason"),
                  value: result.analysis.colorSeason,
                  type: "colorSeason",
                },
                {
                  label: t("result.analysis.bodyType"),
                  value: result.analysis.bodyType,
                  type: "bodyType",
                },
                {
                  label: t("result.analysis.faceShape"),
                  value: result.analysis.faceShape,
                  type: "faceShape",
                },
                {
                  label: t("result.analysis.personalityVibe"),
                  value: result.analysis.personalityVibe,
                  type: "personality",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-lg bg-muted/50 p-4"
                >
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-primary">
                    {getIconForType(item.type, item.value)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      {item.label}
                    </p>
                    <p className="text-base font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        custom={1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shirt className="h-5 w-5 text-primary" />
              {t("result.fashion.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormattedText
              as="div"
              text={result.fashion.overview}
              className="text-muted-foreground"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: t("result.fashion.tops"),
                  value: result.fashion.tops,
                  type: "tops",
                },
                {
                  label: t("result.fashion.bottoms"),
                  value: result.fashion.bottoms,
                  type: "bottoms",
                },
                {
                  label: t("result.fashion.outerwear"),
                  value: result.fashion.outerwear,
                  type: "outerwear",
                },
                {
                  label: t("result.fashion.shoes"),
                  value: result.fashion.shoes,
                  type: "shoes",
                },
                {
                  label: t("result.fashion.accessories"),
                  value: result.fashion.accessories,
                  type: "accessories",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 rounded-lg bg-muted/50 p-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background text-primary">
                      {getFashionIcon(item.type)}
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      {item.label}
                    </p>
                  </div>
                  <div className="pl-10">
                    <FormattedText
                      text={item.value}
                      className="text-sm font-medium"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  {t("result.fashion.colorsToWear")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.fashion.colorsToWear.map((c, i) => (
                    <ColorChip key={i} color={c} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  {t("result.fashion.colorsToAvoid")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.fashion.colorsToAvoid.map((c, i) => (
                    <ColorChip key={i} color={c} />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        custom={5}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-border overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shirt className="h-5 w-5 text-primary" />
                {t("result.shop.title")}
              </CardTitle>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                Partner
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="space-y-2 flex-1 text-center md:text-left">
                <h3 className="font-semibold text-lg">
                  {t("result.shop.itemSuggestion").replace(
                    "{title}",
                    result.summary.title,
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("result.shop.desc")
                    .replace("{color}", result.analysis.colorSeason)
                    .replace("{body}", result.analysis.bodyType)}
                </p>
              </div>
              <Button
                size="lg"
                className="rounded-full shadow-md w-full md:w-auto shrink-0 group"
                asChild
              >
                <a
                  href="#shop-link"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.success("Shopping link coming soon");
                  }}
                >
                  {t("result.shop.button")}
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        custom={5}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-accent/20 bg-accent/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl translate-x-16 -translate-y-16" />
          <CardHeader>
            <CardTitle className="text-lg">
              {t("result.historySuggestion.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("result.historySuggestion.desc")}
            </p>
            <Button
              variant="outline"
              className="w-full md:w-auto rounded-full border-accent/30 hover:bg-accent hover:text-accent-foreground"
              asChild
            >
              <a href="/login">{t("result.historySuggestion.button")}</a>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        custom={4}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-center gap-4"
      >
        <Button
          variant="outline"
          size="lg"
          onClick={onReset}
          className="rounded-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {actualResetLabel}
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={() =>
            router.push(`/checkout?analysis_id=${(result as any).id}`)
          }
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 group relative overflow-hidden h-14 px-8 border-none"
        >
          <Sparkles className="mr-2 h-4 w-4 text-accent transition-transform group-hover:rotate-12" />
          <span className="font-bold uppercase tracking-wider text-xs">
            {t("result.premiumReport")}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </Button>
      </motion.div>
    </div>
  );
}
