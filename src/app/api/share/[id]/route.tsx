import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import ShareCard from '@/components/features/ShareCard';
import { PERSONA_DESIGN_TOKENS } from '@/types/viral';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id } = params;

  // 1. 데이터 조회
  const { data: history, error } = await supabase
    .from('analysis_history')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !history) {
    return new NextResponse('Analysis not found', { status: 404 });
  }

  // 2. 디자인 설정 구성
  const personaType = history.persona_type || '기본';
  const designConfig = history.design_config?.bg_color 
    ? history.design_config 
    : (PERSONA_DESIGN_TOKENS[personaType] || PERSONA_DESIGN_TOKENS['기본']);

  // 3. SVG 생성 (Satori)
  // 폰트 로드 (실제 프로덕션에서는 서버 파일 시스템에서 로드 권장)
  const fontData = await fetch(
    new URL('https://github.com/google/fonts/raw/main/ofl/notosanskr/NotoSansKR%5Bwght%5D.ttf')
  ).then((res) => res.arrayBuffer());

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
          data: fontData,
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

  return new NextResponse(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
