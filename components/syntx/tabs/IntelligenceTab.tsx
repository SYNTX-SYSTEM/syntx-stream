'use client';

import { ScorePredictor, MissingFieldsAnalysis, KeywordCombinations } from '@/components/syntx/intelligence';

export function IntelligenceTab() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-2">
          SYNTX INTELLIGENCE
        </h2>
        <p className="text-gray-400">Advanced Analytics & Predictions</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScorePredictor />
        <KeywordCombinations />
      </div>
      
      <MissingFieldsAnalysis />
    </div>
  );
}
