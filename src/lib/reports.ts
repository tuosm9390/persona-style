import { VisualAnalysisProfile } from "./types";

export function generateVisualReport(profile: VisualAnalysisProfile): string {
  const { face, body, apparel, personalColor } = profile;

  let report = `[Visual Analysis Report]\n\n`;
  report += `1. Face & Skin:\n`;
  report += `- Your face shape is identified as ${face.shape}.\n`;
  report += `- Your skin tone matches Fitzpatrick Scale ${face.fitzpatrick}.\n\n`;

  report += `2. Body & Posture:\n`;
  report += `- You have an ${body.type} body type with a ${body.posture} posture.\n\n`;

  report += `3. Current Styling:\n`;
  report += `- Top: ${apparel.top.color} ${apparel.top.category} (${apparel.top.fit} fit)\n`;
  report += `- Bottom: ${apparel.bottom.color} ${apparel.bottom.category} (${apparel.bottom.fit} fit)\n\n`;

  report += `4. Diagnosis:\n`;
  report += `- Final Personal Color: ${personalColor}\n\n`;

  report += `Based on your ${face.shape} face and ${body.type} body, we recommend...`;

  return report;
}
