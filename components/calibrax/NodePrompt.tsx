'use client';

import { motion } from 'framer-motion';
import type { CronData } from '@/types/calibrax';

interface NodePromptProps {
  data: CronData;
  timestamp: string;
  onClick?: () => void;
}

export function NodePrompt({ data, timestamp, onClick }: NodePromptProps) {
  const time = new Date(timestamp).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  const fieldCount = Object.keys(data.felder).length;

  return (
    <motion.div
      className="relative bg-gradient-to-br from-purple-900/40 to-purple-950/60 border border-purple-500/30 rounded-xl p-5 min-w-[260px] shadow-xl cursor-pointer group"
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={onClick}
    >
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-purple-600/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Breathing animation for active */}
      <motion.div
        className="absolute inset-0 bg-purple-500/5 rounded-xl"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-purple-400 rounded-full" />
          <span className="text-xs text-purple-300 font-mono font-bold tracking-wider">GPT INPUT</span>
          <span className="ml-auto text-xs text-purple-400 font-mono">{time}</span>
        </div>
        
        {/* Title */}
        <h3 className="text-sm font-semibold text-white mb-3 line-clamp-2">
          {data.name}
        </h3>
        
        {/* Stats */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Model:</span>
            <span className="text-purple-300 font-mono">{data.modell}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Fields:</span>
            <span className="text-purple-300 font-mono font-bold">{fieldCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Prompts:</span>
            <span className="text-purple-300 font-mono font-bold">{data.anzahl}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
