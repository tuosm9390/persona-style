import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

if (!apiKey) {
  console.warn(
    "⚠️ Gemini API key is missing. Set GEMINI_API_KEY in .env.local",
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

// Fallback model list — prioritizing stable models with higher quotas
const FALLBACK_MODELS = [
  "gemini-2.5-pro",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
];

// Models capable of image generation (experimental/preview)
const IMAGE_MODELS = [
  "gemini-2.0-flash-exp",
  "gemini-2.0-pro-exp-02-05",
  "gemini-3-pro-image-preview",
];

export function getGeminiModel(modelName: string = "gemini-2.0-flash") {
  return genAI.getGenerativeModel({ model: modelName });
}

export async function generateMatchingSummary(
  sourceType?: string,
  targetType?: string,
  score: number = 0
): Promise<string> {
  const model = getGeminiModel();
  const prompt = `
    Two people have the following persona styles:
    Person A: ${sourceType || 'Unknown'}
    Person B: ${targetType || 'Unknown'}
    
    Their compatibility score is ${score}/100.
    
    Based on these personas, write a short, engaging "Chemistry Report" in Korean.
    The report should include:
    1. A brief summary of how their styles complement each other.
    2. Two actionable tips for their relationship or communication.
    
    Keep the tone friendly and professional. Output only the Korean text.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini matching error:", error);
    return "서로의 매력을 발견해가는 중입니다. 조금 더 대화해보면 어떨까요?";
  }
}

export { FALLBACK_MODELS, IMAGE_MODELS };
