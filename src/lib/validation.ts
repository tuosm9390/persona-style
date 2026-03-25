import { z } from "zod";

export const analyzeRequestSchema = z.object({
  image: z.string().optional(),
  text: z.string().optional(),
  language: z.enum(["ko", "en"]).default("ko"),
}).refine(data => data.image || data.text, {
  message: "Either image or text must be provided",
});

export const premiumAnalyzeRequestSchema = z.object({
  analysis_id: z.string().uuid(),
});

export const matchRequestSchema = z.object({
  source_id: z.string().uuid(),
  target_id: z.string().uuid(),
});

export const analysisIdSchema = z.object({
  id: z.string().uuid(),
});

export const visualAnalysisSchema = z.object({
  hair: z.object({
    style: z.string(),
    color: z.string(),
  }),
  face: z.object({
    shape: z.enum(["oval", "round", "square", "heart", "oblong", "diamond"]),
    tone: z.string(),
    fitzpatrick: z.enum([
      "Type I",
      "Type II",
      "Type III",
      "Type IV",
      "Type V",
      "Type VI",
    ]),
  }),
  body: z.object({
    type: z.enum([
      "hourglass",
      "inverted_triangle",
      "rectangle",
      "pear",
      "apple",
      "athletic",
    ]),
    posture: z.string(),
  }),
  apparel: z.object({
    top: z.object({ category: z.string(), color: z.string(), fit: z.string() }),
    bottom: z.object({
      category: z.string(),
      color: z.string(),
      fit: z.string(),
    }),
    outer: z
      .object({ category: z.string(), color: z.string(), fit: z.string() })
      .optional(),
  }),
  personalColor: z.string(),
  metadata: z.object({
    anonymized: z.boolean().default(false),
    version: z.string(),
    confidence: z.number().min(0).max(1),
  }),
});

export async function validateRequest<T>(
  schema: z.Schema<T>,
  data: unknown,
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }
  return { success: true, data: result.data };
}
