'use client';

import { motion } from 'framer-motion';
import { Cpu, Zap, Brain, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

interface KrunKnotenProps {
  log: {
    timestamp: string;
    cron_data: {
      name: string;
      modell: string;
      felder: Record<string, number>;
    };
    scores: {
      overall: number;
    };
    meta: {
      duration_ms: number;
      success: boolean;
    };
  };
  onClick: () => void;
  index: number;
  position: { x: number; y: number };
}

export function KrunKnoten({ log, onClick, index, position }: KrunKnotenProps) {
  const [energy, setEnergy] = useState<Array<{ id: number; angle: number }>>([]);
  
  const score = log.scores.overall;
  const fieldCount = Object.keys(log.cron_data.felder).length;
  const model = log.cron_data.modell;
  
  const getColor = () => {
    if (model.includes('gpt')) return { main: '#06b6d4', rgb: 'rgba(6,182,212' };
    if (model.includes('mistral')) return { main: '#a855f7', rgb: 'rgba(168,85,247' };
    if (model.includes('claude')) return { main: '#ec4899', rgb: 'rgba(236,72,153' };
    if (score < 50) return { main: '#ef4444', rgb: 'rgba(239,68,68' };
    if (score >= 80) return { main: '#22c55e', rgb: 'rgba(34,197,94' };
    return { main: '#00ffff', rgb: 'rgba(0,255,255' };
  };
  
  const color = getColor();

  const getModelIcon = () => {
    if (model.includes('gpt')) return Zap;
    if (model.includes('mistral')) return Brain;
    if (model.includes('claude')) return Activity;
    return Cpu;
  };
  
  const Icon = getModelIcon();

  useEffect(() => {
    const newEnergy = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      angle: (360 / 8) * i
    }));
    setEnergy(newEnergy);
  }, []);

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: position.x, top: position.y }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 150, delay: index * 0.03 }}
      whileHover={{ scale: 1.2, z: 100 }}
      onClick={onClick}
    >
      {/* Subtle outer glow */}
      <motion.div
        className="absolute -inset-16 opacity-20 blur-2xl"
        style={{ backgroundColor: color.main }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Energy particles - subtle */}
      {energy.map((e) => (
        <motion.div
          key={e.id}
          className="absolute w-1 h-1 rounded-full"
          style={{ 
            backgroundColor: color.main,
            left: '50%',
            top: '50%',
            filter: 'blur(0.5px)'
          }}
          animate={{
            x: Math.cos((e.angle * Math.PI) / 180) * 40,
            y: Math.sin((e.angle * Math.PI) / 180) * 40,
            opacity: [0.2, 0.6, 0.2],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: e.id * 0.4,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Ring system - thinner */}
      <svg width="80" height="80" className="absolute -inset-3">
        {/* Outer ring - very subtle */}
        <motion.circle
          cx="40" cy="40" r="36" fill="none" stroke={color.main} strokeWidth="0.5" opacity="0.2"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50% 50%' }}
        />
        {/* Score ring */}
        <motion.circle
          cx="40" cy="40" r="30" fill="none" stroke={color.main} strokeWidth="2" strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 30}`}
          initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
          animate={{ 
            strokeDashoffset: 2 * Math.PI * 30 * (1 - score / 100),
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            strokeDashoffset: { duration: 1.5, ease: 'easeOut' },
            opacity: { duration: 2, repeat: Infinity }
          }}
          style={{ 
            transform: 'rotate(-90deg)', 
            transformOrigin: '50% 50%',
            filter: `drop-shadow(0 0 4px ${color.main})`
          }}
        />
      </svg>

      {/* Core sphere - darker, subtler */}
      <motion.div 
        className="w-14 h-14 rounded-full flex items-center justify-center relative z-10"
        style={{ 
          background: `radial-gradient(circle at 30% 30%, ${color.rgb},0.4), ${color.rgb},0.15))`,
          border: `1px solid ${color.main}`,
          boxShadow: `
            0 0 20px ${color.rgb},0.3),
            inset 0 0 20px ${color.rgb},0.2)
          `
        }}
        animate={{
          boxShadow: [
            `0 0 20px ${color.rgb},0.3), inset 0 0 20px ${color.rgb},0.2)`,
            `0 0 30px ${color.rgb},0.5), inset 0 0 25px ${color.rgb},0.3)`,
            `0 0 20px ${color.rgb},0.3), inset 0 0 20px ${color.rgb},0.2)`
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 3, -3, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon className="w-6 h-6" style={{ color: color.main, filter: `drop-shadow(0 0 3px ${color.main})` }} />
        </motion.div>
      </motion.div>

      {/* Score badge - subtler */}
      <motion.div
        className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs font-bold font-mono"
        style={{ 
          background: `${color.rgb},0.6)`,
          color: '#fff',
          border: `1px solid ${color.rgb},0.8)`,
          boxShadow: `0 0 10px ${color.rgb},0.4)`
        }}
        animate={{
          y: [0, -2, 0],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {score}%
      </motion.div>
    </motion.div>
  );
}
