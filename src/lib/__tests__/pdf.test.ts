import { describe, it, expect } from 'vitest';
import { generatePDFStream } from '../pdf';

describe('PDF Generation Service', () => {
  it('should be defined', () => {
    expect(generatePDFStream).toBeDefined();
  });
});
