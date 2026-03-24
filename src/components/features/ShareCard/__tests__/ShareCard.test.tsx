import { render, screen } from '@testing-library/react';
import ShareCard from '../index';

describe('ShareCard Component', () => {
  const mockData = {
    persona_type: '철학적 몽상가',
    core_keywords: ['창의적', '심오함', '사색가'],
    design_config: {
      bg_color: '#1a1a2e',
      pattern_type: 'abstract',
      accent_color: '#e94560',
      text_color: '#ffffff',
    },
  };

  it('should render persona type and keywords', () => {
    render(<ShareCard data={mockData} />);
    expect(screen.getByText('철학적 몽상가')).toBeInTheDocument();
    expect(screen.getByText('창의적')).toBeInTheDocument();
  });
});
