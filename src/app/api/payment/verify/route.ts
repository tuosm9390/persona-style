import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { verifyPayment } from "@/lib/payment";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const body = await req.json();
  const { imp_uid, merchant_uid } = body;

  console.log("Payment verify API called:", {
    hasSession: !!session,
    userId: session?.user?.id,
    merchant_uid,
  });

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized - No session found" },
      { status: 401 },
    );
  }

  try {
    const updatedTransaction = await verifyPayment(
      supabase,
      imp_uid,
      merchant_uid,
    );
    return NextResponse.json({
      success: true,
      transaction: updatedTransaction,
    });
  } catch (error: unknown) {
    console.error("Payment verification logic failed:", error);
    const message = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
