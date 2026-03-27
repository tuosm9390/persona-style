"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonaDistribution } from '@/types/viral';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface TrendDashboardProps {
  distributions: PersonaDistribution[];
}

const TrendDashboard: React.FC<TrendDashboardProps> = ({ distributions }) => {
  const { t } = useLanguage();

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {distributions.map((stat, index) => (
        <Card key={stat.persona_type} className="overflow-hidden border-none shadow-xl shadow-primary/[0.02] bg-white/50 backdrop-blur-sm group hover:bg-white transition-all duration-500 hover:-translate-y-1">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-primary/5 text-primary/60 uppercase tracking-widest border border-primary/5">
                {t("trend.rank")} #{index + 1}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/60">
                {t("trend.count").replace("{count}", stat.count.toString())}
              </span>
            </div>
            <CardTitle className="font-display text-2xl font-bold mt-4 tracking-tight text-primary">{stat.persona_type}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <span className="text-4xl font-display font-bold text-primary italic">{stat.ratio.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-foreground/5 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${stat.ratio}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  viewport={{ once: true }}
                  className="bg-primary h-full rounded-full" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};


export default TrendDashboard;
