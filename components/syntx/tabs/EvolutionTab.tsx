'use client';

import { SyntxVsNormal } from '@/components/syntx/evolution';

export function EvolutionTab() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
          SYNTX EVOLUTION
        </h2>
        <p className="text-gray-400">SYNTX vs Normal - The Proof</p>
      </div>
      <SyntxVsNormal />
    </div>
  );
}
