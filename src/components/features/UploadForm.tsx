"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UploadFormProps {
  onImageSelect: (file: File | null) => void;
  className?: string;
}

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function UploadForm({ onImageSelect, className }: UploadFormProps) {
  const { t } = useLanguage();
  const [preview, setPreview] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("w-full group/upload", className)}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />

      {preview ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-2xl border border-foreground/5 aspect-[3/4] group shadow-2xl shadow-primary/5"
        >
          <Image
            src={preview}
            alt={t("analyze.upload.preview")}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <Button
              variant="destructive"
              size="icon"
              onClick={clearImage}
              className="rounded-full h-12 w-12 shadow-xl shadow-black/20 hover:scale-110 transition-all"
              aria-label={t("analyze.upload.remove")}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl border-[1px] border-dashed aspect-[3/4] cursor-pointer transition-all duration-500",
            isDragging
              ? "border-primary bg-primary/[0.02] scale-[1.01] shadow-2xl shadow-primary/5"
              : "border-foreground/10 bg-foreground/[0.01] hover:border-primary/30 hover:bg-white hover:shadow-xl hover:shadow-primary/5"
          )}
          role="button"
          aria-label={t("analyze.upload.drop")}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm border border-foreground/[0.03] text-primary/40 mb-6 transition-transform duration-500 group-hover/upload:-translate-y-2 group-hover/upload:text-primary">
            <Upload className="h-8 w-8" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-bold uppercase tracking-wider text-foreground/60">
              {t("analyze.upload.drop")}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {t("analyze.upload.click")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

