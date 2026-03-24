"use client";

import * as React from "react";
import Image from "next/image";
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
} from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormattedText } from "@/components/ui/formatted-text";
import { toPng } from "html-to-image";
import { ShareCard } from "./ShareCard";
import { toast } from "sonner";
import { Download, Share2 } from "lucide-react";

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

// Helper function to convert color names to CSS colors
function getColorValue(colorName: string): string {
  const normalizedColorName = colorName.toLowerCase();
  const colorMap: Record<string, string> = {
    // Neutrals
    화이트: "#FFFFFF",
    white: "#FFFFFF",
    아이보리: "#FFFFF0",
    ivory: "#FFFFF0",
    베이지: "#F5F5DC",
    beige: "#F5F5DC",
    그레이: "#808080",
    gray: "#808080",
    grey: "#808080",
    차콜: "#36454F",
    charcoal: "#36454F",
    블랙: "#000000",
    black: "#000000",
    네이비: "#000080",
    navy: "#000080",

    // Warm colors
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
    골드: "#FFD700",
    gold: "#FFD700",
    브라운: "#8B4513",
    brown: "#8B4513",
    카키: "#C3B091",
    khaki: "#C3B091",
    머스타드: "#FFDB58",
    mustard: "#FFDB58",

    // Cool colors
    블루: "#4169E1",
    blue: "#4169E1",
    스카이블루: "#87CEEB",
    skyblue: "#87CEEB",
    "sky blue": "#87CEEB",
    민트: "#98FF98",
    mint: "#98FF98",
    그린: "#228B22",
    green: "#228B22",
    올리브: "#808000",
    olive: "#808000",
    퍼플: "#9370DB",
    purple: "#9370DB",
    라벤더: "#E6E6FA",
    lavender: "#E6E6FA",
    핑크: "#FFC0CB",
    pink: "#FFC0CB",
    로즈: "#FF007F",
    rose: "#FF007F",
    버건디: "#800020",
    burgundy: "#800020",
    와인: "#722F37",
    wine: "#722F37",
    플럼: "#8E4585",
    plum: "#8E4585",
    실버: "#C0C0C0",
    silver: "#C0C0C0",
  };

  // Try to find exact match first
  for (const [key, value] of Object.entries(colorMap)) {
    if (normalizedColorName.includes(key)) {
      return value;
    }
  }

  // Default to a gradient if no match
  return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
}

// Helper function to get icon for analysis types
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
      if (
        normalizedValue.includes("triangle") ||
        normalizedValue.includes("삼각형")
      )
        return <Triangle className="h-5 w-5" />;
      if (
        normalizedValue.includes("inverted") ||
        normalizedValue.includes("역삼각형")
      )
        return <Triangle className="h-5 w-5 rotate-180" />;
      if (normalizedValue.includes("round") || normalizedValue.includes("원형"))
        return <Circle className="h-5 w-5" />;
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
        normalizedValue.includes("fall") ||
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

// Helper function to get icon for fashion items
function getFashionIcon(type: string) {
  switch (type) {
    case "tops":
      return <Shirt className="h-5 w-5" />;
    case "bottoms":
      return <Spline className="h-5 w-5" />; // Spline for fit/curves/pants silhouette
    case "outerwear":
      return <PanelTop className="h-5 w-5" />; // PanelTop looks like covering/coat
    case "shoes":
      return <Footprints className="h-5 w-5" />;
    case "accessories":
      return <Watch className="h-5 w-5" />;
    default:
      return <Sparkles className="h-5 w-5" />;
  }
}

// StyleImageSection component
// function StyleImageSection({ result }: { result: AnalysisResult }) {
//   const { t } = useLanguage();
//   const [isGenerating, setIsGenerating] = React.useState(false);
//   const [imageUrl, setImageUrl] = React.useState<string | null>(null);
//   const [error, setError] = React.useState<string | null>(null);

//   const handleGenerateImage = async () => {
//     setIsGenerating(true);
//     setError(null);

//     try {
//       const response = await fetch("/api/generate-image", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ result }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "이미지 생성에 실패했습니다.");
//       }

