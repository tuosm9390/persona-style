import { SupabaseClient } from '@supabase/supabase-js';

export async function verifyPayment(
  supabase: SupabaseClient,
  imp_uid: string,
  merchant_uid: string
) {
  // 1. Portone API를 통한 결제 정보 조회 (실제 구현 시 토큰 발급 및 API 호출 필요)
  // 여기서는 간단한 목업 로직으로 흐름 정의
  const paymentData = {
    status: 'paid',
    amount: 9900, // 예시 금액
  };

  // 2. DB에서 트랜잭션 조회 및 금액 대조
  const { data: transaction, error } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('merchant_uid', merchant_uid)
    .single();

  if (error || !transaction) {
    throw new Error('Transaction not found');
  }

  if (paymentData.amount !== transaction.amount) {
    throw new Error('Amount mismatch');
  }

  // 3. 결제 상태 업데이트
  const { data: updated, error: updateError } = await supabase
    .from('payment_transactions')
    .update({
      status: 'paid',
      imp_uid: imp_uid,
      paid_at: new Date().toISOString(),
    })
    .eq('id', transaction.id)
    .select()
    .single();

  if (updateError) throw updateError;

  return updated;
}
