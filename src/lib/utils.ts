import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to format text with line breaks for better readability
// Splits by period followed by space, or just period at end of string
export function formatTextWithLineBreaks(text: string): string[] {
  if (!text) return [];
  // Lookbehind (?<=\.) matches position after a period
  return text.split(/(?<=\.)\s+/);
}
