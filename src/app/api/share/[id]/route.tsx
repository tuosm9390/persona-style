import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import ShareCard from '@/components/features/ShareCard/index';
import { PERSONA_DESIGN_TOKENS } from '@/types/viral';

// 폰트 캐싱용 변수
let fontCache: ArrayBuffer | null = null;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerSupabaseClient();
  const { id } = await params;

  try {
    // 1. 데이터 조회
    const { data: history, error } = await supabase
      .from('analysis_history')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !history) {
      return new NextResponse('Analysis result not found', { status: 404 });
    }

    // 2. 디자인 설정 결정
    const personaType = history.persona_type;
    const designConfig = PERSONA_DESIGN_TOKENS[personaType] || PERSONA_DESIGN_TOKENS['기본'];

    // 3. SVG 생성 (Satori)
    if (!fontCache) {
      fontCache = await fetch(
        new URL('https://github.com/google/fonts/raw/main/ofl/notosanskr/NotoSansKR%5Bwght%5D.ttf')
      ).then((res) => res.arrayBuffer());
    }

    const svg = await satori(
      <ShareCard 
        data={{
          persona_type: personaType,
          core_keywords: history.core_keywords || [],
          design_config: designConfig
        }} 
      />,
      {
        width: 1080,
        height: 1920,
        fonts: [
          {
            name: 'Noto Sans KR',
            data: fontCache!,
            weight: 400,
            style: 'normal',
          },
        ],
      }
    );

    // 4. PNG 변환 (Resvg)
    const resvg = new Resvg(svg);
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    // 5. 공유 횟수 증가
    await supabase
      .from('analysis_history')
      .update({ share_count: (history.share_count || 0) + 1 })
      .eq('id', id);

    return new NextResponse(pngBuffer as any, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Share image API error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
