import { renderToStream } from '@react-pdf/renderer';
import React from 'react';
import PDFTemplate from '@/components/features/PremiumReport/PDFTemplate';
import { DeepAnalysisResult } from '@/types/premium';

export async function generatePDFStream(data: DeepAnalysisResult, personaType: string) {
  return await renderToStream(<PDFTemplate data={data} personaType={personaType} />);
}
