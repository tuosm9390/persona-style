import { z } from 'zod';

export const matchRequestSchema = z.object({
  source_id: z.string().uuid(),
  target_id: z.string().uuid(),
});

export const analysisIdSchema = z.object({
  id: z.string().uuid(),
});

export async function validateRequest<T>(schema: z.Schema<T>, data: unknown): Promise<{ success: true; data: T } | { success: false; error: string }> {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }
  return { success: true, data: result.data };
}
