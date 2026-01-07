'use client';

import { motion } from 'framer-motion';
import { mapDriftColor } from '@/lib/calibrax/mapDriftColor';

interface DriftLinkProps {
  drift: number;
  quality: number;
  onClick?: () => void;
}

export function DriftLink({ drift, quality, onClick }: DriftLinkProps) {
  const { color, glow, label } = mapDriftColor(drift);

  return (
    <motion.div
      className="relative flex items-center justify-center min-w-[200px] cursor-pointer"
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
    >
      {/* Animated line */}
      <svg className="w-full h-2" viewBox="0 0 200 8">
        <defs>
          <linearGradient id="driftGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 0.5 }} />
            <stop offset="50%" style={{ stopColor: color, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.5 }} />
          </linearGradient>
        </defs>
        <line
          x1="0"
          y1="4"
          x2="200"
          y2="4"
          stroke="url(#driftGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Flow particles */}
        <motion.circle
          cx="0"
          cy="4"
          r="2"
          fill={color}
          animate={{ cx: [0, 200] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ filter: `drop-shadow(0 0 4px ${glow})` }}
        />
      </svg>

      {/* Drift badge */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-xs font-mono bg-gray-900 border"
        style={{ borderColor: color, boxShadow: `0 0 10px ${glow}` }}
      >
        <span className="font-bold" style={{ color }}>D: {(drift * 100).toFixed(1)}%</span>
      </div>
    </motion.div>
  );
}
