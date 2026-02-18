import type { AnalysisResult } from "./types";

export interface AnalysisHistoryItem {
  id: string;
  timestamp: number;
  result: AnalysisResult;
  inputType: "photo" | "text" | "combined";
}

const STORAGE_KEY = "personastyle_history";
const MAX_HISTORY_ITEMS = 20;

/**
 * Save analysis result to localStorage
 */
export function saveAnalysisToHistory(
  result: AnalysisResult,
  inputType: "photo" | "text" | "combined"
): void {
  try {
    const history = getAnalysisHistory();
    const newItem: AnalysisHistoryItem = {
      id: `analysis_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      timestamp: Date.now(),
      result,
      inputType,
    };

    // Add to beginning and limit to MAX_HISTORY_ITEMS
    const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save analysis to history:", error);
  }
}

/**
 * Get all analysis history from localStorage
 */
export function getAnalysisHistory(): AnalysisHistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as AnalysisHistoryItem[];
  } catch (error) {
    console.error("Failed to load analysis history:", error);
    return [];
  }
}

/**
 * Get a single analysis by ID
 */
export function getAnalysisById(id: string): AnalysisHistoryItem | null {
  const history = getAnalysisHistory();
  return history.find((item) => item.id === id) || null;
}

/**
 * Delete a single analysis from history
 */
export function deleteAnalysisFromHistory(id: string): void {
  try {
    const history = getAnalysisHistory();
    const updatedHistory = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to delete analysis from history:", error);
  }
}

/**
 * Clear all history
 */
export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear history:", error);
  }
}
