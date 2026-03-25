import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json(); // type: 'like' | 'share'
    const supabase = await createServerSupabaseClient();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Interaction increment logic
    const { data: current, error: fetchError } = await supabase
      .from('analysis_history')
      .select('share_count')
      .eq('id', id)
      .maybeSingle();

    if (fetchError || !current) throw new Error("Analysis not found");

    const { error: finalError } = await supabase
      .from('analysis_history')
      .update({ share_count: (current?.share_count || 0) + 1 })
      .eq('id', id);

    if (finalError) throw finalError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Interaction error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
