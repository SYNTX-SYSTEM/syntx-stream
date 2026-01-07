'use client';

import { motion } from 'framer-motion';
import { Activity, Clock, CheckCircle2, XCircle, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useKrontunStore } from '@/lib/stores/krontun-store';

export default function LiveQueueOverview() {
  const { stats, crons, loading, loadStats, loadLogs, selectCron } = useKrontunStore();
  const [pulse, setPulse] = useState(false);

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
    const pulseInterval = setInterval(() => {
      setPulse(p => !p);
    }, 2000);
    return () => clearInterval(pulseInterval);
  }, []);

  const cards = [
    {
      title: 'Active',
      value: stats.active,
      icon: Activity,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/50',
      bgGlow: 'bg-blue-500/10',
      ring: 'ring-blue-500/20',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'yellow',
      gradient: 'from-yellow-500 to-orange-500',
      glow: 'shadow-yellow-500/50',
      bgGlow: 'bg-yellow-500/10',
      ring: 'ring-yellow-500/20',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
      glow: 'shadow-green-500/50',
      bgGlow: 'bg-green-500/10',
      ring: 'ring-green-500/20',
    },
    {
      title: 'Failed',
      value: stats.failed,
      icon: XCircle,
      color: 'red',
      gradient: 'from-red-500 to-rose-500',
      glow: 'shadow-red-500/50',
      bgGlow: 'bg-red-500/10',
      ring: 'ring-red-500/20',
    },
  ];

  return (
    <div className="space-y-8 relative">
      {/* NEURAL NETWORK BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent"
            style={{ left: `${i * 10}%` }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3 + i * 0.2, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      {/* HEADER */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <motion.h2 
            className="text-4xl font-black text-white mb-2 flex items-center gap-3"
            animate={{ scale: pulse ? 1.02 : 1 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-10 h-10 text-cyan-400" />
            </motion.div>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              KRONTUN LIVE QUEUE
            </span>
          </motion.h2>
          <p className="text-slate-400 flex items-center gap-2">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⚡
            </motion.span>
            Real-time cron execution monitoring
          </p>
        </div>
        {loading && (
          <motion.div 
            className="flex items-center gap-2 text-cyan-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-sm font-semibold">SYNCING...</span>
          </motion.div>
        )}
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const isActive = card.title === 'Active' && card.value > 0;

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`relative rounded-2xl border-2 ${card.ring} ring-2 ${card.bgGlow} backdrop-blur-xl overflow-hidden group cursor-pointer`}
            >
              {/* ANIMATED GRADIENT BACKGROUND */}
              <motion.div 
                className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-20`}
                animate={{ opacity: isActive ? [0.1, 0.2, 0.1] : 0 }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* SCAN LINE EFFECT */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-20"
                animate={{ y: ['-100%', '300%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className={`p-4 rounded-xl bg-gradient-to-br ${card.gradient} ${card.glow} shadow-2xl`}
                    animate={{ 
                      rotate: isActive ? [0, 5, -5, 0] : 0,
                      scale: isActive ? [1, 1.1, 1] : 1
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>
                  {isActive && (
                    <div className="flex items-center gap-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-blue-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">{card.title}</p>
                  <motion.p 
                    className="text-5xl font-black text-white"
                    animate={{ scale: pulse && card.value > 0 ? 1.05 : 1 }}
                  >
                    {card.value}
                  </motion.p>
                </div>

                {/* CORNER ACCENT */}
                <motion.div
                  className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${card.gradient} opacity-10`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* RECENT EXECUTIONS */}
      <div className="mt-8 relative z-10">
        <motion.h3 
          className="text-2xl font-bold text-white mb-4 flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          Recent Executions
        </motion.h3>
        <div className="space-y-3">
          {crons.length === 0 ? (
            <motion.div 
              className="text-center py-16 text-slate-400 bg-slate-800/30 rounded-2xl border border-cyan-500/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No cron executions yet</p>
              <p className="text-sm mt-2">Waiting for first execution...</p>
            </motion.div>
          ) : (
            crons.slice(0, 8).map((cron, index) => {
              const statusConfig = {
                completed: { color: 'green', icon: CheckCircle2, bg: 'bg-green-400', shadow: 'shadow-green-400/50' },
                active: { color: 'blue', icon: Activity, bg: 'bg-blue-400 animate-pulse', shadow: 'shadow-blue-400/50' },
                pending: { color: 'yellow', icon: Clock, bg: 'bg-yellow-400', shadow: 'shadow-yellow-400/50' },
                failed: { color: 'red', icon: AlertCircle, bg: 'bg-red-400', shadow: 'shadow-red-400/50' }
              };
              
              const config = statusConfig[cron.result.status];
              const StatusIcon = config.icon;

              return (
                <motion.button
                  key={cron.cron_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectCron(cron.cron_id)}
                  className="w-full flex items-center justify-between p-5 bg-slate-800/50 hover:bg-slate-700/70 border-2 border-cyan-500/20 hover:border-cyan-500/50 rounded-2xl transition-all duration-300 group relative overflow-hidden"
                >
                  {/* HOVER GLOW */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />

                  <div className="flex items-center gap-4 relative z-10">
                    {/* STATUS INDICATOR */}
                    <motion.div 
                      className={`w-4 h-4 rounded-full ${config.bg} ${config.shadow} shadow-xl`}
                      animate={cron.result.status === 'active' ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    />

                    <div className="text-left">
                      <div className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                        <StatusIcon className="w-4 h-4" />
                        {cron.cron_data.name}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                        <span>{new Date(cron.timestamp).toLocaleString()}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-cyan-400 font-mono font-semibold">{cron.cron_data.modell}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 relative z-10">
                    {/* STATS */}
                    <div className="flex items-center gap-5 text-sm">
                      <motion.div 
                        className="text-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="text-green-400 font-black text-lg">{cron.result.generated}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">generated</div>
                      </motion.div>
                      <motion.div 
                        className="text-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="text-cyan-400 font-black text-lg">{cron.result.avg_quality.toFixed(0)}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">quality</div>
                      </motion.div>
                      <motion.div 
                        className="text-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className={`font-black text-lg ${cron.result.drift > 0.2 ? 'text-red-400' : 'text-green-400'}`}>
                          {(cron.result.drift * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">drift</div>
                      </motion.div>
                    </div>

                    {/* ARROW */}
                    <motion.div 
                      className="text-slate-400 group-hover:text-cyan-400 text-2xl"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </div>
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      {/* TOTAL COUNT */}
      <motion.div 
        className="mt-6 text-center text-sm text-slate-400 font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-cyan-400 font-bold text-lg">{stats.total}</span> total executions
      </motion.div>
    </div>
  );
}
