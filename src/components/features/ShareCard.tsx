"use client";

import * as React from "react";
import type { AnalysisResult } from "@/lib/types";
import { Sparkles, Palette, User, Shirt } from "lucide-react";

interface ShareCardProps {
  result: AnalysisResult;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export function ShareCard({ result, cardRef }: ShareCardProps) {
  return (
    <div className="absolute left-[-9999px] top-[-9999px]">
      <div
        ref={cardRef}
        className="w-[500px] h-[750px] bg-background p-8 flex flex-col justify-between relative overflow-hidden"
        style={{
          background: "linear-gradient(165deg, #ffffff 0%, #f8f9fa 40%, #e9ecef 100%)",
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-[-50px] right-[-50px] w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-30px] left-[-30px] w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[0.5px] border-primary/5 pointer-events-none" />

        <div className="space-y-10 z-10">
          {/* Header */}
          <div className="text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white shadow-sm rounded-full border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5" />
              Your Style Persona
            </div>
            <h1 className="text-5xl font-display font-black text-foreground tracking-tighter leading-[0.9] pt-2">
              {result.summary.title}
            </h1>
            <div className="flex flex-wrap justify-center gap-3">
              {result.summary.keywords.map((kw, i) => (
                <span key={i} className="text-xs font-bold text-primary/60 bg-primary/5 px-2 py-0.5 rounded">
                  #{kw}
                </span>
              ))}
            </div>
          </div>

          {/* Analysis Grid */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-xl shadow-black/[0.03] space-y-3">
              <div className="flex items-center gap-2 text-primary/40 font-black text-[9px] tracking-widest uppercase">
                <Palette className="w-3.5 h-3.5" />
                Color
              </div>
              <p className="text-xl font-black leading-none text-foreground/90">{result.analysis.colorSeason}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-xl shadow-black/[0.03] space-y-3">
              <div className="flex items-center gap-2 text-primary/40 font-black text-[9px] tracking-widest uppercase">
                <User className="w-3.5 h-3.5" />
                Type
              </div>
              <p className="text-xl font-black leading-none text-foreground/90">{result.analysis.bodyType}</p>
            </div>
          </div>

          {/* Style Advice Section */}
          <div className="bg-primary text-primary-foreground p-8 rounded-[2.5rem] shadow-2xl shadow-primary/20 space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-10 -translate-y-10" />
            <div className="flex items-center gap-2 font-black text-[10px] tracking-[0.15em] uppercase opacity-70">
              <Shirt className="w-4 h-4" />
              Stylist's Selection
            </div>
            <div className="space-y-4">
              <p className="text-lg font-bold leading-tight border-l-2 border-white/30 pl-4">{result.fashion.tops}</p>
              <p className="text-lg font-bold leading-tight border-l-2 border-white/30 pl-4">{result.fashion.bottoms}</p>
            </div>
          </div>
        </div>

        {/* Footer / Branding */}
        <div className="flex items-end justify-between z-10 pt-10">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-primary/40 uppercase tracking-[0.3em]">Powered by AI</span>
            <span className="text-3xl font-display font-black text-primary tracking-tighter leading-none">PersonaStyle</span>
          </div>
          <div className="text-[10px] font-bold text-muted-foreground/60 text-right leading-relaxed tracking-tighter uppercase">
            Find your unique vibe<br />
            personastyle.app
          </div>
        </div>
      </div>
    </div>
  );
}
