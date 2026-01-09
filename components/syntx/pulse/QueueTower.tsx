'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Loader, CheckCircle, AlertTriangle } from 'lucide-react';

interface QueueTowerProps {
  incoming: number;
  processing: number;
  processed: number;
  errors: number;
}

export function QueueTower({ incoming, processing, processed, errors }: QueueTowerProps) {
  const total = incoming + processing + processed + errors;
  const hasStress = incoming > 50;
  const scanlineSpeed = hasStress ? 1 : 2;
  
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-cyan-400 font-mono tracking-wider">LIVE QUEUE TOWER</h3>
        <p className="text-xs text-gray-500">Real-time Processing Pipeline</p>
      </div>
      
      <div className="relative space-y-3">
        {/* Binary Rain Background */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xs font-mono text-cyan-500"
              style={{ left: `${i * 20}%` }}
              animate={{ y: ['-100%', '100%'] }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              {Array.from({ length: 30 }).map((_, j) => (
                <div key={j}>{Math.random() > 0.5 ? '1' : '0'}</div>
              ))}
            </motion.div>
          ))}
        </div>
        
        {hasStress && (
          <motion.div
            className="absolute inset-0 bg-cyan-500/5 rounded-lg"
            animate={{
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
        )}
        
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
          animate={{
            top: ['0%', '100%']
          }}
          transition={{
            duration: scanlineSpeed,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        
        <QueueBar
          icon={<ArrowDown className="w-5 h-5" />}
          label="INCOMING"
          value={incoming}
          color="cyan"
          maxValue={100}
        />
        
        <QueueBar
          icon={<Loader className="w-5 h-5 animate-spin" />}
          label="PROCESSING"
          value={processing}
          color="blue"
          maxValue={100}
        />
        
        <QueueBar
          icon={<CheckCircle className="w-5 h-5" />}
          label="PROCESSED"
          value={processed}
          color="green"
          maxValue={500}
        />
        
        <QueueBar
          icon={<AlertTriangle className="w-5 h-5" />}
          label="ERRORS"
          value={errors}
          color="red"
          maxValue={50}
        />
      </div>
    </div>
  );
}

function QueueBar({ icon, label, value, color, maxValue }: any) {
  const colors = {
    cyan: { gradient: 'from-cyan-600 to-cyan-400', text: 'text-cyan-400', glow: 'shadow-cyan-500/50' },
    blue: { gradient: 'from-blue-600 to-blue-400', text: 'text-blue-400', glow: 'shadow-blue-500/50' },
    green: { gradient: 'from-green-600 to-green-400', text: 'text-green-400', glow: 'shadow-green-500/50' },
    red: { gradient: 'from-red-600 to-red-400', text: 'text-red-400', glow: 'shadow-red-500/50' }
  };
  
  const c = colors[color as keyof typeof colors];
  const percent = Math.min(100, (value / maxValue) * 100);
  
  return (
    <motion.div 
      className="relative bg-black/60 border border-gray-800 rounded-lg p-4 overflow-hidden group"
      whileHover={{ scale: 1.02, boxShadow: `0 0 20px ${c.glow}` }}
    >
      {/* Neon Glow Edge */}
      <div className={`absolute inset-0 border-2 border-transparent group-hover:border-${color}-500/50 rounded-lg transition-all duration-300`} />
      
      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className="flex items-center space-x-2">
          <div className={c.text}>
            {icon}
          </div>
          <span className="text-sm font-bold text-gray-400 font-mono">{label}</span>
        </div>
        <span className={`text-2xl font-black ${c.text} font-mono tabular-nums`}>
          {value}
        </span>
      </div>
      
      <div className="relative h-2 bg-gray-900 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${c.gradient} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
