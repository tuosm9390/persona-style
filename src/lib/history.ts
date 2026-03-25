import type { AnalysisResult } from "./types";
import { supabase, isSupabaseConfigured } from "./supabase";

export interface AnalysisHistoryItem {
  id: string;
  timestamp: number;
  result: AnalysisResult;
  inputType: "photo" | "text" | "combined";
}

const STORAGE_KEY = "personastyle_history";
const MAX_HISTORY_ITEMS = 20;

/**
 * Save analysis result (Hybrid: Supabase if configured & logged in, else LocalStorage)
 */
export async function saveAnalysisToHistory(
  result: AnalysisResult,
  inputType: "photo" | "text" | "combined",
): Promise<void> {
  const newItem: AnalysisHistoryItem = {
    id: `analysis_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    timestamp: Date.now(),
    result,
    inputType,
  };

  try {
    // 1. Try Supabase if configured
    if (isSupabaseConfigured()) {
      const {
        data: { session },
      } = await supabase!.auth.getSession();

      if (session?.user) {
        const { error } = await supabase!.from("analysis_history").insert({
          user_id: session.user.id,
          input_type: inputType,
          summary: result.summary,
          analysis: result.analysis,
          fashion: result.fashion,
          beauty: result.beauty,
          action_items: result.actionItems,
          visual_profile: result.profile,
        });

        if (!error) {
          console.log("Saved to Supabase successfully");
          return; // 성공 시 여기서 종료, 로컬 스토리지에는 저장 안함 (선택적)
        } else {
          console.error("Supabase save error, falling back to local:", error);
        }
      }
    }
  } catch (error) {
    console.error("Supabase interaction failed:", error);
  }

  // 2. Fallback to LocalStorage
  try {
    const history = await getAnalysisHistory(); // now returns Promise
    const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save analysis to history:", error);
  }
}

/**
 * Get all analysis history (Hybrid)
 * Note: Changed to async since Supabase fetch is async.
 */
export async function getAnalysisHistory(): Promise<AnalysisHistoryItem[]> {
  try {
    if (isSupabaseConfigured()) {
      const {
        data: { session },
      } = await supabase!.auth.getSession();

      if (session?.user) {
        const { data, error } = await supabase!
          .from("analysis_history")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(MAX_HISTORY_ITEMS);

        if (!error && data) {
          // Format Supabase data back to AnalysisHistoryItem structure
          return data.map((row) => ({
            id: row.id,
            timestamp: new Date(row.created_at).getTime(),
            inputType: row.input_type as "photo" | "text" | "combined",
            result: {
              summary: row.summary,
              analysis: row.analysis,
              fashion: row.fashion,
              beauty: row.beauty,
              actionItems: row.action_items,
              profile: row.visual_profile,
            },
          }));
        }
      }
    }
  } catch (error) {
    console.error("Supabase fetch error, falling back to local:", error);
  }

  // Fallback to LocalStorage
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
 * Delete a single analysis from history
 */
export async function deleteAnalysisFromHistory(id: string): Promise<void> {
  try {
    if (isSupabaseConfigured()) {
      const {
        data: { session },
      } = await supabase!.auth.getSession();
      if (session?.user) {
        // ID가 UUID 형식이면 Supabase 삭제 시도
        if (id.includes("-")) {
          const { error } = await supabase!
            .from("analysis_history")
            .delete()
            .eq("id", id);
          if (!error) return;
        }
      }
    }
  } catch (error) {
    console.error("Supabase delete failed:", error);
  }

  // LocalStorage deletion fallback
  try {
    const history = await getAnalysisHistory();
    const updatedHistory = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to delete analysis from history:", error);
  }
}

/**
 * Clear all history (Local only typically, as clearing DB is destructive)
 */
export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear history:", error);
  }
}
