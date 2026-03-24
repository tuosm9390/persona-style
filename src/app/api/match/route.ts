import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { calculatePersonaMatch } from '@/lib/matching';
import { matchRequestSchema, validateRequest } from '@/lib/validation';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // 1. 세션 확인
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. 요청 데이터 검증
  const body = await req.json();
  const validation = await validateRequest(matchRequestSchema, body);
  
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { source_id, target_id } = validation.data;

  try {
    // 3. 소유권 검증 (원칙 VII: Privacy-First)
    const { data: sourceData } = await supabase
      .from('analysis_history')
      .select('user_id')
      .eq('id', source_id)
      .single();

    if (!sourceData || sourceData.user_id !== session.user.id) {
      return NextResponse.json({ error: '본인의 분석 결과만 소스로 사용할 수 있습니다.' }, { status: 403 });
    }

    // 4. 매칭 계산
    const matchResult = await calculatePersonaMatch(supabase, source_id, target_id);
    return NextResponse.json(matchResult);
  } catch (error: any) {
    console.error('Matching API error:', error);
    return NextResponse.json({ error: error.message || 'Matching failed' }, { status: 500 });
  }
}
