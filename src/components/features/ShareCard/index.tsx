import React from 'react';
import { PersonaDesignConfig } from '@/types/viral';
import { Sparkles, Zap, Palette } from 'lucide-react';

interface ShareCardProps {
  data: {
    persona_type: string;
    core_keywords: string[];
    design_config: PersonaDesignConfig;
  };
}

const ShareCard: React.FC<ShareCardProps> = ({ data }) => {
  const { persona_type, core_keywords, design_config } = data;

  return (
    <div
      style={{
        width: '1080px',
        height: '1920px',
        backgroundColor: design_config.bg_color,
        color: design_config.text_color,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px',
        fontFamily: 'sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Patterns */}
      <div style={{ position: 'absolute', top: -100, right: -100, opacity: 0.2 }}>
        <Palette size={600} color={design_config.accent_color} />
      </div>
      <div style={{ position: 'absolute', bottom: -50, left: -50, opacity: 0.1 }}>
        <Zap size={400} color={design_config.accent_color} />
      </div>

      {/* Content */}
      <div style={{ zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '40px' }}>
          <Sparkles size={120} color={design_config.accent_color} />
        </div>
        
        <h2 style={{ fontSize: '48px', fontWeight: 'lighter', margin: '0 0 20px 0', opacity: 0.8 }}>
          My Persona Style is
        </h2>
        
        <h1 style={{ fontSize: '120px', fontWeight: 'bold', margin: '0 0 60px 0', lineHeight: 1.1 }}>
          {persona_type}
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
          {core_keywords.map((kw, i) => (
            <span
              key={i}
              style={{
                fontSize: '36px',
                padding: '15px 40px',
                borderRadius: '50px',
                border: `2px solid ${design_config.accent_color}`,
                backgroundColor: 'rgba(255,255,255,0.1)',
              }}
            >
              #{kw}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '80px', fontSize: '32px', opacity: 0.6 }}>
        persona-style.vercel.app
      </div>
    </div>
  );
};

export default ShareCard;
