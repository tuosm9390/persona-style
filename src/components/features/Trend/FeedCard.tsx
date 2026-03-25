"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, UserPlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisHistoryItem } from "@/lib/history";
import { useLanguage } from "@/contexts/LanguageContext";

interface FeedCardProps {
  item: AnalysisHistoryItem;
  index: number;
}

const getBgColorForSeason = (season: string) => {
  const s = season.toLowerCase();
  if (s.includes("spring") || s.includes("봄")) return "oklch(0.9 0.08 80)";
  if (s.includes("summer") || s.includes("여름")) return "oklch(0.85 0.05 250)";
  if (s.includes("autumn") || s.includes("가을")) return "oklch(0.7 0.1 60)";
  if (s.includes("winter") || s.includes("겨울")) return "oklch(0.3 0.02 250)";
  return "oklch(0.95 0.01 0)";
};

export function FeedCard({ item, index }: FeedCardProps) {
  const { t } = useLanguage();
  const [likes, setLikes] = React.useState((item as any).share_count || 0);
  const [isLiked, setIsDark] = React.useState(false);
  const bgColor = getBgColorForSeason(item.result.analysis.colorSeason);
  const isDark = bgColor.includes("0.3");

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) return;
    
    // Optimistic update
    setLikes(prev => prev + 1);
    setIsDark(true);
    
    try {
      await fetch("/api/share/interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, type: "like" }),
      });
    } catch (error) {
      console.error("Failed to like:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card 
        className="overflow-hidden border-none shadow-none group bg-transparent cursor-pointer"
        onClick={() => window.location.href = `/analyze/${item.id}`}
      >
        {/* Visual Representation */}
        <div
          className="h-72 w-full rounded-2xl p-6 flex flex-col justify-end relative overflow-hidden transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-black/10 group-hover:-translate-y-1"
          style={{ backgroundColor: bgColor }}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
          <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black/60' : 'from-black/30'} via-transparent to-transparent opacity-60`} />
          
          <div className="relative z-10 space-y-1">
            <h3 className="font-display text-2xl font-bold text-white tracking-tight leading-tight">
              {item.result.summary.title}
            </h3>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white/80">
              <span>{item.result.analysis.colorSeason}</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{item.result.analysis.bodyType}</span>
            </div>
          </div>
          
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Info Area */}
        <CardContent className="px-1 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-foreground/5 flex items-center justify-center border border-foreground/5 overflow-hidden">
                <span className="text-[10px] font-bold text-foreground/40">U</span>
              </div>
              <span className="text-xs font-bold tracking-tight text-foreground/70">
                Anonymous User
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all border border-foreground/5"
            >
              <UserPlus className="h-3 w-3 mr-1" />
              {t("feed.follow") || "Follow"}
            </Button>
          </div>

          <div className="flex items-center gap-6 text-muted-foreground pt-1">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-[11px] font-bold tracking-tighter transition-all group/btn ${isLiked ? 'text-primary' : 'hover:text-primary'}`}
            >
              <Heart className={`h-4 w-4 transition-transform group-hover/btn:scale-110 ${isLiked ? 'fill-primary text-primary' : ''}`} />
              {likes}
            </button>
            <button className="flex items-center gap-1.5 text-[11px] font-bold tracking-tighter hover:text-primary transition-all">
              <MessageCircle className="h-4 w-4" />
              0
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
