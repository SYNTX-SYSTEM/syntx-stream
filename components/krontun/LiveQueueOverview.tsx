'use client';

import { motion } from 'framer-motion';
import { Activity, Clock, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useKrontunStore } from '@/lib/stores/krontun-store';
import { CursorResonance, FieldBackground } from '@/components/birth-field';
import { CalibrationCard } from './CalibrationCard';
import { FieldAnalysisModal } from './FieldAnalysisModal';
import Image from 'next/image';

export default function LiveQueueOverview() {
  const { stats, crons, loading, loadStats, loadLogs, selectedCron, selectCron } = useKrontunStore();
  const [systemState, setSystemState] = useState<'stable' | 'stress' | 'drift'>('stable');

  useEffect(() => {
    loadStats();
    loadLogs();
    
    const interval = setInterval(() => {
      loadStats();
      loadLogs();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [loadStats, loadLogs]);

  useEffect(() => {
    // System state based on failed ratio
    if (stats.active === 0 && stats.pending === 0) setSystemState('drift');
    else if (stats.failed > 50) setSystemState('stress');
    else setSystemState('stable');
  }, [stats]);

  const statCards = [
    {
      title: 'Active',
      value: stats.active,
      icon: Activity,
      color: 'cyan',
      gradient: 'from-cyan-500 to-blue-500',
      glow: 'shadow-cyan-500/50',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'yellow',
      gradient: 'from-yellow-500 to-orange-500',
      glow: 'shadow-yellow-500/50',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
      glow: 'shadow-green-500/50',
    },
    {
      title: 'Failed',
      value: stats.failed,
      icon: XCircle,
      color: 'red',
      gradient: 'from-red-500 to-rose-500',
      glow: 'shadow-red-500/50',
    },
  ];

  return (
    <div className="relative min-h-screen">
      <CursorResonance />
      <FieldBackground state={systemState} />

      <div className="relative z-10 p-6 space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div 
            className="flex justify-center mb-6"
            animate={{
              filter: [
                'drop-shadow(0 0 20px rgba(0,255,255,0.5))',
                'drop-shadow(0 0 40px rgba(0,255,255,1))',
                'drop-shadow(0 0 20px rgba(0,255,255,0.5))'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Image 
              src="/Logo1.png" 
              alt="SYNTX Logo" 
              width={120} 
              height={120}
              className="object-contain"
            />
          </motion.div>

          <motion.h1 
            className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent mb-4"
            animate={{
              backgroundPosition: ['0%', '100%', '0%']
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: '200% auto',
              textShadow: '0 0 40px rgba(0,255,255,0.5)'
            }}
          >
            KRONTUN
          </motion.h1>
          <motion.p 
            className="text-cyan-400 text-lg font-mono"
            animate={{
              opacity: [0.7, 1, 0.7],
              textShadow: [
                '0 0 10px rgba(0,255,255,0.5)',
                '0 0 20px rgba(0,255,255,1)',
                '0 0 10px rgba(0,255,255,0.5)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            Real-time AI Calibration Field
          </motion.p>

          {loading && (
            <motion.div 
              className="mt-4 flex items-center justify-center gap-2 text-cyan-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-sm font-semibold font-mono">SYNCING...</span>
            </motion.div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            const isActive = card.title === 'Active' && card.value > 0;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative rounded-2xl border-2 border-cyan-400/30 bg-black/60 backdrop-blur-xl overflow-hidden group cursor-pointer p-6"
              >
                {/* Animated gradient background */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-20`}
                  animate={{ opacity: isActive ? [0.1, 0.2, 0.1] : 0 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Icon */}
                <div className="relative z-10 flex items-center justify-between mb-4">
                  <Icon className="w-8 h-8 text-cyan-400" />
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    {card.title}
                  </span>
                </div>

                {/* Value */}
                <motion.div 
                  className="relative z-10 text-5xl font-black text-white font-mono"
                  animate={isActive ? {
                    textShadow: [
                      '0 0 10px rgba(0,255,255,0.5)',
                      '0 0 30px rgba(0,255,255,1)',
                      '0 0 10px rgba(0,255,255,0.5)'
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {card.value}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Connection lines between stats */}
        <svg className="absolute top-40 left-0 w-full h-32 pointer-events-none opacity-30 z-0">
          {statCards.map((_, i) => {
            if (i === statCards.length - 1) return null;
            return (
              <motion.line
                key={i}
                x1={`${25 * i + 12.5}%`}
                y1="50%"
                x2={`${25 * (i + 1) + 12.5}%`}
                y2="50%"
                stroke="rgba(0,255,255,0.5)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: i * 0.2 }}
              />
            );
          })}
        </svg>

        {/* Calibration Runs */}
        <div>
          <h2 className="text-3xl font-black text-cyan-400 mb-6">Recent Calibration Runs</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {crons.slice(0, 12).map((cron, index) => (
              <CalibrationCard
                key={`${cron.timestamp}-${index}`}
                log={cron}
                onClick={() => selectCron(cron)}
                index={index}
              />
            ))}
          </div>

          {crons.length === 0 && !loading && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-2xl font-bold text-slate-600 mb-2">No Calibration Runs</p>
              <p className="text-sm text-slate-500">Waiting for system activity...</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <FieldAnalysisModal 
        log={selectedCron} 
        onClose={() => selectCron(null)} 
      />
    </div>
  );
}
