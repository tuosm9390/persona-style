"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BookOpen, Briefcase, Users, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { FormattedText } from '@/components/ui/formatted-text';

export default function PremiumReportPage({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      // Supabase 클라이언트를 통해 리포트 조회
      // 여기서는 예시로 로딩 상태만 관리
      setIsLoading(false);
    };
    fetchReport();
  }, [params.id]);

  const handleDownload = () => {
    window.location.href = `/api/premium/pdf/${params.id}`;
  };

  if (isLoading) return <div className="flex justify-center py-20">Loading...</div>;

  return (
    <div className="container max-w-5xl py-12 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            Premium Expert Analysis
          </div>
          <h1 className="text-4xl font-bold">심층 전문가 리포트</h1>
          <p className="text-muted-foreground">당신의 페르소나에 대한 가장 정밀한 인사이트를 확인하세요.</p>
        </div>
        <Button onClick={handleDownload} size="lg" className="rounded-full shadow-lg gap-2">
          <Download className="h-5 w-5" />
          PDF 리포트 다운로드
        </Button>
      </div>

      <div className="grid gap-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="text-primary" />
            1. 커리어 인사이트
          </h2>
          <Card>
            <CardContent className="pt-6">
              <FormattedText text={report?.deep_analysis_json?.career_advice || '데이터를 로드하는 중입니다...'} />
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-primary" />
            2. 대인관계 및 소통 전략
          </h2>
          <Card>
            <CardContent className="pt-6">
              <FormattedText text={report?.deep_analysis_json?.relationship_tips || '데이터를 로드하는 중입니다...'} />
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Palette className="text-primary" />
            3. 프리미엄 스타일 가이드
          </h2>
          <Card>
            <CardContent className="pt-6">
              <FormattedText text={report?.deep_analysis_json?.detailed_styling_guide || '데이터를 로드하는 중입니다...'} />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
