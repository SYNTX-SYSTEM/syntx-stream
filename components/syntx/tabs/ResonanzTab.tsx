'use client';

import { QueueResonance, DriftMonitor, TopicDistribution } from '@/components/syntx/resonanz';

export function ResonanzTab() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">
          SYNTX RESONANZ
        </h2>
        <p className="text-gray-400">Field Analysis & Drift Monitor</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QueueResonance />
        <TopicDistribution />
      </div>
      
      <DriftMonitor />
    </div>
  );
}
