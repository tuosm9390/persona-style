import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { generatePDFStream } from '@/lib/pdf';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id } = params;

  try {
    // 1. 인증 확인
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    // 2. 리포트 데이터 조회 (RLS 정책에 의해 결제 완료 건만 조회됨)
    const { data: report, error } = await supabase
      .from('premium_reports')
      .select('*, analysis_history(persona_type)')
      .eq('id', id)
      .single();

    if (error || !report) return new NextResponse('Report not found or not paid', { status: 404 });

    // 3. PDF 생성 및 스트리밍
    const stream = await generatePDFStream(
      report.deep_analysis_json,
      (report.analysis_history as any)?.persona_type || 'Unknown'
    );

    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="persona-expert-report-${id}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('PDF API error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
