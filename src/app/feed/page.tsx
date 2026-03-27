"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPublicFeed, type AnalysisHistoryItem } from "@/lib/history";
import { FeedCard } from "@/features/shared/components/Trend/FeedCard";

export default function FeedPage() {
  const { t } = useLanguage();
  const [items, setItems] = React.useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      try {
        const data = await getPublicFeed(20);
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch feed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Header />
      <main className="container flex-1 pt-32 pb-20 px-4 md:px-6">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-block px-3 py-1 rounded-full border border-primary/5 bg-primary/[0.02] text-[10px] uppercase tracking-[0.2em] font-bold text-primary/40 mb-2">
              {t("feed.badge") || "Global Community"}
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-semibold tracking-tight text-primary">
              {t("feed.title") || "Style Feed"}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              {t("feed.description") || "Discover unique styles and personas from around the world."}
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex justify-end border-b border-foreground/5 pb-6">
            <Button className="rounded-full shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all hover:-translate-y-0.5 font-bold uppercase tracking-tight text-xs h-11 px-8">
              <Share2 className="mr-2 h-3.5 w-3.5" />
              {t("feed.share") || "Share My Style"}
            </Button>
          </div>

          {/* Feed Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
              <p className="text-sm text-muted-foreground animate-pulse">Loading styles...</p>
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {items.map((item, index) => (
                <FeedCard key={item.id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed">
              <p className="text-muted-foreground italic">No public styles found. Be the first to share!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
