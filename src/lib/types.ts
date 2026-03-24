export interface AnalysisResult {
  id?: string;
  summary: {
    title: string;
    keywords: string[];
    description: string;
  };
  analysis: {
    colorSeason: string;
    bodyType: string;
    faceShape: string;
    personalityVibe: string;
  };
  fashion: {
    overview: string;
    tops: string;
    bottoms: string;
    outerwear: string;
    shoes: string;
    accessories: string;
    colorsToWear: string[];
    colorsToAvoid: string[];
  };
  beauty: {
    overview: string;
    foundation: string;
    eyeMakeup: string;
    lipColor: string;
    blush: string;
    hairStyle: string;
    hairColor: string;
  };
  actionItems: string[];
}

export interface AnalyzeRequest {
  image?: string; // base64 encoded
  text?: string;
}
