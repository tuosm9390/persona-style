"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonaDistribution } from '@/types/viral';

interface TrendDashboardProps {
  distributions: PersonaDistribution[];
}

const TrendDashboard: React.FC<TrendDashboardProps> = ({ distributions }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {distributions.map((stat, index) => (
        <Card key={stat.persona_type} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                RANK #{index + 1}
              </span>
              <span className="text-sm text-muted-foreground">{stat.count}명 분석</span>
            </div>
            <CardTitle className="text-xl mt-2">{stat.persona_type}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-primary">{stat.ratio.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${stat.ratio}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TrendDashboard;
