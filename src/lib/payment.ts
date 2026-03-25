import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a new payment transaction record
 */
export async function createTransaction(
  supabase: SupabaseClient,
  userId: string,
  merchantUid: string,
  amount: number,
) {
  const { data, error } = await supabase
    .from("payment_transactions")
    .insert({
      user_id: userId,
      merchant_uid: merchantUid,
      amount: amount,
      status: "ready",
    })
    .select()
    .maybeSingle(); // Safe return

  if (error) throw error;
  return data;
}

/**
 * Verifies payment with Portone (Mocked for dev)
 */
export async function verifyPayment(
  supabase: SupabaseClient,
  imp_uid: string,
  merchant_uid: string,
) {
  // In development, we skip actual Portone API call and trust the response
  const isDev = process.env.NODE_ENV === "development";

  // 1. Fetch transaction
  console.log('VerifyPayment: Fetching merchant_uid:', merchant_uid);
  
  const { data: transaction, error } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('merchant_uid', merchant_uid)
    .maybeSingle();

  if (error) {
    console.error('VerifyPayment: DB query error:', error);
    throw error;
  }

  if (!transaction) {
    console.error('VerifyPayment: Not found in DB. RLS issue suspected.');
    // Check if user is seen by server
    const { data: { user } } = await supabase.auth.getUser();
    throw new Error(`주문 번호(${merchant_uid})를 찾을 수 없습니다. (Server User: ${user?.id || 'None'})`);
  }

  // 2. Validate (Mocked for dev)
  console.log('VerifyPayment: Found transaction, updating status...');

  // 3. Update status
  console.log('VerifyPayment: Updating status to paid for ID:', transaction.id);
  const { data: updated, error: updateError } = await supabase
    .from("payment_transactions")
    .update({
      status: "paid",
      imp_uid: imp_uid,
      paid_at: new Date().toISOString(),
    })
    .eq("id", transaction.id)
    .select()
    .maybeSingle();

  if (updateError) {
    console.error('VerifyPayment: Update failed:', updateError);
    throw new Error(`결제 상태 업데이트에 실패했습니다: ${updateError.message}`);
  }

  if (!updated) {
    console.error('VerifyPayment: Update succeeded but no data returned. Check RLS UPDATE policy.');
    throw new Error('결제 정보를 갱신했으나 데이터를 가져올 수 없습니다. RLS UPDATE 정책을 확인해주세요.');
  }

  return updated;
}
