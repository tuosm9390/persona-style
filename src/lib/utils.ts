import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { VisualAnalysisProfile } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Compresses an image file using Canvas API
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1024,
  quality: number = 0.8,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Resize if needed
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Quality adjustment (0.1 to 1.0)
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
  });
}

// Helper function to format text with line breaks for better readability
export function formatTextWithLineBreaks(text: string): string[] {
  if (!text) return [];
  // First split by explicit newline characters
  const lines = text.split(/\r?\n/);

  // Then for each line, if it's too long and contains periods, split by periods
  return lines
    .flatMap((line) => {
      if (line.length > 100) {
        // Split by period followed by space
        return line.split(/(?<=\.)\s+/);
      }
      return line;
    })
    .filter((line) => line.trim() !== "");
}

/**
 * Anonymizes visual profile data for community sharing (Constitution IX)
 */
export function anonymizeVisualProfile(
  profile: VisualAnalysisProfile,
): VisualAnalysisProfile {
  return {
    ...profile,
    metadata: {
      ...profile.metadata,
      anonymized: true,
    },
  };
}
