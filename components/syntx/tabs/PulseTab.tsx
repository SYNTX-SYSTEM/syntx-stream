'use client';

import { HealthHeartbeat, LiveQueueMonitor } from '@/components/syntx/pulse';

export function PulseTab() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-2">
          SYNTX PULSE
        </h2>
        <p className="text-gray-400">System Heartbeat & Live Queue Monitor</p>
      </div>
      <HealthHeartbeat />
      <LiveQueueMonitor />
    </div>
  );
}
