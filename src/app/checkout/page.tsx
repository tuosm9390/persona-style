"use client";

import React, { useState, Suspense } from 'react';
import PricingCard from '@/components/features/Payment/PricingCard';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    IMP: any;
  }
}

function CheckoutContent() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const analysisId = searchParams.get('analysis_id');

  const handlePayment = async () => {
    if (!analysisId) {
      toast.error('분석 ID가 누락되었습니다.');
      return;
    }

    if (!window.IMP) {
      toast.error('결제 모듈을 로드할 수 없습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    setIsLoading(true);
    const { IMP } = window;
    IMP.init(process.env.NEXT_PUBLIC_PORTONE_STORE_ID); // 가맹점 식별코드

    const merchant_uid = `ORD-${Date.now()}-${analysisId.slice(0, 8)}`;

    IMP.request_pay({
      pg: 'html5_inicis',
      pay_method: 'card',
      merchant_uid,
      name: 'PersonaStyle Premium Report',
      amount: 9900,
    }, async (rsp: any) => {
      if (rsp.success) {
        // 서버 검증 호출
        try {
          const res = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imp_uid: rsp.imp_uid, merchant_uid: rsp.merchant_uid }),
          });
          const data = await res.json();
          
          if (data.success) {
            toast.success('결제가 완료되었습니다! 심층 분석을 시작합니다.');
            // 분석 생성 API 호출 후 리포트 페이지로 이동
            router.push(`/premium/loading?analysis_id=${analysisId}&payment_id=${data.transaction.id}`);
          }
        } catch (err) {
          toast.error('결제 검증 중 오류가 발생했습니다.');
        }
      } else {
        toast.error(`결제 실패: ${rsp.error_msg}`);
      }
      setIsLoading(false);
    });
  };

  return (
    <div className="container py-20 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold font-display tracking-tight">Unlock Your Full Potential</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          단순한 분석을 넘어 전문가의 시선으로 당신의 스타일과 내면을 깊이 있게 파헤칩니다.
        </p>
      </div>
      
      <PricingCard onUpgrade={handlePayment} isLoading={isLoading} />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
