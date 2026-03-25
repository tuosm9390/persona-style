"use client";

import * as React from "react";
import type { AnalysisResult } from "@/lib/types";
import { Sparkles, Palette, X } from "lucide-react";

interface ShareCardProps {
  result: AnalysisResult;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

interface ThemeConfig {
  gradient: string;
  accent: string;
  text: string;
  muted: string;
  card: string;
  tag: string;
}

const themes: Record<string, ThemeConfig> = {
  spring: {
    gradient: "linear-gradient(165deg, #fff9f0 0%, #fff0f3 40%, #ffebdb 100%)",
    accent: "#ff8da1",
    text: "#4a3728",
    muted: "#8c7365",
    card: "rgba(255, 255, 255, 0.8)",
    tag: "rgba(255, 141, 161, 0.1)",
  },
  summer: {
    gradient: "linear-gradient(165deg, #f0f7ff 0%, #f5f0ff 40%, #e0f2fe 100%)",
    accent: "#7ea6ff",
    text: "#2d3748",
    muted: "#718096",
    card: "rgba(255, 255, 255, 0.8)",
    tag: "rgba(126, 166, 255, 0.1)",
  },
  autumn: {
    gradient: "linear-gradient(165deg, #fdf5e6 0%, #fdf2e9 40%, #f5e6d3 100%)",
    accent: "#c05621",
    text: "#432818",
    muted: "#7b341e",
    card: "rgba(255, 255, 255, 0.8)",
    tag: "rgba(192, 86, 33, 0.1)",
  },
  winter: {
    gradient: "linear-gradient(165deg, #f8f9ff 0%, #f0f4ff 40%, #e5e7ff 100%)",
    accent: "#4c51bf",
    text: "#1a202c",
    muted: "#4a5568",
    card: "rgba(255, 255, 255, 0.8)",
    tag: "rgba(76, 81, 191, 0.1)",
  },
  default: {
    gradient: "linear-gradient(165deg, #ffffff 0%, #f8f9fa 40%, #e9ecef 100%)",
    accent: "#000000",
    text: "#111111",
    muted: "#666666",
    card: "rgba(255, 255, 255, 0.8)",
    tag: "rgba(0, 0, 0, 0.05)",
  },
};

// Helper to map color names to hex codes for visual palettes
function getColorHex(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("블랙") || n.includes("black")) return "#1a1a1a";
  if (n.includes("화이트") || n.includes("white")) return "#ffffff";
  if (n.includes("네이비") || n.includes("navy")) return "#000080";
  if (n.includes("그레이") || n.includes("gray")) return "#808080";
  if (n.includes("레드") || n.includes("red")) return "#ee2737";
  if (n.includes("블루") || n.includes("blue")) return "#0074d9";
  if (n.includes("그린") || n.includes("green")) return "#2ecc40";
  if (n.includes("옐로우") || n.includes("yellow")) return "#ffdc00";
  if (n.includes("오렌지") || n.includes("orange")) return "#ff851b";
  if (n.includes("퍼플") || n.includes("purple")) return "#b10dc9";
  if (n.includes("핑크") || n.includes("pink")) return "#f012be";
  if (n.includes("베이지") || n.includes("beige")) return "#f5f5dc";
  if (n.includes("브라운") || n.includes("brown")) return "#8b4513";
  if (n.includes("카키") || n.includes("khaki")) return "#bdb76b";
  if (n.includes("차콜") || n.includes("charcoal")) return "#36454f";
  if (n.includes("아이보리") || n.includes("ivory")) return "#fffff0";
  if (n.includes("코랄") || n.includes("coral")) return "#ff7f50";
  if (n.includes("민트") || n.includes("mint")) return "#98ff98";
  if (n.includes("라벤더") || n.includes("lavender")) return "#e6e6fa";
  return "#cccccc"; // Default fallback
}

// Helper to extract the core result before the colon (:)
function getCoreResult(text: string): string {
  if (!text) return "";
  // Split by colon (:) and take the first part
  const parts = text.split(":");
  return parts[0].trim();
}

