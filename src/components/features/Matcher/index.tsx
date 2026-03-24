"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormattedText } from '@/components/ui/formatted-text';
import { Heart } from 'lucide-react';

interface MatcherProps {
  score: number;
  analysisText: string;
}

const Matcher: React.FC<MatcherProps> = ({ score, analysisText }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
          <Heart className="text-red-500 fill-current" />
          Persona Chemistry Result
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center w-40 h-40 rounded-full border-8 border-primary/10">
            <span className="text-5xl font-bold text-primary">{score}</span>
            <span className="text-sm font-medium text-muted-foreground absolute bottom-8">SCORE</span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-background shadow-inner border border-border">
          <FormattedText text={analysisText} className="text-lg leading-relaxed" />
        </div>
      </CardContent>
    </Card>
  );
};

export default Matcher;
