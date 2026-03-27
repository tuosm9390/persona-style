"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Matcher from '@/components/features/Matcher';
import { toast } from 'sonner';

interface MatchResult {
  score: number;
  analysis_text: string;
}

export default function MatchPage() {
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [result, setResult] = useState<MatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMatch = async () => {
    if (!sourceId || !targetId) {
      toast.error('두 명의 분석 ID를 모두 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_id: sourceId, target_id: targetId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setResult(data);
      toast.success('궁합 분석이 완료되었습니다!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '매칭 분석에 실패했습니다.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Persona Matching</h1>
        <p className="text-muted-foreground">서로의 페르소나를 비교하고 궁합 점수를 확인해보세요.</p>
      </div>

      {!result ? (
        <div className="grid gap-6 p-8 rounded-2xl bg-muted/30 border border-border max-w-xl mx-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">나의 분석 ID</label>
            <Input 
              value={sourceId} 
              onChange={(e) => setSourceId(e.target.value)} 
              placeholder="UUID 형식의 ID를 입력하세요"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">상대방의 분석 ID</label>
            <Input 
              value={targetId} 
              onChange={(e) => setTargetId(e.target.value)} 
              placeholder="UUID 형식의 ID를 입력하세요"
            />
          </div>
          <Button 
            onClick={handleMatch} 
            disabled={isLoading}
            className="w-full h-12 text-lg rounded-full"
          >
            {isLoading ? '분석 중...' : '궁합 확인하기'}
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          <Matcher score={result.score} analysisText={result.analysis_text} />
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => setResult(null)} className="rounded-full">
              다시 하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
