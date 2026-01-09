'use client';

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface SystemCoreProps {
  system_zustand: string;
  queue_incoming: number;
  status: string;
}

export function SystemCore({ system_zustand, queue_incoming, status }: SystemCoreProps) {
  const isCritical = system_zustand === 'KRITISCH';
  const pulseDuration = Math.max(1, 3 - (queue_incoming * 0.02));
  const glowIntensity = Math.min(60, 20 + (queue_incoming * 0.5));
  
  return (
    <div className="flex items-center justify-center relative">
      {/* Rotating Hexagon Rings */}
      <motion.div
        className="absolute w-80 h-80"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className={`absolute inset-0 border-2 ${isCritical ? 'border-red-500/30' : 'border-cyan-500/30'}`}
             style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)' }} />
      </motion.div>
      
      <motion.div
        className="absolute w-72 h-72"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <div className={`absolute inset-0 border ${isCritical ? 'border-red-500/20' : 'border-cyan-500/20'}`}
             style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)' }} />
      </motion.div>
      
      {/* Particle System */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${isCritical ? 'bg-red-500' : 'bg-cyan-400'}`}
          animate={{
            x: [0, Math.cos(i * 30 * Math.PI / 180) * 150],
            y: [0, Math.sin(i * 30 * Math.PI / 180) * 150],
            opacity: [1, 0],
            scale: [1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
      
      {/* Main Core */}
      <div className="relative z-10">
        <motion.div
          className={`relative w-64 h-64 rounded-full border-4 ${
            isCritical ? 'border-red-500' : 'border-cyan-500'
          } bg-black/90 backdrop-blur-xl flex items-center justify-center overflow-hidden`}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: pulseDuration,
            repeat: Infinity,
          }}
          style={{
            boxShadow: `0 0 ${glowIntensity}px ${isCritical ? 'rgba(239, 68, 68, 0.8)' : 'rgba(6, 182, 212, 0.8)'}`
          }}
        >
          {/* Scan Lines */}
          <motion.div
            className={`absolute inset-0 ${isCritical ? 'bg-gradient-to-b from-red-500/10 via-transparent to-transparent' : 'bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent'}`}
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          
          {/* EKG Line */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 200">
            <motion.path
              d="M0,100 L40,100 L50,80 L60,120 L70,100 L200,100"
              stroke={isCritical ? '#ef4444' : '#06b6d4'}
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
          
          <div className="text-center relative z-10">
            <Activity className={`w-16 h-16 mx-auto mb-4 ${isCritical ? 'text-red-500' : 'text-cyan-400'}`} />
            <div className={`text-2xl font-bold ${isCritical ? 'text-red-400' : 'text-cyan-400'}`}>
              {system_zustand}
            </div>
            <div className="text-sm text-gray-400 mt-2">{status}</div>
            <div className="text-xs text-gray-500 mt-1">Queue: {queue_incoming}</div>
          </div>
        </motion.div>
        
        <motion.div
          className={`absolute inset-0 rounded-full ${
            isCritical ? 'bg-red-500/20' : 'bg-cyan-500/20'
          } blur-3xl`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: pulseDuration,
            repeat: Infinity,
          }}
        />
      </div>
    </div>
  );
}
