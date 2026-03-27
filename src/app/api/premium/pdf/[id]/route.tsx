import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generatePDFBuffer } from '@/lib/pdf';
import { logger } from '@/lib/logger';
import type { DeepAnalysisResult } from '@/types/premium';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const requestId = Math.random().toString(36).substring(7);

  try {
    logger.info('Handling PDF request', { requestId, id });
    const supabase = await createServerSupabaseClient();

    // Check auth status
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      logger.warn('Unauthorized PDF access attempt', { requestId, id, authError });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get the premium report data
    let { data: report, error: fetchError } = await supabase
      .from('premium_reports')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    // Try by analysis_id if not found by primary key
    if (!report) {
      const { data: reportByAnalysis, error: errorByAnalysis } = await supabase
        .from('premium_reports')
        .select('*')
        .eq('analysis_id', id)
        .maybeSingle();
      
      report = reportByAnalysis;
      fetchError = errorByAnalysis;
    }

    if (fetchError) {
      logger.error('Database error fetching report', { requestId, id, error: fetchError });
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!report) {
      logger.warn('Report not found', { requestId, id });
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Security Check: Ensure the user owns this report
    if (report.user_id !== user.id) {
      logger.warn('Forbidden PDF access attempt', { requestId, id, userId: user.id, ownerId: report.user_id });
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Check if PDF already exists in Storage
    if (report.pdf_url) {
      logger.info('PDF already exists, generating signed URL', { requestId, id, pdf_url: report.pdf_url });
      
      const { data: signedData, error: signError } = await supabase
        .storage
        .from('premium_pdfs')
        .createSignedUrl(report.pdf_url, 3600); // 1 hour

      if (!signError && signedData?.signedUrl) {
        return NextResponse.redirect(signedData.signedUrl);
      }
      
      logger.warn('Failed to create signed URL, falling back to regeneration', { requestId, signError });
    }

    // 3. Render PDF to buffer (if not exists or signed URL failed)
    const deepAnalysis = report.deep_analysis_json as DeepAnalysisResult;
    const personaType = report.persona_type || 'Premium Persona';

    logger.info('Generating new PDF buffer', { requestId, id });
    const buffer = await generatePDFBuffer(deepAnalysis, personaType);

    // 4. Upload to Supabase Storage
    const fileName = `report_${id}_${Date.now()}.pdf`;
    logger.info('Uploading PDF to storage', { requestId, fileName });

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('premium_pdfs')
      .upload(fileName, buffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      logger.error('Failed to upload PDF to storage', { requestId, uploadError });
      // Continue returning the buffer anyway so the user gets their file
    } else if (uploadData?.path) {
      // 5. Update the DB with the storage path
      const { error: updateError } = await supabase
        .from('premium_reports')
        .update({ pdf_url: uploadData.path })
        .eq('id', report.id);

      if (updateError) {
        logger.error('Failed to update report with PDF URL', { requestId, updateError });
      } else {
        logger.info('Successfully stored PDF and updated database', { requestId, path: uploadData.path });
      }
    }

    // 6. Return as PDF response
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="PersonaStyle_Report_${id}.pdf"`,
      },
    });
  } catch (err: unknown) {
    logger.error('PDF generation fatal error', { requestId, id, error: err });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
