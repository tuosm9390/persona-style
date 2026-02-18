import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

if (!apiKey) {
  console.warn(
    "⚠️ Gemini API key is missing. Set GEMINI_API_KEY in .env.local"
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

// Fallback model list — each model has its own separate quota
const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-3-flash-preview",
  "gemini-flash-latest",
];

export function getGeminiModel(modelName: string = "gemini-2.5-flash") {
  return genAI.getGenerativeModel({ model: modelName });
}

export { FALLBACK_MODELS };
