"use client";

import React, { useEffect, useState } from 'react';
import TrendDashboard from '@/components/features/Trend';
import { BarChart3, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PersonaDistribution } from '@/types/viral';

interface TrendStats {
  distributions: PersonaDistribution[];
  last_updated: string;
}

export default function TrendPage() {
  const [stats, setStats] = useState<TrendStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async (refresh = false) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/trend${refresh ? '?refresh=true' : ''}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="container py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <BarChart3 className="text-primary" />
            Persona Trends
          </h1>
          <p className="text-muted-foreground">
            현재 전 세계에서 가장 유행하는 페르소나 스타일 실시간 집계
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => fetchStats(true)} 
          disabled={isLoading}
          className="rounded-full"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          데이터 갱신
        </Button>
      </div>

      {isLoading && !stats ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <TrendDashboard distributions={stats?.distributions || []} />
      )}

      {stats && (
        <p className="text-center text-xs text-muted-foreground">
          마지막 업데이트: {new Date(stats.last_updated).toLocaleString()}
        </p>
      )}
    </div>
  );
}
