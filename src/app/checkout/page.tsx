"use client";

import React, { useState, Suspense } from "react";
import PricingCard from "@/features/premium/components/PricingCard";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";

interface PortoneResponse {
  success: boolean;
  imp_uid: string;
  merchant_uid: string;
  error_msg?: string;
}

interface PortoneRequest {
  pg: string;
  pay_method: string;
  merchant_uid: string;
  name: string;
  amount: number;
}

declare global {
  interface Window {
    IMP: {
      init: (id: string | undefined) => void;
      request_pay: (
        request: PortoneRequest,
        callback: (response: PortoneResponse) => void,
      ) => void;
    };
  }
}

function CheckoutContent() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const analysisId = searchParams.get("analysis_id");
  const supabase = React.useMemo(() => createClient(), []);

  const handleTestPayment = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    const currentAnalysisId = analysisId || "temp_analysis";

    setIsLoading(true);
    try {
      const merchant_uid = `TEST-${Date.now()}-${currentAnalysisId.slice(0, 8)}`;

      console.log("Test payment sequence started:", {
        userId: user.id,
        merchant_uid,
        analysisId: currentAnalysisId,
      });

      // 1. Create transaction in DB
      const { data: tx, error: txError } = await supabase
        .from("payment_transactions")
        .insert({
          user_id: user.id,
          merchant_uid,
          amount: 9900,
          status: "ready",
        })
        .select()
        .single();

      if (txError) {
        console.error("Transaction creation failed:", txError);
        throw new Error(`DB 저장 실패: ${txError.message}`);
      }

      console.log("Transaction created successfully:", tx);

      // 2. Verify (Mock)
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imp_uid: "mock_uid_" + Date.now(),
          merchant_uid,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.transaction) {
        toast.success("테스트 결제가 완료되었습니다!");
        router.push(
          `/premium/loading?analysis_id=${analysisId}&payment_id=${data.transaction.id}`,
        );
      } else {
        throw new Error(data.error || "결제 정보를 확인할 수 없습니다.");
      }
    } catch (err: unknown) {
      console.error("Test payment error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "테스트 결제 중 오류가 발생했습니다.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!analysisId || !user) {
      toast.error("로그인이 필요하거나 분석 ID가 누락되었습니다.");
      return;
    }

    if (!window.IMP) {
      toast.error(
        "결제 모듈을 로드할 수 없습니다. 잠시 후 다시 시도해 주세요.",
      );
      return;
    }

    setIsLoading(true);
    const { IMP } = window;
    IMP.init(process.env.NEXT_PUBLIC_PORTONE_STORE_ID);

    const merchant_uid = `ORD-${Date.now()}-${analysisId.slice(0, 8)}`;

    try {
      // 1. Create initial record in DB
      const { error: txError } = await supabase
        .from("payment_transactions")
        .insert({
          user_id: user.id,
          merchant_uid,
          amount: 9900,
          status: "ready",
        })
        .select()
        .single();

      if (txError) throw txError;

      // 2. Request real payment
      IMP.request_pay(
        {
          pg: "html5_inicis",
          pay_method: "card",
          merchant_uid,
          name: "PersonaStyle Premium Report",
          amount: 9900,
        },
        async (rsp: PortoneResponse) => {
          if (rsp.success) {
            try {
              const res = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  imp_uid: rsp.imp_uid,
                  merchant_uid: rsp.merchant_uid,
                }),
              });
              const data = await res.json();

              if (data.success) {
                toast.success("결제가 완료되었습니다! 심층 분석을 시작합니다.");
                router.push(
                  `/premium/loading?analysis_id=${analysisId}&payment_id=${data.transaction.id}`,
                );
              } else {
                toast.error(`검증 실패: ${data.error}`);
              }
            } catch {
              toast.error("결제 검증 중 오류가 발생했습니다.");
            }
          } else {
            toast.error(`결제 실패: ${rsp.error_msg}`);
          }
          setIsLoading(false);
        },
      );
    } catch (err: unknown) {
      console.error("Payment initialization failed:", err);
      const message =
        err instanceof Error ? err.message : "오류가 발생했습니다.";
      toast.error(`결제 준비 중 오류: ${message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-20 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-primary">
          Unlock Your Full Potential
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
          단순한 분석을 넘어 전문가의 시선으로 당신의 스타일과 내면을 깊이 있게
          파헤칩니다.
        </p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <PricingCard onUpgrade={handlePayment} isLoading={isLoading} />

        {/* Dev Only Button */}
        <Button
          variant="ghost"
          onClick={handleTestPayment}
          disabled={isLoading}
          className="text-muted-foreground text-xs underline"
        >
          [개발자 전용] 결제 없이 테스트하기
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">Loading checkout...</div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
