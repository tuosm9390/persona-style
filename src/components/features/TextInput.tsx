"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TextInputProps {
  onTextChange: (text: string) => void;
  className?: string;
  value?: string;
}

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function TextInput({ onTextChange, className, value }: TextInputProps) {
  const { t } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("space-y-3 flex flex-col h-full", className)}
    >
      <div className="relative flex-1 group">
        <Textarea
          placeholder={t("analyze.textInput.placeholder")}
          className="h-full min-h-[200px] resize-none text-base font-light leading-relaxed p-6 bg-white/50 border-foreground/5 focus-visible:border-primary/20 focus-visible:ring-primary/5 transition-all duration-500 rounded-2xl group-hover:bg-white"
          onChange={(e) => onTextChange(e.target.value)}
          value={value}
        />
        <div className="absolute bottom-4 right-4 text-[10px] uppercase tracking-widest text-muted-foreground/40 font-bold">
          {value?.length || 0} characters
        </div>
      </div>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold px-2">
        {t("analyze.textInput.helper")}
      </p>
    </motion.div>
  );
}

