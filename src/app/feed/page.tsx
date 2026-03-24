"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dummy data for the community feed
const DUMMY_FEED = [
  {
    id: 1,
    user: "스타일러_01",
    persona: "소프트 엘레강스",
    season: "여름 쿨톤 뮤트",
    body: "모래시계 체형",
    likes: 24,
    comments: 3,
    bg: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  },
  {
    id: 2,
    user: "TrendyMe",
    persona: "모던 시크",
    season: "겨울 쿨톤 딥",
    body: "직사각형 체형",
    likes: 56,
    comments: 12,
    bg: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
  },
  {
    id: 3,
    user: "가을무드",
    persona: "클래식 웜",
    season: "가을 웜톤 딥",
    body: "하체 발달형",
    likes: 18,
    comments: 1,
    bg: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  },
  {
    id: 4,
    user: "봄의여신",
    persona: "로맨틱 페미닌",
    season: "봄 웜톤 라이트",
    body: "상체 발달형",
    likes: 89,
    comments: 21,
    bg: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
  },
];

export default function FeedPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Header />
      <main className="container flex-1 py-12 px-4 md:px-6">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white shadow-sm rounded-full border border-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Community
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight md:text-5xl">
              Style Feed
            </h1>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              다른 사람들은 어떤 스타일 페르소나를 가지고 있을까요? 다양한 분석 결과를 구경하고 새로운 영감을 얻어보세요.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex justify-end">
            <Button className="rounded-full shadow-md">
              <Share2 className="mr-2 h-4 w-4" />
              내 스타일 공유하기
            </Button>
          </div>

          {/* Feed Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DUMMY_FEED.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all group border-muted/50 cursor-pointer">
                  {/* Visual Representation of Persona */}
                  <div 
                    className="h-48 w-full p-4 flex flex-col justify-end relative"
                    style={{ background: item.bg }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="relative z-10 text-white">
                      <h3 className="font-bold text-xl drop-shadow-md">{item.persona}</h3>
                      <p className="text-xs font-medium opacity-90 drop-shadow-md">
                        {item.season} • {item.body}
                      </p>
                    </div>
                  </div>
                  
                  {/* Card Content & Actions */}
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold">{item.user}</span>
                      <Button variant="ghost" size="sm" className="h-8 rounded-full text-xs bg-muted/50">
                        팔로우
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-muted-foreground pt-2 border-t">
                      <button className="flex items-center gap-1.5 text-xs hover:text-primary transition-colors group/btn">
                        <Heart className="h-4 w-4 group-hover/btn:fill-primary" />
                        {item.likes}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs hover:text-primary transition-colors">
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
