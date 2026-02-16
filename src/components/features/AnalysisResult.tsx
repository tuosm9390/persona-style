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
} from "lucide-react";
import type { AnalysisResult } from "../../../lib/types";

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
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

export function AnalysisResultDisplay({
  result,
  onReset,
}: AnalysisResultDisplayProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-secondary text-secondary-foreground">
          <Sparkles className="mr-1.5 h-3 w-3" />
          AI 분석 완료
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
        <p className="mx-auto max-w-[600px] text-muted-foreground leading-relaxed">
          {result.summary.description}
        </p>
      </motion.div>

      {/* Analysis Card */}
      <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5 text-primary" />
              분석 결과
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "퍼스널 컬러", value: result.analysis.colorSeason },
                { label: "체형 분석", value: result.analysis.bodyType },
                { label: "얼굴형", value: result.analysis.faceShape },
                {
                  label: "퍼스널리티 바이브",
                  value: result.analysis.personalityVibe,
                },
              ].map((item, i) => (
                <div key={i} className="rounded-lg bg-muted/50 p-4 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Fashion Card */}
      <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shirt className="h-5 w-5 text-primary" />
              패션 추천
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              {result.fashion.overview}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "상의", value: result.fashion.tops },
                { label: "하의", value: result.fashion.bottoms },
                { label: "아우터", value: result.fashion.outerwear },
                { label: "신발", value: result.fashion.shoes },
                { label: "액세서리", value: result.fashion.accessories },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-sm">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  어울리는 컬러
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.fashion.colorsToWear.map((c, i) => (
                    <ColorChip key={i} color={c} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  피해야 할 컬러
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
      <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gem className="h-5 w-5 text-primary" />
              뷰티 추천
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              {result.beauty.overview}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "베이스 메이크업", value: result.beauty.foundation },
                { label: "아이 메이크업", value: result.beauty.eyeMakeup },
                { label: "립 컬러", value: result.beauty.lipColor },
                { label: "블러셔", value: result.beauty.blush },
                { label: "헤어 스타일", value: result.beauty.hairStyle },
                { label: "헤어 컬러", value: result.beauty.hairColor },
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

      {/* Action Items */}
      <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="visible">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListChecks className="h-5 w-5 text-primary" />
              오늘 바로 시도해보세요!
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
          다시 분석하기
        </Button>
      </motion.div>
    </div>
  );
}
