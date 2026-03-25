import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getGeminiModelJson, PREMIUM_MODEL } from "@/lib/gemini";
import { getPremiumAnalysisPrompt } from "@/lib/prompts";
import { premiumAnalyzeRequestSchema, validateRequest } from "@/lib/validation";
import type { DeepAnalysisResult, PremiumReport } from "@/types/premium";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = await validateRequest(premiumAnalyzeRequestSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { analysis_id } = validation.data;

    // 1. Check for existing paid transaction
    // MUST BE ENFORCED IN PRODUCTION
    const { data: transaction, error: txError } = await supabase
      .from("payment_transactions")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "paid")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (txError || !transaction) {
      console.warn(`Unauthorized premium access attempt by user ${user.id}`);
      return NextResponse.json(
        {
          error: "Payment required to access premium analysis.",
        },
        { status: 402 },
      );
    }

    // 2. Fetch the original analysis data
    const { data: analysis, error: analysisError } = await supabase
      .from("analysis_history")
      .select("*")
      .eq("id", analysis_id)
      .single();

    if (analysisError || !analysis) {
      return NextResponse.json(
        { error: "Original analysis not found" },
        { status: 404 },
      );
    }

    // 3. Generate Deep Analysis using Premium Model
    const model = getGeminiModelJson(PREMIUM_MODEL);
    const prompt = `
      ${getPremiumAnalysisPrompt(analysis.language || "ko")}
      
      CONTEXT FROM ORIGINAL ANALYSIS:
      Title: ${analysis.summary.title}
      Keywords: ${analysis.summary.keywords.join(", ")}
      Color Season: ${analysis.analysis.colorSeason}
      Body Type: ${analysis.analysis.bodyType}
      Face Shape: ${analysis.analysis.faceShape}
      Fashion Advice: ${analysis.fashion.overview}
      Beauty Advice: ${analysis.beauty.overview}
      
      VISUAL PROFILE:
      ${JSON.stringify(analysis.visual_profile, null, 2)}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonStr = responseText.match(/\{[\s\S]*\}/)?.[0] || "{}";
    const deepAnalysisJson = JSON.parse(jsonStr) as DeepAnalysisResult;

    // 4. Save to premium_reports
    const { data: report, error: saveError } = await supabase
      .from("premium_reports")
      .insert({
        analysis_id,
        user_id: user.id,
        deep_analysis_json: deepAnalysisJson as any, // DB stores as JSONB
        payment_id: transaction?.id || null,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Save premium report error:", saveError);
      throw new Error("Failed to save premium report");
    }

    return NextResponse.json({ result: report as PremiumReport });
  } catch (error: unknown) {
    console.error("Premium analysis error:", error);
    const message =
      error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
