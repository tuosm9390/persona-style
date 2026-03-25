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
// Splits by period followed by space, or just period at end of string
export function formatTextWithLineBreaks(text: string): string[] {
  if (!text) return [];
  // Lookbehind (?<=\.) matches position after a period
  return text.split(/(?<=\.)\s+/);
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
