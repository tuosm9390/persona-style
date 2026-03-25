import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { DeepAnalysisResult } from '@/types/premium';

// Register Pretendard font for better Korean support and stability
Font.register({
  family: 'Pretendard',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/packages/pretendard/dist/public/static/Pretendard-Regular.otf',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/packages/pretendard/dist/public/static/Pretendard-Bold.otf',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 50, fontFamily: 'Pretendard', backgroundColor: '#fff' },
  header: { marginBottom: 30, borderBottomWidth: 1, borderBottomColor: '#eee', borderBottomStyle: 'solid', paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 5 },
  subtitle: { fontSize: 12, color: '#e94560', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  auraSection: { marginBottom: 25, padding: 15, backgroundColor: '#f8f9fa', borderRadius: 8 },
  auraTitle: { fontSize: 14, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 8 },
  auraContent: { fontSize: 10, lineHeight: 1.6, color: '#444' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#1a1a2e', borderLeftWidth: 4, borderLeftColor: '#e94560', borderLeftStyle: 'solid', paddingLeft: 10 },
  grid: { flexDirection: 'row', gap: 20, marginBottom: 10 },
  col: { flex: 1 },
  itemTitle: { fontSize: 12, fontWeight: 'bold', color: '#e94560', marginBottom: 5 },
  textContent: { fontSize: 10, lineHeight: 1.6, color: '#333' },
  wardrobeCard: { marginBottom: 15, padding: 12, borderWidth: 1, borderColor: '#eee', borderStyle: 'solid', borderRadius: 6 },
  wardrobeCategory: { fontSize: 12, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 5 },
  wardrobeItems: { fontSize: 9, color: '#555', marginBottom: 5 },
  planBox: { marginTop: 20, padding: 15, borderWidth: 1, borderColor: '#1a1a2e', borderStyle: 'solid', borderRadius: 4 },
  footer: { position: 'absolute', bottom: 30, left: 50, right: 50, textAlign: 'center', fontSize: 8, color: '#999', borderTopWidth: 1, borderTopColor: '#eee', borderTopStyle: 'solid', paddingTop: 10 }
});

interface PDFTemplateProps {
  data: DeepAnalysisResult;
}

const PDFTemplate: React.FC<PDFTemplateProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Premium Style & Brand Report</Text>
        <Text style={styles.title}>{data.summary.title}</Text>
        <Text style={{ fontSize: 9, color: '#666' }}>Keywords: {data.summary.keywords.join(' • ')}</Text>
      </View>

      <View style={styles.auraSection}>
        <Text style={styles.auraTitle}>Brand Aura Analysis</Text>
        <Text style={styles.auraContent}>{data.summary.brandAura}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>I. Deep Psychological Analysis</Text>
        <View style={styles.grid}>
          <View style={styles.col}>
            <Text style={styles.itemTitle}>Color Authority</Text>
            <Text style={styles.textContent}>{data.deepAnalysis.colorPsychology}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.itemTitle}>Structural Harmony</Text>
            <Text style={styles.textContent}>{data.deepAnalysis.structuralHarmony}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>II. Strategic Styling</Text>
        <Text style={styles.itemTitle}>Executive Presence</Text>
        <Text style={[styles.textContent, { marginBottom: 10 }]}>{data.strategicStyling.businessExecutive}</Text>
        <Text style={styles.itemTitle}>Social Influence</Text>
        <Text style={styles.textContent}>{data.strategicStyling.socialInfluence}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>III. Expert Recommendations</Text>
        <View style={styles.grid}>
          <View style={styles.col}>
            <Text style={styles.itemTitle}>Career Accelerator</Text>
            <Text style={styles.textContent}>{data.expertRecommendations.careerAdvice}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.itemTitle}>Relationship Dynamics</Text>
            <Text style={styles.textContent}>{data.expertRecommendations.relationshipTips}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>© 2026 PersonaStyle AI | Executive Branding Division | personastyle.app</Text>
    </Page>

    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>IV. Detailed Capsule Wardrobe</Text>
        {data.detailedCapsuleWardrobe.map((group, index) => (
          <View key={index} style={styles.wardrobeCard}>
            <Text style={styles.wardrobeCategory}>{group.category}</Text>
            <Text style={styles.wardrobeItems}>• {group.items.join('\n• ')}</Text>
            <Text style={[styles.textContent, { fontSize: 8, marginTop: 5 }]}>
              Reasoning: {group.reasoning}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>V. Personal Brand Action Plan</Text>
        <View style={styles.planBox}>
          <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 5 }}>Immediate (Next 24h)</Text>
          <Text style={[styles.textContent, { marginBottom: 10 }]}>{data.actionPlan.immediate}</Text>
          
          <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 5 }}>Short-term (30 Days)</Text>
          <Text style={[styles.textContent, { marginBottom: 10 }]}>{data.actionPlan.shortTerm}</Text>
          
          <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 5 }}>Long-term Vision (1 Year)</Text>
          <Text style={styles.textContent}>{data.actionPlan.longTerm}</Text>
        </View>
      </View>

      <Text style={styles.footer}>This report was generated using Gemini 1.5 Pro advanced reasoning. Page 2 of 2</Text>
    </Page>
  </Document>
);

export default PDFTemplate;
