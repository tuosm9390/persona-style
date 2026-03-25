import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPersonaStats, refreshStats } from "@/lib/trend";

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient();

  try {
    // Vercel Cron Job 호출 시 또는 수동 갱신 파라미터가 있을 때만 갱신
    const refresh = req.nextUrl.searchParams.get("refresh") === "true";
    if (refresh) {
      await refreshStats(supabase);
    }

    const stats = await getPersonaStats(supabase);
    return NextResponse.json({
      last_updated: stats[0]?.updated_at || new Date().toISOString(),
      distributions: stats,
    });
  } catch (error: unknown) {
    console.error("Trend API error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch trends";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
