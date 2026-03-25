import { describe, it, expect } from 'vitest';
import { getImageAnalysisPrompt, ADVANCED_VISUAL_ANALYSIS_INSTRUCTION } from '../prompts';
import { visualAnalysisSchema } from '../validation';

describe('Prompt Consistency Analysis', () => {
  it('should include advanced visual analysis instructions', () => {
    const prompt = getImageAnalysisPrompt('ko');
    expect(prompt).toContain(ADVANCED_VISUAL_ANALYSIS_INSTRUCTION.trim());
  });

  it('should explicitly mention Fitzpatrick Scale for skin tone normalization', () => {
    const prompt = getImageAnalysisPrompt('ko');
    expect(prompt).toContain('Fitzpatrick Scale');
  });

  it('should contain JSON schema field requirements', () => {
    const prompt = getImageAnalysisPrompt('ko');
    expect(prompt).toContain('hair_style');
    expect(prompt).toContain('face_shape');
    expect(prompt).toContain('skin_tone');
  });
});

describe('VisualAnalysis Schema Validation', () => {
  it('should validate a correct visual analysis profile', () => {
    const validData = {
      hair: { style: 'long_wavy', color: 'dark_brown' },
      face: { shape: 'oval', tone: 'neutral', fitzpatrick: 'Type III' },
      body: { type: 'hourglass', posture: 'straight' },
      apparel: {
        top: { category: 'blouse', color: 'white', fit: 'regular' },
        bottom: { category: 'jeans', color: 'blue', fit: 'slim' }
      },
      personalColor: 'Autumn Mute',
      metadata: { anonymized: false, version: '1.0.0', confidence: 0.95 }
    };
    const result = visualAnalysisSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail if required fields are missing', () => {
    const invalidData = { hair: { style: 'short' } };
    const result = visualAnalysisSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
