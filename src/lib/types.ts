export enum FitzpatrickScale {
  Type1 = "Type I",
  Type2 = "Type II",
  Type3 = "Type III",
  Type4 = "Type IV",
  Type5 = "Type V",
  Type6 = "Type VI",
}

export enum FaceShape {
  Oval = "oval",
  Round = "round",
  Square = "square",
  Heart = "heart",
  Oblong = "oblong",
  Diamond = "diamond",
}

export enum BodyType {
  Hourglass = "hourglass",
  InvertedTriangle = "inverted_triangle",
  Rectangle = "rectangle",
  Pear = "pear",
  Apple = "apple",
  Athletic = "athletic",
}

export interface VisualAnalysisProfile {
  hair: {
    style: string;
    color: string;
  };
  face: {
    shape: FaceShape;
    tone: string;
    fitzpatrick: FitzpatrickScale;
  };
  body: {
    type: BodyType;
    posture: string;
  };
  apparel: {
    top: { category: string; color: string; fit: string };
    bottom: { category: string; color: string; fit: string };
    outer?: { category: string; color: string; fit: string };
  };
  personalColor: string;
  metadata: {
    anonymized: boolean;
    version: string;
    confidence: number;
  };
}

export interface AnalysisResult {
  id?: string;
  profile?: VisualAnalysisProfile;
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

export interface HistoryItem {
  id: string;
  user_id: string;
  input_type: "photo" | "text" | "combined";
  summary: AnalysisResult["summary"];
  analysis: AnalysisResult["analysis"];
  fashion: AnalysisResult["fashion"];
  beauty: AnalysisResult["beauty"];
  action_items: AnalysisResult["actionItems"];
  visual_profile?: VisualAnalysisProfile;
  persona_type?: string;
  core_keywords?: string[];
  is_public: boolean;
  share_count: number;
  created_at: string;
  language?: "ko" | "en";
}
