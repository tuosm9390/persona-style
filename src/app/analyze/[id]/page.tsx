import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnalysisResultDisplay } from "@/features/analyze/components/AnalysisResult";
import { notFound } from "next/navigation";
import { AnalysisResult } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  
  const { data: analysis } = await supabase
    .from("analysis_history")
    .select("summary, analysis")
    .eq("id", id)
    .maybeSingle();

  if (!analysis) return { title: "PersonaStyle - Analysis Not Found" };

  const title = `${analysis.summary.title} | PersonaStyle`;
  const description = analysis.summary.description;
  const ogImage = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/share/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 540, height: 960 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function AnalysisDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: analysis, error } = await supabase
    .from("analysis_history")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !analysis) {
    notFound();
  }

  // Format back to AnalysisResult structure with proper types
  const result: AnalysisResult = {
    id: analysis.id,
    summary: analysis.summary,
    analysis: analysis.analysis,
    fashion: analysis.fashion,
    beauty: analysis.beauty,
    actionItems: analysis.action_items,
    profile: analysis.visual_profile,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AnalysisResultDisplay 
          result={result} 
          onReset={() => {}} 
          resetLabel="나도 분석하기"
        />
      </main>
      <Footer />
    </div>
  );
}
