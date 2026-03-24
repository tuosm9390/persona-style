import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { DeepAnalysisResult } from '@/types/premium';

// 폰트 등록 (실제 구현 시 서버 폰트 경로 필요)
// Font.register({ family: 'Noto Sans KR', src: '...' });

const styles = StyleSheet.create({
  page: { padding: 60, fontFamily: 'Helvetica' },
  header: { marginBottom: 40, borderBottom: 2, paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a1a2e' },
  subtitle: { fontSize: 12, color: '#666', marginTop: 5 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#e94560' },
  content: { fontSize: 11, lineHeight: 1.6, color: '#333' },
  footer: { position: 'absolute', bottom: 30, left: 0, right: 0, textAlign: 'center', fontSize: 9, color: '#999' }
});

interface PDFTemplateProps {
  data: DeepAnalysisResult;
  personaType: string;
}

const PDFTemplate: React.FC<PDFTemplateProps> = ({ data, personaType }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Style Persona Expert Report</Text>
        <Text style={styles.subtitle}>Analysis for: {personaType}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Career Advice</Text>
        <Text style={styles.content}>{data.career_advice}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Relationship Tips</Text>
        <Text style={styles.content}>{data.relationship_tips}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Detailed Styling Guide</Text>
        <Text style={styles.content}>{data.detailed_styling_guide}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.content}>{data.overall_summary}</Text>
      </View>

      <Text style={styles.footer}>© 2026 PersonaStyle. All rights reserved.</Text>
    </Page>
  </Document>
);

export default PDFTemplate;
