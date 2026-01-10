'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, RefreshCw, CheckCircle2, XCircle, Brain, Zap } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { InsightModal } from './InsightModal';

interface FieldAnalysisModalProps {
  log: {
    timestamp: string;
    cron_data: {
      name: string;
      modell: string;
      felder: Record<string, number>;
    };
    stages: {
      parsed_fields: Record<string, string | null>;
      gpt_output_meta_prompt?: string; // OPTIONAL
    };
    scores: {
      overall: number;
      field_completeness: number;
      structure_adherence: number;
    };
    meta: {
      duration_ms: number;
      retry_count: number;
      success: boolean;
    };
  } | null;
  onClose: () => void;
}

export function FieldAnalysisModal({ log, onClose }: FieldAnalysisModalProps) {
  const [showInsight, setShowInsight] = useState(false);
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  if (!log) return null;

  const duration = (log.meta.duration_ms / 1000).toFixed(2);
  const allFields = Object.keys(log.cron_data.felder);
  const parsedFields = Object.keys(log.stages.parsed_fields).filter(
    key => log.stages.parsed_fields[key] !== null
  );

  const scores = [
    { label: 'Overall', value: log.scores.overall },
    { label: 'Completeness', value: log.scores.field_completeness },
    { label: 'Structure', value: log.scores.structure_adherence }
  ];

  const getModelColor = () => {
    if (log.cron_data.modell.includes('gpt')) return { main: '#06b6d4', rgb: 'rgba(6,182,212' };
    if (log.cron_data.modell.includes('mistral')) return { main: '#a855f7', rgb: 'rgba(168,85,247' };
    if (log.cron_data.modell.includes('claude')) return { main: '#ec4899', rgb: 'rgba(236,72,153' };
    return { main: '#a855f7', rgb: 'rgba(168,85,247' };
  };

  const color = getModelColor();

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[99999] flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl rounded-3xl overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.98) 100%)',
              boxShadow: `0 0 100px ${color.rgb},0.4), inset 0 0 100px rgba(0,0,0,0.3)`
            }}
          >
            {/* Neuronal Background Layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Flowing neural waves */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.path
                    key={i}
                    d={`M 0 ${200 + i * 100} Q 250 ${150 + i * 100} 500 ${200 + i * 100} T 1000 ${200 + i * 100}`}
                    fill="none"
                    stroke={color.main}
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: 1, 
                      opacity: [0.2, 0.5, 0.2],
                      x: [0, 50, 0]
                    }}
                    transition={{ 
                      pathLength: { duration: 2, delay: i * 0.2 },
                      opacity: { duration: 3, repeat: Infinity, delay: i * 0.3 },
                      x: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
                    }}
                  />
                ))}
              </svg>

              {/* Particle field */}
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ 
                    backgroundColor: color.main,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>

            {/* Header with EKG Pulse */}
            <div className="relative border-b p-6"
              style={{ borderColor: color.main + '20' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  >
                    <Image src="/Logo1.png" alt="SYNTX" width={50} height={50} />
                  </motion.div>
                  
                  <div>
                    <motion.h2 
                      className="text-3xl font-black font-mono tracking-wider flex items-center gap-3"
                      style={{
                        background: `linear-gradient(90deg, ${color.main}, #00ffff, ${color.main})`,
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                      animate={{
                        backgroundPosition: ['0%', '100%', '0%']
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Zap className="w-7 h-7" style={{ color: color.main }} />
                      {log.cron_data.name}
                    </motion.h2>
                    
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-400 font-mono">
                      <span style={{ color: color.main }}>{log.cron_data.modell}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{duration}s</span>
                      <span>•</span>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: color.rgb + ',0.1)' }}
                  whileHover={{ 
                    backgroundColor: color.rgb + ',0.2)',
                    rotate: 90 
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6 text-slate-300" />
                </motion.button>
              </div>

              {/* EKG Pulse Line */}
              <svg className="absolute bottom-0 left-0 w-full h-8 opacity-30">
                <motion.path
                  d="M 0 16 L 50 16 L 60 8 L 70 24 L 80 16 L 1000 16"
                  fill="none"
                  stroke={color.main}
                  strokeWidth="2"
                  animate={{
                    x: [0, -100, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </svg>
            </div>

            {/* Main Content Grid */}
            <div className="relative grid grid-cols-5 gap-6 p-6">
              {/* Left: Neural Scores (2 cols) */}
              <div className="col-span-2 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5" style={{ color: color.main }} />
                  <h3 className="text-lg font-bold font-mono tracking-wider" style={{ color: color.main }}>
                    NEURAL SCORES
                  </h3>
                </div>

                {scores.map((score, idx) => (
                  <motion.div
                    key={score.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400 font-mono">{score.label}</span>
                      <motion.span 
                        className="text-2xl font-black font-mono"
                        style={{ color: color.main }}
                        animate={{
                          textShadow: [
                            `0 0 10px ${color.main}`,
                            `0 0 20px ${color.main}`,
                            `0 0 10px ${color.main}`
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {score.value}%
                      </motion.span>
                    </div>

                    {/* Neuronal Energy Bar */}
                    <div className="relative h-3 bg-slate-900/50 rounded-full overflow-hidden">
                      {/* Background wave */}
                      <motion.div
                        className="absolute inset-0 opacity-20"
                        style={{
                          background: `repeating-linear-gradient(90deg, transparent, ${color.main}20 10px, transparent 20px)`
                        }}
                        animate={{ x: [0, 20, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                      
                      {/* Score fill */}
                      <motion.div
                        className="absolute inset-y-0 left-0"
                        style={{ 
                          width: `${score.value}%`,
                          background: `linear-gradient(90deg, ${color.main}, #00ffff)`,
                          boxShadow: `0 0 15px ${color.rgb},0.6)`
                        }}
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${score.value}%`,
                          boxShadow: [
                            `0 0 15px ${color.rgb},0.6)`,
                            `0 0 25px ${color.rgb},0.9)`,
                            `0 0 15px ${color.rgb},0.6)`
                          ]
                        }}
                        transition={{ 
                          width: { duration: 1.5, ease: 'easeOut', delay: idx * 0.2 },
                          boxShadow: { duration: 2, repeat: Infinity }
                        }}
                      />
                    </div>
                  </motion.div>
                ))}

                {/* Performance Metrics */}
                <div className="mt-8 space-y-3">
                  <h4 className="text-sm font-bold font-mono tracking-wider" style={{ color: color.main }}>
                    PERFORMANCE
                  </h4>

                  <div className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: color.rgb + ',0.05)' }}
                  >
                    <span className="text-sm text-slate-400 font-mono">Duration</span>
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ 
                          duration: parseFloat(duration) / 10, 
                          repeat: Infinity, 
                          ease: 'linear' 
                        }}
                      >
                        <RefreshCw className="w-4 h-4" style={{ color: color.main }} />
                      </motion.div>
                      <span className="font-bold font-mono text-white">{duration}s</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: color.rgb + ',0.05)' }}
                  >
                    <span className="text-sm text-slate-400 font-mono">Retries</span>
                    <span className="font-bold font-mono text-yellow-400">
                      x{log.meta.retry_count}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: color.rgb + ',0.05)' }}
                  >
                    <span className="text-sm text-slate-400 font-mono">Status</span>
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {log.meta.success ? (
                          <div className="w-2 h-2 rounded-full bg-green-400"
                            style={{ boxShadow: '0 0 10px rgba(34,197,94,0.8)' }}
                          />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-red-400"
                            style={{ boxShadow: '0 0 10px rgba(239,68,68,0.8)' }}
                          />
                        )}
                      </motion.div>
                      <span className={`font-bold font-mono ${log.meta.success ? 'text-green-400' : 'text-red-400'}`}>
                        {log.meta.success ? 'SUCCESS' : 'FAILURE'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Field Extraction Matrix (3 cols) */}
              <div className="col-span-3">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5" style={{ color: color.main }} />
                  <h3 className="text-lg font-bold font-mono tracking-wider" style={{ color: color.main }}>
                    FIELD EXTRACTION MATRIX
                  </h3>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {allFields.map((field, idx) => {
                    const extracted = parsedFields.includes(field);
                    const fieldValue = log.stages.parsed_fields[field];
                    
                    return (
                      <motion.div
                        key={field}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onMouseEnter={() => setHoveredField(field)}
                        onMouseLeave={() => setHoveredField(null)}
                        className="relative group"
                      >
                        <motion.div
                          className="flex items-center justify-between px-4 py-3 rounded-lg font-mono cursor-pointer"
                          style={{ 
                            backgroundColor: extracted 
                              ? 'rgba(34,197,94,0.1)' 
                              : 'rgba(239,68,68,0.1)',
                            borderLeft: `3px solid ${extracted ? '#22c55e' : '#ef4444'}`
                          }}
                          whileHover={{ 
                            x: 5,
                            backgroundColor: extracted 
                              ? 'rgba(34,197,94,0.2)' 
                              : 'rgba(239,68,68,0.2)',
                            boxShadow: extracted
                              ? '0 0 20px rgba(34,197,94,0.3)'
                              : '0 0 20px rgba(239,68,68,0.3)'
                          }}
                        >
                          <div className="flex items-center gap-3">
                            {extracted ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400" />
                            )}
                            <span className="text-white">{field}</span>
                          </div>

                          <motion.div
                            animate={{ 
                              scale: extracted ? [1, 1.3, 1] : 1,
                              rotate: extracted ? [0, 360] : 0
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <div className="w-2 h-2 rounded-full"
                              style={{ 
                                backgroundColor: extracted ? '#22c55e' : '#ef4444',
                                boxShadow: `0 0 8px ${extracted ? '#22c55e' : '#ef4444'}`
                              }}
                            />
                          </motion.div>
                        </motion.div>

                        {/* Hologram overlay on hover */}
                        {hoveredField === field && fieldValue && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute z-10 top-full left-0 right-0 mt-2 p-3 rounded-lg border text-xs font-mono"
                            style={{
                              backgroundColor: 'rgba(0,0,0,0.95)',
                              borderColor: color.main,
                              boxShadow: `0 0 20px ${color.rgb},0.5)`
                            }}
                          >
                            <div className="text-slate-400 mb-1">Extracted Value:</div>
                            <div className="text-white truncate">{fieldValue}</div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div 
                  className="mt-4 text-sm text-slate-500 text-center font-mono"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {parsedFields.length} / {allFields.length} neurons activated
                </motion.div>
              </div>
            </div>

            {/* Bottom: Resonance Close Button */}
            <div className="relative border-t p-6"
              style={{ borderColor: color.main + '20' }}
            >
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  onClick={() => setShowInsight(true)}
                  className="py-4 rounded-xl font-bold font-mono tracking-wider text-white relative overflow-hidden"
                  style={{ 
                    background: `linear-gradient(90deg, ${color.rgb},0.8), ${color.main})`,
                    boxShadow: `0 0 20px ${color.rgb},0.4)`
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: `0 0 40px ${color.rgb},0.7)`
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Brain className="w-5 h-5" />
                    INSIGHT ANALYSIS
                  </span>
                </motion.button>

                <motion.button
                  onClick={onClose}
                  className="py-4 rounded-xl font-bold font-mono tracking-wider text-white relative overflow-hidden"
                  style={{ 
                    background: `linear-gradient(90deg, ${color.rgb},0.8), ${color.main})`,
                    boxShadow: `0 0 20px ${color.rgb},0.4)`
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: `0 0 40px ${color.rgb},0.7)`
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                  <span className="relative z-10">🧠 RESONANZKREIS SCHLIESSEN</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {showInsight && <InsightModal log={log} onClose={() => setShowInsight(false)} />}
    </>
  );
}
