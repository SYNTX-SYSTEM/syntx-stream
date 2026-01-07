'use client';

import { motion } from 'framer-motion';

interface AnimatedStreamProps {
  color?: string;
  quality?: number;
}

export function AnimatedStream({ color = '#06b6d4', quality = 100 }: AnimatedStreamProps) {
  // Farbe basierend auf Quality
  const streamColor = quality >= 90 ? '#10b981' : quality >= 70 ? '#06b6d4' : '#f59e0b';
  
  return (
    <div className="relative flex items-center justify-center min-w-[80px]">
      {/* Base line */}
      <svg className="w-full h-2" viewBox="0 0 80 8" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`streamGradient-${quality}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: streamColor, stopOpacity: 0.2 }} />
            <stop offset="50%" style={{ stopColor: streamColor, stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: streamColor, stopOpacity: 0.2 }} />
          </linearGradient>
        </defs>
        
        {/* Glowing line */}
        <line
          x1="0"
          y1="4"
          x2="80"
          y2="4"
          stroke={`url(#streamGradient-${quality})`}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Flowing particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: streamColor,
            boxShadow: `0 0 8px ${streamColor}`,
          }}
          animate={{
            x: [-40, 40],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'linear',
          }}
        />
      ))}

      {/* Pulse glow */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle, ${streamColor}20 0%, transparent 70%)`,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
    </div>
  );
}
