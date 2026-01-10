'use client';

import { motion } from 'framer-motion';
import { Zap, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface CalibrationCardProps {
  log: {
    timestamp: string;
    cron_data: {
      name: string;
      modell: string;
      felder: Record<string, number>;
    };
    scores: {
      overall: number;
      field_completeness: number;
      structure_adherence: number;
    };
    meta: {
      duration_ms: number;
      success: boolean;
    };
  };
  onClick: () => void;
  index: number;
}

export function CalibrationCard({ log, onClick, index }: CalibrationCardProps) {
  const score = log.scores.overall;
  const duration = (log.meta.duration_ms / 1000).toFixed(1);
  
  // Color based on score
  const getScoreColor = () => {
    if (score >= 80) return { 
      border: 'border-green-400/50', 
      glow: '0 0 20px rgba(34,197,94,0.4)', 
      text: 'text-green-400',
      rgb: 'rgba(34,197,94,0.4)'
    };
    if (score >= 50) return { 
      border: 'border-yellow-400/50', 
      glow: '0 0 20px rgba(250,204,21,0.4)', 
      text: 'text-yellow-400',
      rgb: 'rgba(250,204,21,0.4)'
    };
    return { 
      border: 'border-red-400/50', 
      glow: '0 0 20px rgba(239,68,68,0.4)', 
      text: 'text-red-400',
      rgb: 'rgba(239,68,68,0.4)'
    };
  };
  
  const colors = getScoreColor();
  const fieldCount = Object.keys(log.cron_data.felder).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: Math.sin(index * 0.5) * 5  // Wave effect
      }}
      transition={{
        delay: index * 0.05,
        y: {
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      }}
      whileHover={{ scale: 1.03, y: -5 }}
      onClick={onClick}
      className={`relative bg-black/60 backdrop-blur-md rounded-2xl p-6 cursor-pointer border-2 ${colors.border} overflow-hidden group`}
      style={{ boxShadow: colors.glow }}
    >
      {/* Rotating border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-30"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${colors.rgb}, transparent)`
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Success indicator */}
      <div className="absolute top-4 right-4">
        {log.meta.success ? (
          <CheckCircle2 className="w-5 h-5 text-green-400" />
        ) : (
          <XCircle className="w-5 h-5 text-red-400" />
        )}
      </div>

      {/* Name */}
      <motion.h3 
        className="text-xl font-black text-white mb-2 pr-8"
        whileHover={{ textShadow: '0 0 15px rgba(0,255,255,0.8)' }}
      >
        {log.cron_data.name}
      </motion.h3>

      {/* Model + Time */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
        <span className="font-mono text-cyan-400">{log.cron_data.modell}</span>
        <span>•</span>
        <Clock className="w-3 h-3" />
        <span>{duration}s</span>
      </div>

      {/* Score */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-500 uppercase">Score</span>
          <motion.span 
            className={`text-2xl font-black font-mono ${colors.text}`}
            animate={{
              textShadow: [
                `0 0 5px ${colors.glow}`,
                `0 0 15px ${colors.glow}`,
                `0 0 5px ${colors.glow}`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {score}
          </motion.span>
        </div>
        <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Fields count */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Zap className="w-3 h-3" />
        <span>{fieldCount} fields analyzed</span>
      </div>

      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 60px ${colors.rgb}` }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
