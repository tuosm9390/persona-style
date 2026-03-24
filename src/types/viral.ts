export interface PersonaDesignConfig {
  bg_color: string;
  pattern_type: 'geometric' | 'organic' | 'abstract';
  accent_color: string;
  text_color: string;
}

export interface PersonaDistribution {
  persona_type: string;
  count: number;
  ratio: number;
  rank: number;
}

export interface MatchingResult {
  match_id: string;
  score: number;
  summary: string;
  tips: string[];
}

export const PERSONA_DESIGN_TOKENS: Record<string, PersonaDesignConfig> = {
  '철학적 몽상가': {
    bg_color: '#1a1a2e',
    pattern_type: 'abstract',
    accent_color: '#e94560',
    text_color: '#ffffff',
  },
  '현실적 개척자': {
    bg_color: '#f0f0f0',
    pattern_type: 'geometric',
    accent_color: '#0f3460',
    text_color: '#333333',
  },
  '창의적 예술가': {
    bg_color: '#ff2e63',
    pattern_type: 'organic',
    accent_color: '#252a34',
    text_color: '#eaeaea',
  },
  '기본': {
    bg_color: '#ffffff',
    pattern_type: 'geometric',
    accent_color: '#000000',
    text_color: '#000000',
  }
};
