'use client';

import { useEffect, useState } from 'react';
import { useStreamStore } from '@/lib/stores/stream-store';
import { StreamRow } from './StreamRow';
import { InspectorDrawer } from './InspectorDrawer';

export function StreamMap() {
  const { 
    filteredCalibrations, 
    selectedRun, 
    setSelectedRun, 
    fetchCalibrations,
    isLoading,
    error
  } = useStreamStore();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchCalibrations(20);
  }, [fetchCalibrations]);

  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <p className="text-red-400 font-mono">Error: {error}</p>
      </div>
    );
  }

  if (filteredCalibrations.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <p className="text-gray-400 font-mono">No streams</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          CALIBRAX <span className="text-cyan-400">StreamMap</span>
        </h1>
        <p className="text-gray-400 font-mono">
          {filteredCalibrations.length} calibration streams
        </p>
      </div>

      <div className="space-y-4">
        {filteredCalibrations.map((run, index) => (
          <StreamRow
            key={`${run.cron_id}-${index}`}
            run={run}
            index={index}
            onClick={() => setSelectedRun(run)}
          />
        ))}
      </div>

      <InspectorDrawer
        run={selectedRun}
        onClose={() => setSelectedRun(null)}
      />
    </div>
  );
}
