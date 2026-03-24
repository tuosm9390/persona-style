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

export { FALLBACK_MODELS, IMAGE_MODELS };
