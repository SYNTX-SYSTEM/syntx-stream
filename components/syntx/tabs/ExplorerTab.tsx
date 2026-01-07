'use client';

import { PromptExplorer } from '@/components/syntx/explorer';

export function ExplorerTab() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
          SYNTX EXPLORER
        </h2>
        <p className="text-gray-400">Complete Prompt & Response Database • 686 Entries</p>
      </div>
      <PromptExplorer />
    </div>
  );
}
