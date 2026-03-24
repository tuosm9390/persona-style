import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import ShareCard from '@/components/features/ShareCard';
import { PERSONA_DESIGN_TOKENS } from '@/types/viral';

// 폰트 캐싱용 변수
let fontCache: ArrayBuffer | null = null;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id } = params;

  // ... (생략)

  // 3. SVG 생성 (Satori)
  // 폰트 캐싱 로직 적용
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

  return new NextResponse(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
