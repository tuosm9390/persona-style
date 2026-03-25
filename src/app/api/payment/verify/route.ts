import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { verifyPayment } from '@/lib/payment';

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { imp_uid, merchant_uid } = await req.json();

  try {
    const updatedTransaction = await verifyPayment(supabase, imp_uid, merchant_uid);
    return NextResponse.json({ success: true, transaction: updatedTransaction });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
