"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TextInputProps {
  onTextChange: (text: string) => void;
  className?: string;
  value?: string;
}

export function TextInput({ onTextChange, className, value }: TextInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Textarea
        placeholder="Describe yourself... (e.g., 'I have a warm skin tone and I'm looking for a professional yet stylish outfit for a job interview at a tech startup.')"
        className="min-h-[200px] resize-none text-base leading-relaxed p-4"
        onChange={(e) => onTextChange(e.target.value)}
        value={value}
      />
      <p className="text-xs text-muted-foreground text-right">
        Be as descriptive as you like.
      </p>
    </div>
  );
}
