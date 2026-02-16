"use client";

import { Header } from "@/components/layout/Header";
import { motion } from "framer-motion";
import { Sparkles, Brain, Heart, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl space-y-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl font-display font-bold tracking-tight md:text-5xl lg:text-6xl">
              Redefining Personal Style <br />
              <span className="text-primary">with Artificial Intelligence</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              PersonaStyle은 단순한 패션 추천을 넘어, 당신의 고유한 매력을 찾아내고
              가장 나다운 스타일을 완성하도록 돕는 AI 퍼스널 스타일링 파트너입니다.
            </p>
          </motion.div>

          {/* Mission Section */}
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Brain,
                title: "Data-Driven Analysis",
                description:
                  "Gemini AI의 강력한 시각/언어 모델을 활용하여 피부톤, 체형, 성향을 정밀하게 분석합니다.",
              },
              {
                icon: Heart,
                title: "User-Centric Design",
                description:
                  "누구나 쉽게 자신의 스타일을 찾을 수 있도록 직관적이고 아름다운 경험을 제공합니다.",
              },
              {
                icon: ShieldCheck,
                title: "Private & Secure",
                description:
                  "업로드된 사진과 데이터는 분석 목적으로만 사용되며 안전하게 보호됩니다.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-secondary/30"
              >
                <div className="p-3 rounded-full bg-background shadow-sm">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="prose prose-gray mx-auto text-center dark:prose-invert"
          >
            <h2 className="text-2xl font-bold font-display mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-loose">
              우리는 "나에게 정말 어울리는 옷은 무엇일까?"라는 단순한 질문에서
              시작했습니다. 수많은 트렌드 속에서 자신만의 색깔을 잃어버리기 쉬운
              요즘, PersonaStyle은 기술을 통해 개개인의 고유한 아름다움을
              재조명하고자 합니다. 당신이 누구든지, 어디에 있든지, PersonaStyle과
              함께라면 자신감 넘치는 스타일을 발견할 수 있습니다.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
