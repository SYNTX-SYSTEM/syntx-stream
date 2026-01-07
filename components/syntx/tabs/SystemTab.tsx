'use client';

import { CompleteDashboardView, SuccessByWrapper, TopicsDeepAnalytics, GenerationProgress, FeldPrompts, PromptsTableView } from '@/components/syntx/analytics';

export function SystemTab() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
          SYNTX SYSTEM
        </h2>
        <p className="text-gray-400">Complete API Coverage • All Endpoints</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompleteDashboardView />
        <SuccessByWrapper />
      </div>
      
      <TopicsDeepAnalytics />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenerationProgress />
        <FeldPrompts />
      </div>
      
      <PromptsTableView />
    </div>
  );
}
