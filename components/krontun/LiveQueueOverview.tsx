'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface QueueStats {
  active: number;
  pending: number;
  completed: number;
  failed: number;
}

export function LiveQueueOverview() {
  const [stats, setStats] = useState<QueueStats>({
    active: 0,
    pending: 0,
    completed: 0,
    failed: 0
  });

  useEffect(() => {
    // Initial load
    loadStats();
    
    // Polling every 5s (WebSocket später)
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('https://dev.syntx-system.com/api/strom/kalibrierung/cron/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load cron stats:', error);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-6 p-4 bg-slate-950 rounded-xl border border-cyan-500/10">
      <StatusCard
        icon="⚡"
        label="AKTIV"
        count={stats.active}
        color="cyan"
      />
      <StatusCard
        icon="⏳"
        label="PENDING"
        count={stats.pending}
        color="yellow"
      />
      <StatusCard
        icon="✅"
        label="DONE"
        count={stats.completed}
        color="green"
      />
      <StatusCard
        icon="❌"
        label="ERROR"
        count={stats.failed}
        color="red"
      />
    </div>
  );
}

interface StatusCardProps {
  icon: string;
  label: string;
  count: number;
  color: 'cyan' | 'yellow' | 'green' | 'red';
}

function StatusCard({ icon, label, count, color }: StatusCardProps) {
  const colorClasses = {
    cyan: 'border-cyan-500 text-cyan-400',
    yellow: 'border-yellow-500 text-yellow-400',
    green: 'border-green-500 text-green-400',
    red: 'border-red-500 text-red-400'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`bg-slate-900 p-6 rounded-xl shadow-inner border-t-4 ${colorClasses[color].split(' ')[0]} relative overflow-hidden`}
    >
      {/* Animated Background Glow */}
      <motion.div
        className={`absolute inset-0 opacity-10`}
        animate={{
          background: [
            `radial-gradient(circle at 50% 50%, ${color === 'cyan' ? '#06b6d4' : color === 'yellow' ? '#eab308' : color === 'green' ? '#10b981' : '#ef4444'} 0%, transparent 70%)`,
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="relative z-10">
        <motion.div 
          className="text-5xl mb-3"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {icon}
        </motion.div>
        
        <motion.div
          className={`text-4xl font-bold my-2 ${colorClasses[color].split(' ')[1]}`}
          animate={{ 
            scale: [1, 1.05, 1],
            textShadow: [
              '0 0 10px rgba(6, 182, 212, 0.5)',
              '0 0 20px rgba(6, 182, 212, 1)',
              '0 0 10px rgba(6, 182, 212, 0.5)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {count}
        </motion.div>
        
        <div className="text-gray-400 text-sm tracking-wide uppercase font-bold">
          {label}
        </div>
      </div>
    </motion.div>
  );
}
