'use client';

import { QueueDashboard } from '@/components/syntx/queue-dashboard';
import { QueueStatusCard } from '@/components/syntx/dashboard';

interface DashboardTabProps {
  stats: {
    totalFields: number;
    avgQuality: number;
    categories: number;
    styles: number;
  };
  health: any;
}

export function DashboardTab({ stats, health }: DashboardTabProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">SYNTX Live Dashboard</h2>
        <p className="text-gray-400">Real-time queue monitoring and system health</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <QueueStatusCard />
      </div>
      
      <QueueDashboard />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <div className="text-cyan-400 text-sm font-medium mb-2">Total Fields</div>
          <div className="text-3xl font-bold text-white">{stats.totalFields}</div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <div className="text-green-400 text-sm font-medium mb-2">Avg Quality</div>
          <div className="text-3xl font-bold text-white">{stats.avgQuality.toFixed(1)}</div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <div className="text-purple-400 text-sm font-medium mb-2">System Health</div>
          <div className={`text-3xl font-bold ${health?.status?.includes('ONLINE') || health?.status?.includes('FLIESST') ? 'text-green-400' : 'text-red-400'}`}>
            {health?.status || 'CHECKING'}
          </div>
        </div>
      </div>
    </div>
  );
}