export function ShareCard({ result, cardRef }: ShareCardProps) {
  const colorSeason = result.analysis.colorSeason.toLowerCase();
  let themeKey = "default";

  if (colorSeason.includes("spring") || colorSeason.includes("봄"))
    themeKey = "spring";
  else if (colorSeason.includes("summer") || colorSeason.includes("여름"))
    themeKey = "summer";
  else if (colorSeason.includes("autumn") || colorSeason.includes("가을"))
    themeKey = "autumn";
  else if (colorSeason.includes("winter") || colorSeason.includes("겨울"))
    themeKey = "winter";

  const theme = themes[themeKey];

  return (
    <div className="absolute left-[-9999px] top-[-9999px] pointer-events-none">
      <div
        ref={cardRef}
        className="w-[540px] h-[960px] p-14 flex flex-col justify-between relative overflow-hidden"
        style={{ background: theme.gradient, color: theme.text }}
      >
        {/* Background Accents */}
        <div
          className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full blur-[120px] opacity-20"
          style={{ backgroundColor: theme.accent }}
        />

        <div className="flex-1 flex flex-col justify-center space-y-12 z-10">
          {/* Header */}
          <div className="space-y-6 text-center">
            <div
              className="inline-flex items-center gap-2 px-5 py-1.5 bg-white/90 shadow-sm rounded-full border border-black/5 text-[11px] font-black uppercase tracking-[0.3em]"
              style={{ color: theme.accent }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Style Persona
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-display font-black tracking-tighter leading-[1.1] break-keep px-4">
                {result.summary.title}
              </h1>
              <p className="text-[13px] font-medium leading-relaxed opacity-60 max-w-[85%] mx-auto break-keep">
                {result.summary.description}
              </p>
            </div>
          </div>

          {/* Analysis Matrix */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "퍼스널 컬러",
                value: getCoreResult(result.analysis.colorSeason),
              },
              {
                label: "체형 분석",
                value: getCoreResult(result.analysis.bodyType),
              },
              {
                label: "얼굴형",
                value: getCoreResult(result.analysis.faceShape),
              },
              {
                label: "퍼스널리티",
                value: getCoreResult(result.analysis.personalityVibe),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/50 backdrop-blur-md p-6 rounded-[2rem] border border-white/40 space-y-1.5"
              >
                <p className="text-[9px] font-black uppercase tracking-widest opacity-40">
                  {item.label}
                </p>
                <p className="text-[15px] font-black leading-tight break-keep">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Color Palette Section */}
          <div className="space-y-6 pb-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                <Palette className="w-3 h-3" />
                Best Colors
              </div>
              <div className="flex gap-2">
                {result.fashion.colorsToWear.slice(0, 6).map((color, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div
                      className="w-12 h-12 rounded-2xl shadow-sm border border-black/5"
                      style={{ backgroundColor: getColorHex(color) }}
                    />
                    <span className="text-[8px] font-bold opacity-40">
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                <X className="w-3 h-3" />
                Avoid Colors
              </div>
              <div className="flex gap-2">
                {result.fashion.colorsToAvoid.slice(0, 4).map((color, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div
                      className="w-10 h-10 rounded-xl shadow-sm border border-black/5 grayscale-[0.3]"
                      style={{ backgroundColor: getColorHex(color) }}
                    />
                    <span className="text-[8px] font-bold opacity-40">
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="flex items-end justify-between z-10 pt-4 border-t border-black/5">
          <div className="flex flex-col gap-1">
            <span
              className="text-3xl font-display font-black tracking-tighter leading-none"
              style={{ color: theme.accent }}
            >
              PersonaStyle
            </span>
          </div>
          <div className="text-[9px] font-bold opacity-40 text-right leading-relaxed tracking-tighter uppercase">
            Find your unique vibe
            <br />
            personastyle.app
          </div>
        </div>
      </div>
    </div>
  );
}
