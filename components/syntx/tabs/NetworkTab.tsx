'use client';

import { SYNTXNetwork } from '@/components/syntx/syntx-network';

export function NetworkTab() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">SYNTX Network Matrix</h2>
        <p className="text-gray-400">Interactive field resonance visualization</p>
      </div>
      <SYNTXNetwork />
    </div>
  );
}
