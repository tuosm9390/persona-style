"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnalysisResultDisplay } from "@/features/analyze/components/AnalysisResult";
import { Button } from "@/components/ui/button";
import { FormattedText } from "@/components/ui/formatted-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trash2, Camera, PenLine, Sparkles } from "lucide-react";
import {
  getAnalysisHistory,
  deleteAnalysisFromHistory,
  clearAllHistory,
  type AnalysisHistoryItem,
} from "@/lib/history";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const { t } = useLanguage();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = React.useState<AnalysisHistoryItem[]>([]);
  const [selectedItem, setSelectedItem] =
    React.useState<AnalysisHistoryItem | null>(null);
  const [isDataLoading, setIsDataLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchHistory = async () => {
      setIsDataLoading(true);
      const data = await getAnalysisHistory();
      setHistory(data);
      setIsDataLoading(false);
    };
    if (!authLoading) {
      fetchHistory();
    }
  }, [authLoading, user]);

  const handleDelete = async (id: string) => {
    if (confirm("이 분석 결과를 삭제하시겠습니까?")) {
      await deleteAnalysisFromHistory(id);
      const updatedHistory = await getAnalysisHistory();
      setHistory(updatedHistory);
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    }
  };

  const handleClearAll = () => {
    if (
      confirm(
        "모든 분석 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      )
    ) {
      clearAllHistory();
      setHistory([]);
      setSelectedItem(null);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInputTypeIcon = (type: string) => {
    if (type === "photo") return <Camera className="h-4 w-4" />;
    if (type === "text") return <PenLine className="h-4 w-4" />;
    return <Sparkles className="h-4 w-4" />;
  };

  const handleSelectItem = (item: AnalysisHistoryItem) => {
    setSelectedItem(item);
    // Push a new history entry so browser back button returns to the list
    window.history.pushState(
      { viewing: item.id },
      "",
      `/history?id=${item.id}`,
    );
  };

  const handleBackToList = React.useCallback(() => {
    setSelectedItem(null);
    // Replace URL back to clean /history without triggering another pushState
    window.history.replaceState(null, "", "/history");
  }, []);

  // Listen for browser back/forward button
  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.viewing) {
        // Forward navigation to a specific item
        const item = history.find((h) => h.id === event.state.viewing);
        if (item) {
          setSelectedItem(item);
        }
      } else {
        // Back to list
        setSelectedItem(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [history]);

  // On initial load, check if URL has an id parameter (for direct links / page refresh)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id && history.length > 0) {
      const item = history.find((h) => h.id === id);
      if (item) {
        setSelectedItem(item);
      }
    }
  }, [history]);

  if (authLoading || isDataLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/30">
        <Header />
        <main className="container flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">기록을 불러오는 중...</p>
          </div>
        </main>
      </div>
    );
  }

  if (selectedItem) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/30">
        <Header />
        <main className="container flex-1 py-12 px-4 md:px-6">
          <AnalysisResultDisplay
            result={{ ...selectedItem.result, id: selectedItem.id }}
            onReset={handleBackToList}
            resetLabel="목록으로 돌아가기"
            hasPremium={selectedItem.hasPremium}
            premiumReportId={selectedItem.premiumReportId}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen pt-20 flex-col bg-muted/30">
      <Header />
      <main className="container flex-1 py-12 px-4 md:px-6">
        {!user && (
          <div className="mb-8 p-4 bg-primary/5 border border-primary/10 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              <span className="font-semibold text-primary">로그인</span>하시면
              분석 결과를 클라우드에 영구적으로 보관하고 어디서든 확인할 수
              있습니다.
            </div>
            <Button
              size="sm"
              onClick={() => router.push("/login")}
              className="rounded-full shrink-0"
            >
              지금 로그인하기
            </Button>
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl space-y-8"
        >
          {/* Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold tracking-tight md:text-4xl">
                {t("history.title")}
              </h1>
              <FormattedText
                text={t("history.description")}
                className="text-muted-foreground mt-2"
              />
            </div>
            {history.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                전체 삭제
              </Button>
            )}
          </div>

          {/* History List */}
          {history.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  아직 분석 기록이 없습니다.
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  스타일 분석을 시작하면 여기에 기록이 저장됩니다.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {history.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                      <CardHeader
                        className="pb-3"
                        onClick={() => handleSelectItem(item)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                                {getInputTypeIcon(item.inputType)}
                                {item.result.summary.title}
                              </CardTitle>
                              {item.hasPremium && (
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                                  <Sparkles className="mr-1 h-2 w-2" />
                                  Premium
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDate(item.timestamp)}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            className="text-muted-foreground hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent
                        className="pt-0"
                        onClick={() => handleSelectItem(item)}
                      >
                        <div className="flex flex-wrap gap-2">
                          {item.result.summary.keywords.map((keyword, i) => (
                            <span
                              key={i}
                              className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                          {item.result.summary.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