//       // Convert base64 image data to data URL for img tag rendering
//       if (data.imageData) {
//         const mimeType = data.mimeType || "image/png";
//         setImageUrl(`data:${mimeType};base64,${data.imageData}`);
//       }
//     } catch (err: any) {
//       setError(err.message || "이미지 생성 중 오류가 발생했습니다.");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   return (
//     <motion.div
//       custom={4}
//       variants={sectionVariants}
//       initial="hidden"
//       animate="visible"
//     >
//       <Card className="border-primary/20">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2 text-lg">
//             <Sparkles className="h-5 w-5 text-primary" />
//             {t("result.image.title")}
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {!imageUrl && !isGenerating && (
//             <div className="text-center py-8">
//               <p className="text-sm text-muted-foreground mb-4">
//                 {t("result.image.description")}
//               </p>
//               <Button
//                 onClick={handleGenerateImage}
//                 className="rounded-full"
//                 size="lg"
//               >
//                 <Sparkles className="mr-2 h-4 w-4" />
//                 {t("result.image.generate")}
//               </Button>
//             </div>
//           )}

//           {isGenerating && (
//             <div className="flex flex-col items-center justify-center py-12 space-y-4">
//               <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
//               <p className="text-sm text-muted-foreground">
//                 {t("result.image.generating")}
//               </p>
//             </div>
//           )}

//           {imageUrl && (
//             <div className="space-y-4">
//               <div className="relative rounded-lg overflow-hidden border aspect-[3/4]">
//                 <Image
//                   src={imageUrl}
//                   alt="AI Generated Style"
//                   fill
//                   className="object-cover"
//                   sizes="(max-width: 768px) 100vw, 500px"
//                 />
//               </div>
//               <Button
//                 variant="outline"
//                 onClick={handleGenerateImage}
//                 className="w-full"
//                 disabled={isGenerating}
//               >
//                 {t("result.image.regenerate")}
//               </Button>
//             </div>
//           )}

//           {error && (
//             <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center">
//               <p className="text-sm text-red-800">{error}</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }

export function AnalysisResultDisplay({
  result,
  onReset,
  resetLabel,
}: AnalysisResultDisplayProps) {
  const { t } = useLanguage();
  const actualResetLabel = resetLabel || t("common.retryAnalysis");
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    setIsDownloading(true);
    const toastId = toast.loading(
      t("common.processing") || "이미지를 생성 중입니다...",
    );

    try {
      // Ensure fonts and images are loaded by giving it a tiny delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `persona-style-${result.summary.title.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();

      toast.success(t("common.success") || "이미지가 다운로드되었습니다!", {
        id: toastId,
      });
    } catch (err) {
      console.error("Download error:", err);
      toast.error(t("common.error") || "이미지 생성 중 오류가 발생했습니다.", {
        id: toastId,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95 });
      const blob = await fetch(dataUrl).then((r) => r.blob());
      const file = new File([blob], "my-style-persona.png", { type: "image/png" });

      if (navigator.share) {
        await navigator.share({
          title: "My Style Persona",
          text: `AI가 분석한 나의 스타일 페르소나는 '${result.summary.title}'입니다!`,
          files: [file],
        });
      } else {
        await handleDownload();
      }
    } catch (err) {
      console.error("Share error:", err);
      toast.error("공유 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16">
      {/* Hidden share card for capture */}
      <ShareCard result={result} cardRef={cardRef} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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
              className="rounded-full shadow-sm hover:bg-primary hover:text-primary-foreground transition-all group"
            >
              {isDownloading ? (
                <span className="animate-spin mr-2">◌</span>
              ) : (
                <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              )}
              {t("common.download") || "다운로드"}
            </Button>
            <Button
              onClick={handleShare}
              variant="default"
              size="sm"
              className="rounded-full shadow-md hover:shadow-lg transition-all group"
            >
              <Share2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              {t("common.share") || "SNS 공유하기"}
            </Button>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
          {result.summary.title}
        </h1>
        <div className="flex flex-wrap justify-center gap-2 pt-1">
          {result.summary.keywords.map((keyword, i) => (
            <span
              key={i}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
            >
              {keyword}
            </span>
          ))}
        </div>
        <FormattedText
          text={result.summary.description}
          className="mx-auto max-w-[600px] text-muted-foreground text-left md:text-center"
        />
      </motion.div>

      {/* Analysis Card */}
      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
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
                  className="flex items-start gap-4 rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted/70"
                >
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background shadow-sm text-primary">
                    {getIconForType(item.type, item.value)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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

      {/* Fashion Card */}
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
                  className="flex flex-col gap-3 rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted/70"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background shadow-sm text-primary">
                      {getFashionIcon(item.type)}
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {t("result.fashion.colorsToWear")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.fashion.colorsToWear.map((c, i) => (
                    <ColorChip key={i} color={c} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
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

      {/* Beauty Card */}
      <motion.div
        custom={2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gem className="h-5 w-5 text-primary" />
              {t("result.beauty.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormattedText
              as="div"
              text={result.beauty.overview}
              className="text-muted-foreground"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: t("result.beauty.foundation"),
                  value: result.beauty.foundation,
                },
                {
                  label: t("result.beauty.eyeMakeup"),
                  value: result.beauty.eyeMakeup,
                },
                {
                  label: t("result.beauty.lipColor"),
                  value: result.beauty.lipColor,
                },
                { label: t("result.beauty.blush"), value: result.beauty.blush },
                {
                  label: t("result.beauty.hairStyle"),
                  value: result.beauty.hairStyle,
                },
                {
                  label: t("result.beauty.hairColor"),
                  value: result.beauty.hairColor,
                },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Moodboard Section */}
      <motion.div
        custom={3}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5 text-primary" />
              {t("result.moodboard.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Color Palette */}
            <div>
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
                {t("result.moodboard.palette")}
              </h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {result.fashion.colorsToWear.map((color, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className="w-16 h-16 rounded-lg shadow-md border border-border"
                      style={{
                        background: getColorValue(color),
                      }}
                    />
                    <span className="text-xs text-center font-medium">
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Style Keywords */}
            <div>
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
                {t("result.moodboard.keywords")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.summary.keywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary border border-primary/20"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Generated Style Image */}
      {/* <StyleImageSection result={result} /> */}

      {/* Action Items */}
      <motion.div
        custom={4}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListChecks className="h-5 w-5 text-primary" />
              {t("result.actionItems")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.actionItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ChevronRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Shopping / Affiliate Suggestion (Monetization) */}
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
                추천 스타일 쇼핑하기
              </CardTitle>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                Partner
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="space-y-2 flex-1 text-center md:text-left">
                <h3 className="font-semibold text-lg">{result.summary.title}에 어울리는 아이템</h3>
                <p className="text-sm text-muted-foreground">
                  AI가 분석한 퍼스널 컬러 <b>{result.analysis.colorSeason}</b>와 <b>{result.analysis.bodyType}</b> 체형을 돋보이게 해줄 베스트 아이템들을 선별했습니다.
                </p>
              </div>
              <Button size="lg" className="rounded-full shadow-md w-full md:w-auto shrink-0 group" asChild>
                <a href="#shop-link" onClick={(e) => { e.preventDefault(); toast.success("향후 쇼핑몰 제휴 링크로 연결될 영역입니다."); }}>
                  맞춤 아이템 보기
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save History Suggestion (Login Drive) */}
      <motion.div
        custom={5}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-accent/20 bg-accent/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl translate-x-16 -translate-y-16" />
          <CardHeader>
            <CardTitle className="text-lg">분석 결과를 저장하고 싶으신가요?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              로그인하시면 지금까지의 모든 스타일 분석 기록을 언제 어디서나 다시 확인하실 수 있습니다. 나만의 스타일 변천사를 기록해보세요.
            </p>
            <Button variant="outline" className="w-full md:w-auto rounded-full border-accent/30 hover:bg-accent hover:text-accent-foreground" asChild>
              <a href="/login">무료로 시작하고 결과 저장하기</a>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reset Button */}
      <motion.div
        custom={4}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="flex justify-center"
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
      </motion.div>
    </div>
  );
}
