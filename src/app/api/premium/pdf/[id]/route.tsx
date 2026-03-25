import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server';
import PDFTemplate from '@/components/features/PremiumReport/PDFTemplate';
import type { DeepAnalysisResult } from '@/types/premium';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Generating PDF for ID:', id);
    const supabase = await createClient();

    // Check auth status
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Auth user:', user?.id, 'Auth error:', authError);

    // 1. Get the premium report data
    // Try by ID first, then by analysis_id
    let { data: report, error } = await supabase
      .from('premium_reports')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!report) {
      const { data: reportByAnalysis, error: errorByAnalysis } = await supabase
        .from('premium_reports')
        .select('*')
        .eq('analysis_id', id)
        .maybeSingle();
      
      report = reportByAnalysis;
      error = errorByAnalysis;
    }

    if (error) {
      console.error('Supabase error fetching report:', error);
      return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
    }

    if (!report) {
      console.error('No report found for ID or analysis_id:', id);
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // 2. Security Check: Ensure payment is paid
    // Note: We access the joined payment status. In our schema it's payment_id UUID.
    // If your schema joined status differently, adjust this.
    // TEMPORARY: Allow development access
    // if (report.payment_transactions?.status !== 'paid') {
    //   return NextResponse.json({ error: 'Payment required' }, { status: 402 });
    // }

    const deepAnalysis = report.deep_analysis_json as DeepAnalysisResult;

    // 3. Render PDF to stream
    const stream = await renderToStream(
      <PDFTemplate data={deepAnalysis} />
    );

    // 4. Return as PDF response
    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="persona-premium-report-${id}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
