'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useKrontunStore } from '@/lib/stores/krontun-store';
import { X, Play, Edit2, Trash2, Clock, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CronPayloadInspector() {
  const { selectedCron, selectCron, triggerCron } = useKrontunStore();
  const [pulse, setPulse] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 1000);
    return () => clearInterval(interval);
  }, []);
  
  if (!selectedCron) return null;
  
  const { cron_id, timestamp, cron_data, result } = selectedCron;
  
  const statusColors = {
    active: { bg: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-400/50', text: 'text-blue-400' },
    pending: { bg: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-400/50', text: 'text-yellow-400' },
    completed: { bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-400/50', text: 'text-green-400' },
    failed: { bg: 'from-red-500/20 to-rose-500/20', border: 'border-red-400/50', text: 'text-red-400' }
  };
  
  const colors = statusColors[result.status];
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        onClick={() => selectCron(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border-2 border-cyan-400/30 shadow-2xl overflow-hidden"
          style={{ boxShadow: '0 0 80px rgba(6, 182, 212, 0.4)' }}
        >
          {/* HEADER */}
          <div className={`bg-gradient-to-r ${colors.bg} border-b-2 ${colors.border} p-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <Image src="/Logo1.png" alt="SYNTX" width={50} height={50} />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-black text-white flex items-center gap-3">
                    <Zap className="w-7 h-7 text-cyan-400" />
                    {cron_data.name}
                  </h2>
                  <div className="text-sm text-slate-400 mt-1 flex items-center gap-3">
                    <span className="font-mono">{cron_id}</span>
                    <span>•</span>
                    <span>{new Date(timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <motion.div 
                  className={`px-5 py-2 rounded-xl ${colors.text} border-2 ${colors.border} font-bold uppercase text-sm`}
                  animate={{ scale: result.status === 'active' ? [1, 1.05, 1] : 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {result.status}
                </motion.div>
                <motion.button
                  onClick={() => selectCron(null)}
                  className="p-2 hover:bg-white/10 rounded-lg"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6 text-slate-300" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-6">
            <div className="grid grid-cols-3 gap-6">
              {/* LEFT COLUMN - STATS */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-3">Statistics</h3>
                {[
                  { label: 'Generated', value: result.generated, color: 'green' },
                  { label: 'Failed', value: result.failed, color: 'red' },
                  { label: 'Quality', value: result.avg_quality.toFixed(1), color: 'cyan' },
                  { label: 'Drift', value: `${(result.drift * 100).toFixed(1)}%`, color: result.drift > 0.2 ? 'red' : 'green' }
                ].map(stat => (
                  <motion.div
                    key={stat.label}
                    className={`bg-slate-800/50 rounded-xl p-4 border-2 border-${stat.color}-500/20`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-xs text-slate-400 mb-1">{stat.label}</div>
                    <div className={`text-3xl font-black text-${stat.color}-400`}>{stat.value}</div>
                  </motion.div>
                ))}
                
                <div className="pt-4">
                  <h3 className="text-lg font-bold text-white mb-3">Performance</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Duration', value: `${(result.duration_ms / 1000).toFixed(2)}s` },
                      { label: 'Cost', value: `$${result.cost.toFixed(2)}` },
                      { label: 'Success', value: `${((result.generated / (result.generated + result.failed)) * 100).toFixed(1)}%` }
                    ].map(metric => (
                      <div key={metric.label} className="flex justify-between p-3 bg-slate-800/30 rounded-lg">
                        <span className="text-slate-400 text-sm">{metric.label}</span>
                        <span className="text-white font-mono font-bold">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MIDDLE COLUMN - CONFIG */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Configuration</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Model</div>
                      <div className="text-white font-mono bg-cyan-500/10 px-3 py-2 rounded-lg border border-cyan-500/30">
                        {cron_data.modell}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Target Count</div>
                      <div className="text-white font-bold">{cron_data.anzahl} prompts</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    Field Weights
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(cron_data.felder).map(([field, weight]) => (
                      <div key={field}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-white">{field}</span>
                          <span className="text-sm text-cyan-400 font-mono">{(weight * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${weight * 100}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - ACTIONS */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Actions</h3>
                <div className="space-y-3">
                  {[
                    { icon: Play, label: 'Trigger Manually', onClick: () => triggerCron(cron_id), color: 'cyan' },
                    { icon: Edit2, label: 'Edit Configuration', onClick: () => alert('Edit coming soon!'), color: 'blue' },
                    { icon: Trash2, label: 'Delete Cron', onClick: () => alert('Delete coming soon!'), color: 'red' }
                  ].map(action => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={action.label}
                        onClick={action.onClick}
                        className={`w-full flex items-center gap-3 px-4 py-3 bg-${action.color}-500/10 border-2 border-${action.color}-500/30 hover:border-${action.color}-400/60 rounded-xl transition-all group`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className={`w-5 h-5 text-${action.color}-400`} />
                        <span className="text-white font-semibold">{action.label}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {result.drift > 0.2 && (
                  <motion.div 
                    className="mt-6 p-4 bg-red-500/10 border-2 border-red-400/50 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <div>
                        <div className="text-sm font-bold text-red-400">High Drift!</div>
                        <div className="text-xs text-slate-300">Adjust weights</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
