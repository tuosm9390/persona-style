import { renderToStream, renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import PDFTemplate from "@/features/premium/components/PDFTemplate";
import { DeepAnalysisResult } from '@/types/premium';

export async function generatePDFStream(data: DeepAnalysisResult, personaType: string) {
  return await renderToStream(<PDFTemplate data={data} personaType={personaType} />);
}

export async function generatePDFBuffer(data: DeepAnalysisResult, personaType: string) {
  return await renderToBuffer(<PDFTemplate data={data} personaType={personaType} />);
}
