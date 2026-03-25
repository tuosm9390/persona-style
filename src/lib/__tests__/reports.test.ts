import { describe, it, expect } from 'vitest';
import { generateVisualReport } from '../reports';
import { FitzpatrickScale, FaceShape, BodyType } from '../types';

describe('Visual Report Generation', () => {
  it('should generate a report containing key visual attributes', () => {
    const profile = {
      hair: { style: 'short_cut', color: 'black' },
      face: { shape: FaceShape.Oval, tone: 'bright', fitzpatrick: FitzpatrickScale.Type2 },
      body: { type: BodyType.Rectangle, posture: 'straight' },
      apparel: {
        top: { category: 'shirt', color: 'white', fit: 'regular' },
        bottom: { category: 'slacks', color: 'black', fit: 'slim' }
      },
      personalColor: 'Winter Cool',
      metadata: { anonymized: false, version: '1.0.0', confidence: 0.9 }
    };

    const report = generateVisualReport(profile);
    expect(report.toLowerCase()).toContain('oval');
    expect(report.toLowerCase()).toContain('rectangle');
    expect(report.toLowerCase()).toContain('winter cool');
  });
});
