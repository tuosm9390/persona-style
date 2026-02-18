"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TextInputProps {
  onTextChange: (text: string) => void;
  className?: string;
  value?: string;
}

import { useLanguage } from "@/contexts/LanguageContext";

export function TextInput({ onTextChange, className, value }: TextInputProps) {
  const { t } = useLanguage();

  return (
    <div className={cn("space-y-2", className)}>
      <Textarea
        placeholder={t("analyze.textInput.placeholder")}
        className="min-h-[200px] resize-none text-base leading-relaxed p-4"
        onChange={(e) => onTextChange(e.target.value)}
        value={value}
      />
      <p className="text-xs text-muted-foreground text-right">
        {t("analyze.textInput.helper")}
      </p>
    </div>
  );
}
