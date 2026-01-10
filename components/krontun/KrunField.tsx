'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useKrontunStore } from '@/lib/stores/krontun-store';
import { CursorResonance, FieldBackground } from '@/components/birth-field';
import { KrunKnoten } from './KrunKnoten';
import { KrunFluss } from './KrunFluss';
import { FieldAnalysisModal } from './FieldAnalysisModal';
import Image from 'next/image';
import { Activity, Clock, CheckCircle2, XCircle } from 'lucide-react';

export function KrunField() {
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
    if (stats.active === 0 && stats.pending === 0) setSystemState('drift');
    else if (stats.failed > 50) setSystemState('stress');
    else setSystemState('stable');
  }, [stats]);

  // DNA HELIX LAYOUT (double spiral)
  const getDNAHelixPosition = (index: number, total: number) => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };
    
    const width = window.innerWidth - 200;
    const centerY = 500;
    
    // Horizontal progression
    const x = 100 + (width / Math.min(total, 30)) * index;
    
    // Double helix pattern
    const amplitude = 150; // Height of wave
    const frequency = 0.4;  // How tight the helix is
    
    // Alternate between upper and lower strand
    const isUpperStrand = index % 2 === 0;
    const phase = isUpperStrand ? 0 : Math.PI;
    
    const y = centerY + amplitude * Math.sin(index * frequency + phase);
    
    return { x, y };
  };

  const statCards = [
    { title: 'Active', value: stats.active, icon: Activity, color: 'cyan' },
    { title: 'Pending', value: stats.pending, icon: Clock, color: 'yellow' },
    { title: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'green' },
    { title: 'Failed', value: stats.failed, icon: XCircle, color: 'red' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <CursorResonance />
      <FieldBackground state={systemState} />
      <KrunFluss krunCount={crons.length} />

      <div className="relative z-10 p-6">
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
            <Image src="/Logo1.png" alt="SYNTX Logo" width={120} height={120} className="object-contain" />
          </motion.div>

          <motion.h1 
            className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent mb-4"
            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: '200% auto', textShadow: '0 0 40px rgba(0,255,255,0.5)' }}
          >
            KRONTUN
          </motion.h1>
          
          <motion.p 
            className="text-cyan-400 text-lg font-mono"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Neural Calibration Stream · {crons.length} Active Runs
          </motion.p>
        </div>

        {/* Stats Cards */}
        <div className="flex justify-center gap-8 mb-12">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            const isActive = card.title === 'Active' && card.value > 0;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, y: Math.sin(Date.now() / 1000 + index) * 5 }}
                transition={{ scale: { type: 'spring', stiffness: 200 }, y: { duration: 2, repeat: Infinity } }}
                whileHover={{ scale: 1.1, y: -10 }}
                className="relative"
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-40 blur-xl"
                  style={{ background: card.color === 'cyan' ? '#00ffff' : card.color === 'yellow' ? '#eab308' : card.color === 'green' ? '#22c55e' : '#ef4444' }}
                  animate={{ scale: isActive ? [1, 1.2, 1] : 1, opacity: isActive ? [0.4, 0.8, 0.4] : 0.4 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                <div className="relative bg-black/60 backdrop-blur-xl rounded-2xl p-6 min-w-[160px]">
                  <div className="flex flex-col items-center gap-3">
                    <Icon className={`w-8 h-8 text-${card.color}-400`} />
                    <motion.div 
                      className={`text-5xl font-black font-mono text-${card.color}-400`}
                      animate={isActive ? {
                        textShadow: [
                          `0 0 10px ${card.color === 'cyan' ? '#00ffff' : card.color === 'yellow' ? '#eab308' : card.color === 'green' ? '#22c55e' : '#ef4444'}`,
                          `0 0 30px ${card.color === 'cyan' ? '#00ffff' : card.color === 'yellow' ? '#eab308' : card.color === 'green' ? '#22c55e' : '#ef4444'}`,
                          `0 0 10px ${card.color === 'cyan' ? '#00ffff' : card.color === 'yellow' ? '#eab308' : card.color === 'green' ? '#22c55e' : '#ef4444'}`
                        ]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {card.value}
                    </motion.div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* DNA HELIX FIELD */}
        <div className="relative h-[800px] mt-12">
          <h2 className="text-3xl font-black text-cyan-400 mb-6 text-center">DNA CALIBRATION HELIX</h2>
          
          <div className="absolute top-12 left-20 text-xs text-slate-600 font-mono">← GENESIS</div>
          <div className="absolute top-12 right-20 text-xs text-slate-600 font-mono">PRESENT →</div>

          {/* SVG DNA Backbone */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Upper helix strand */}
            <motion.path
              d={`M 100 ${500 - 150} ${crons.slice(0, 30).map((_, i) => {
                const pos = getDNAHelixPosition(i, crons.length);
                return `L ${pos.x} ${pos.y}`;
              }).join(' ')}`}
              fill="none"
              stroke="rgba(0,255,255,0.2)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                pathLength: { duration: 3 },
                opacity: { duration: 3, repeat: Infinity }
              }}
            />

            {/* Cross-links between strands */}
            {crons.slice(0, 30).map((cron, index) => {
              if (index === 0 || index % 2 !== 0) return null;
              
              const pos1 = getDNAHelixPosition(index, crons.length);
              const pos2 = getDNAHelixPosition(index + 1, crons.length);
              
              const score = cron.scores.overall;
              const lineColor = score >= 80 ? 'rgba(34,197,94,0.3)' : 
                               score >= 50 ? 'rgba(234,179,8,0.3)' : 
                               'rgba(239,68,68,0.3)';
              
              return (
                <motion.line
                  key={`link-${index}`}
                  x1={pos1.x + 35}
                  y1={pos1.y + 35}
                  x2={pos2.x + 35}
                  y2={pos2.y + 35}
                  stroke={lineColor}
                  strokeWidth="1.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ 
                    pathLength: { duration: 1.5, delay: index * 0.1 },
                    opacity: { duration: 2, repeat: Infinity, delay: index * 0.1 }
                  }}
                />
              );
            })}
          </svg>

          {/* Knoten on DNA helix */}
          {crons.slice(0, 30).map((cron, index) => {
            const position = getDNAHelixPosition(index, crons.length);
            return (
              <KrunKnoten
                key={`${cron.timestamp}-${index}`}
                log={cron}
                onClick={() => selectCron(cron)}
                index={index}
                position={position}
              />
            );
          })}

          {crons.length === 0 && !loading && (
            <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-600 mb-2">No Calibration Runs</p>
                <p className="text-sm text-slate-500">Waiting for system activity...</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <FieldAnalysisModal log={selectedCron} onClose={() => selectCron(null)} />
    </div>
  );
}
