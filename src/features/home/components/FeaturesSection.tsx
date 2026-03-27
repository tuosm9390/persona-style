"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Upload } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
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
  ];

  return (
    <section id="features" className="py-24 md:py-32 bg-white/30 backdrop-blur-sm border-y border-foreground/[0.03]">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className="group flex flex-col items-start space-y-6 p-2"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-foreground/[0.05] text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary/10">
                <feature.icon className="h-6 w-6" />
              </div>
              <div className="space-y-3">
                <h3 className="font-display text-2xl font-semibold tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
