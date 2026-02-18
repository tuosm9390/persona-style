"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { FormattedText } from "@/components/ui/formatted-text";
import { ArrowRight, Sparkles, Upload } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 max-w-3xl"
              >
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-4">
                  <Sparkles className="mr-1 h-3 w-3" />
                  {t("home.badge")}
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  {t("hero.title")}
                </h1>
                <FormattedText
                  text={t("hero.subtitle")}
                  className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl text-center"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col gap-4 min-[400px]:flex-row"
              >
                <Button size="lg" className="h-12 px-8 text-base w-full sm:w-auto" asChild>
                  <Link href="/analyze" className="flex items-center justify-center gap-2">
                    {t("common.startAnalysis")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 text-base w-full sm:w-auto" asChild>
                  <Link href="/examples">
                    {t("common.seeExamples")}
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Background Gradient */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[800px] opacity-10 blur-3xl rounded-full bg-gradient-to-tr from-primary to-accent pointer-events-none" />
        </section>

        {/* Features Section */}
        <section id="features" className="container py-12 md:py-24 lg:py-32 px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Upload,
                title: t("home.features.visualAnalysis.title"),
                description: t("home.features.visualAnalysis.desc")
              },
              {
                icon: Sparkles,
                title: t("home.features.personalityMatch.title"),
                description: t("home.features.personalityMatch.desc")
              },
              {
                icon: ArrowRight,
                title: t("home.features.actionableAdvice.title"),
                description: t("home.features.actionableAdvice.desc")
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <FormattedText
                  text={feature.description}
                  className="text-muted-foreground"
                />
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
