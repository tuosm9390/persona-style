"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

// Dummy data structure improved for i18n
const getDummyFeed = (t: any) => [
  {
    id: 1,
    user: "Styler_01",
    persona: "Soft Elegance",
    season: "Summer Mute",
    body: "Hourglass",
    likes: 24,
    comments: 3,
    bg: "oklch(0.85 0.05 250)",
  },
  {
    id: 2,
    user: "TrendyMe",
    persona: "Modern Chic",
    season: "Winter Deep",
    body: "Rectangle",
    likes: 56,
    comments: 12,
    bg: "oklch(0.2 0.01 250)",
  },
  {
    id: 3,
    user: "AutumnMood",
    persona: "Classic Warm",
    season: "Autumn Deep",
    body: "Pear",
    likes: 18,
    comments: 1,
    bg: "oklch(0.7 0.1 60)",
  },
  {
    id: 4,
    user: "SpringMuse",
    persona: "Romantic Feminine",
    season: "Spring Light",
    body: "Apple",
    likes: 89,
    comments: 21,
    bg: "oklch(0.85 0.1 20)",
  },
];

export default function FeedPage() {
  const { t } = useLanguage();
  const feedItems = React.useMemo(() => getDummyFeed(t), [t]);

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Header />
      <main className="container flex-1 pt-32 pb-20 px-4 md:px-6">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-block px-3 py-1 rounded-full border border-primary/5 bg-primary/[0.02] text-[10px] uppercase tracking-[0.2em] font-bold text-primary/40 mb-2">
              {t("feed.badge")}
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-semibold tracking-tight text-primary">
              {t("feed.title")}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              {t("feed.description")}
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex justify-end border-b border-foreground/5 pb-6">
            <Button className="rounded-full shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all hover:-translate-y-0.5 font-bold uppercase tracking-tight text-xs h-11 px-8">
              <Share2 className="mr-2 h-3.5 w-3.5" />
              {t("feed.share")}
            </Button>
          </div>

          {/* Feed Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {feedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card className="overflow-hidden border-none shadow-none group bg-transparent cursor-pointer">
                  {/* Visual Representation */}
                  <div
                    className="h-64 w-full rounded-2xl p-6 flex flex-col justify-end relative overflow-hidden transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-black/10 group-hover:-translate-y-1"
                    style={{ backgroundColor: item.bg }}
                  >
                    {/* Texture overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                    
                    <div className="relative z-10 space-y-1">
                      <h3 className="font-display text-2xl font-bold text-white tracking-tight leading-tight">
                        {item.persona}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white/80">
                        <span>{item.season}</span>
                        <span className="w-1 h-1 rounded-full bg-white/40" />
                        <span>{item.body}</span>
                      </div>
                    </div>
                  </div>

                  {/* Info Area */}
                  <CardContent className="px-1 py-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-foreground/5 flex items-center justify-center border border-foreground/5 overflow-hidden">
                          <span className="text-[10px] font-bold text-foreground/40">{item.user[0]}</span>
                        </div>
                        <span className="text-xs font-bold tracking-tight text-foreground/70">{item.user}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all border border-foreground/5"
                      >
                        <UserPlus className="h-3 w-3 mr-1" />
                        {t("feed.follow")}
                      </Button>
                    </div>

                    <div className="flex items-center gap-6 text-muted-foreground pt-1">
                      <button className="flex items-center gap-1.5 text-[11px] font-bold tracking-tighter hover:text-primary transition-all group/btn">
                        <Heart className="h-4 w-4 transition-transform group-hover/btn:scale-110 group-hover/btn:fill-primary group-hover/btn:text-primary" />
                        {item.likes}
                      </button>
                      <button className="flex items-center gap-1.5 text-[11px] font-bold tracking-tighter hover:text-primary transition-all">
                        <MessageCircle className="h-4 w-4" />
                        {item.comments}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
