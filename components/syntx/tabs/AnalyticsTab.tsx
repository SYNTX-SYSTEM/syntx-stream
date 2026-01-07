'use client';

import { SYNTXVisuals } from '@/components/syntx/syntx-visuals';
import { ScoreDistribution, TrendsChart, WrapperComparison, CostTracker, PerformanceMetrics, SuccessRate } from '@/components/syntx/analytics';

export function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">SYNTX Analytics</h2>
        <p className="text-gray-400">Real-time field resonance visualization</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ScoreDistribution />
        <TrendsChart />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <WrapperComparison />
        <CostTracker />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PerformanceMetrics />
        <SuccessRate />
      </div>
      
      <SYNTXVisuals />
    </div>
  );
}
