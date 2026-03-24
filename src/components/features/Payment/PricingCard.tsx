"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';

interface PricingCardProps {
  onUpgrade: () => void;
  isLoading?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ onUpgrade, isLoading }) => {
  const benefits = [
    'Gemini 1.5 Pro 기반 심층 심리 분석',
    '전문가 수준의 커리어 및 관계 조언',
    '고해상도 A4 PDF 리포트 제공',
    '프리미엄 전용 스타일 가이드',
    '평생 소장 가능한 분석 기록'
  ];

  return (
    <Card className="w-full max-w-md mx-auto border-primary shadow-xl overflow-hidden">
      <div className="bg-primary p-2 text-center text-primary-foreground text-xs font-bold uppercase tracking-widest">
        Most Popular
      </div>
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold">Expert Premium</CardTitle>
        <div className="mt-4 flex items-baseline justify-center gap-1">
          <span className="text-4xl font-extrabold tracking-tight">₩9,900</span>
          <span className="text-muted-foreground">/ 리포트</span>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 py-8">
        <ul className="space-y-3 text-sm">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-center gap-3">
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onUpgrade} 
          disabled={isLoading}
          className="w-full h-12 text-lg rounded-full shadow-lg hover:scale-[1.02] transition-transform"
        >
          {isLoading ? '연결 중...' : '지금 업그레이드 하기'}
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
