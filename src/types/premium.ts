export interface DeepAnalysisResult {
  summary: {
    title: string;
    brandAura: string;
    keywords: string[];
  };
  deepAnalysis: {
    vibeArchetype: string;
    colorPsychology: string;
    structuralHarmony: string;
  };
  strategicStyling: {
    offDutyLuxury: string;
    socialInfluence: string;
    businessExecutive: string;
  };
  expertRecommendations: {
    careerAdvice: string;
    lifestyleUpgrade: string;
    relationshipTips: string;
  };
  actionPlan: {
    immediate: string;
    shortTerm: string;
    longTerm: string;
  };
  detailedCapsuleWardrobe?: Array<{
    category: string;
    items: string[];
    reasoning: string;
  }>;
}

export interface PremiumReport {
  id: string;
  analysis_id: string;
  user_id: string;
  deep_analysis_json: DeepAnalysisResult;
  pdf_url: string | null;
  payment_id: string | null;
  created_at: string;
}
