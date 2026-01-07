'use client';

import { mapDriftColor } from '@/lib/calibrax/mapDriftColor';

interface ScoreTagProps {
  quality: number;
  drift: number;
  status: 'completed' | 'failed' | 'running';
  compact?: boolean;
}

export function ScoreTag({ quality, drift, status, compact = false }: ScoreTagProps) {
  const driftColor = mapDriftColor(drift);
  const driftPercent = (drift * 100).toFixed(1);

  return (
    <div className="flex items-center gap-2">
      {/* Quality Score */}
      <div
        className="px-3 py-1 rounded-lg text-sm font-mono"
        style={{
          background: quality >= 90 
            ? 'rgba(0, 255, 136, 0.2)' 
            : quality >= 70 
            ? 'rgba(255, 215, 0, 0.2)' 
            : 'rgba(255, 0, 85, 0.2)',
          borderLeft: `3px solid ${quality >= 90 ? '#00FF88' : quality >= 70 ? '#FFD700' : '#FF0055'}`
        }}
      >
        <span className="text-gray-400">Q:</span>
        <span className="ml-1 font-bold">{quality}</span>
      </div>

      {/* Drift Score */}
      <div
        className="px-3 py-1 rounded-lg text-sm font-mono relative overflow-hidden"
        style={{
          background: `${driftColor.color}20`,
          borderLeft: `3px solid ${driftColor.color}`,
          boxShadow: `0 0 ${driftColor.glow * 10}px ${driftColor.color}40`
        }}
      >
        <span className="text-gray-400">D:</span>
        <span className="ml-1 font-bold">{driftPercent}%</span>
        {!compact && (
          <span className="ml-2 text-xs opacity-70">{driftColor.label}</span>
        )}
      </div>

      {/* Status Indicator */}
      <div
        className={`w-2 h-2 rounded-full ${
          status === 'completed' 
            ? 'bg-green-400' 
            : status === 'failed' 
            ? 'bg-red-400 animate-pulse' 
            : 'bg-yellow-400 animate-pulse'
        }`}
        title={status}
      />
    </div>
  );
}
