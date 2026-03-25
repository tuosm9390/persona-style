import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateDeepAnalysis } from '@/lib/premium';

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  
  // 1. 인증 확인
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 2. 요청 파라미터
  const { analysis_id, payment_id } = await req.json();

  try {
    // 3. 결제 상태 확인 (원칙 VII 준수)
    const { data: payment } = await supabase
      .from('payment_transactions')
      .select('status')
      .eq('id', payment_id)
      .single();

    if (!payment || payment.status !== 'paid') {
      return NextResponse.json({ error: '결제가 완료되지 않았습니다.' }, { status: 403 });
    }

    // 4. 분석 데이터 로드
    const { data: history } = await supabase
      .from('analysis_history')
      .select('*')
      .eq('id', analysis_id)
      .single();

    if (!history) return NextResponse.json({ error: 'History not found' }, { status: 404 });

    // 5. 심층 분석 실행
    const deepAnalysis = await generateDeepAnalysis(history);

    // 6. 결과 저장
    const { data: report, error } = await supabase
      .from('premium_reports')
      .insert({
        analysis_id,
        user_id: session.user.id,
        payment_id,
        deep_analysis_json: deepAnalysis
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(report);
  } catch (error: any) {
    console.error('Premium API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
