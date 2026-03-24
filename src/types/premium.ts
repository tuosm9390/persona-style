export type PaymentStatus = 'ready' | 'paid' | 'cancelled' | 'failed';

export interface PremiumReport {
  id: string;
  analysis_id: string;
  user_id: string;
  deep_analysis_json: any;
  pdf_url?: string;
  payment_id: string;
  created_at: string;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  imp_uid?: string;
  merchant_uid: string;
  amount: number;
  status: PaymentStatus;
  paid_at?: string;
  created_at: string;
}

export interface DeepAnalysisResult {
  career_advice: string;
  relationship_tips: string;
  detailed_styling_guide: string;
  overall_summary: string;
}
