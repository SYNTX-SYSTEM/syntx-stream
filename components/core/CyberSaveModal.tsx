'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SaveState {
  status: 'saving' | 'success' | 'error';
  message: string;
  details?: string;
  data?: Record<string, number>;
}

interface CyberSaveModalProps {
  isOpen: boolean;
  saveState: SaveState;
  onClose: () => void;
}

export function CyberSaveModal({ isOpen, saveState, onClose }: CyberSaveModalProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  
  useEffect(() => {
    if (isOpen) {
      // Generate particles
      const newParticles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      }));
      setParticles(newParticles);
      
      // Auto close on success after 3s
      if (saveState.status === 'success') {
        setTimeout(() => onClose(), 3000);
      }
    }
  }, [isOpen, saveState.status, onClose]);
  
  const getStatusColor = () => {
    switch (saveState.status) {
      case 'saving': return 'cyan';
      case 'success': return 'green';
      case 'error': return 'red';
    }
  };
  
  const getStatusIcon = () => {
    switch (saveState.status) {
      case 'saving': return '💾';
      case 'success': return '✅';
      case 'error': return '❌';
    }
  };
  
  const color = getStatusColor();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={saveState.status !== 'saving' ? onClose : undefined}
        >
          {/* Particles Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className={`absolute w-1 h-1 rounded-full bg-${color}-400`}
                style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
                animate={{
                  y: [0, -100, -200],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
            className={`relative max-w-2xl w-full bg-black rounded-3xl border-4 border-${color}-400 overflow-hidden shadow-2xl`}
            style={{
              boxShadow: `0 0 60px rgba(${color === 'cyan' ? '6,182,212' : color === 'green' ? '74,222,128' : '239,68,68'},0.6)`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Grid */}
            <motion.div 
              className="absolute inset-0 opacity-10"
              animate={{ 
                backgroundPosition: ['0px 0px', '50px 50px', '0px 0px']
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundImage: `linear-gradient(rgba(${color === 'cyan' ? '6,182,212' : color === 'green' ? '74,222,128' : '239,68,68'},0.5) 2px, transparent 2px), linear-gradient(90deg, rgba(${color === 'cyan' ? '6,182,212' : color === 'green' ? '74,222,128' : '239,68,68'},0.5) 2px, transparent 2px)`,
                backgroundSize: '50px 50px'
              }} 
            />
            
            {/* Scan Lines */}
            <motion.div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(${color === 'cyan' ? '6,182,212' : color === 'green' ? '74,222,128' : '239,68,68'},0.8) 4px, rgba(${color === 'cyan' ? '6,182,212' : color === 'green' ? '74,222,128' : '239,68,68'},0.8) 6px)`
              }}
              animate={{ y: [0, 50, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Data Streams */}
            {saveState.status === 'saving' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-px bg-gradient-to-b from-transparent via-${color}-400 to-transparent`}
                    style={{ 
                      left: `${10 + i * 10}%`,
                      height: '100%'
                    }}
                    animate={{ 
                      y: ['-100%', '200%'],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "linear"
                    }}
                  />
                ))}
              </div>
            )}
            
            <div className="relative p-10">
              {/* Header */}
              <div className="flex items-center justify-center mb-8">
                <motion.div
                  className="text-8xl"
                  animate={saveState.status === 'saving' ? {
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  } : saveState.status === 'success' ? {
                    scale: [1, 1.3, 1],
                    rotate: [0, 10, -10, 0]
                  } : {
                    x: [-10, 10, -10, 10, 0]
                  }}
                  transition={saveState.status === 'saving' ? {
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity }
                  } : saveState.status === 'success' ? {
                    duration: 0.6
                  } : {
                    duration: 0.5
                  }}
                >
                  {getStatusIcon()}
                </motion.div>
              </div>
              
              {/* Status Message */}
              <motion.h2 
                className={`text-${color}-400 font-black text-4xl text-center mb-4 uppercase tracking-wider`}
                animate={{ 
                  textShadow: [
                    `0 0 20px rgba(${color === 'cyan' ? '6,182,212' : color === 'green' ? '74,222,128' : '239,68,68'},0.8)`,
                    `0 0 40px rgba(${color === 'cyan' ? '6,182,212' : color === 'green' ? '74,222,128' : '239,68,68'},1)`,
                    `0 0 20px rgba(${color === 'cyan' ? '6,182,212' : color === 'green' ? '74,222,128' : '239,68,68'},0.8)`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {saveState.message}
              </motion.h2>
              
              {/* Details */}
              {saveState.details && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-gray-300 text-xl text-center mb-6 font-bold"
                >
                  {saveState.details}
                </motion.p>
              )}
              
              {/* Data Display */}
              {saveState.data && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`bg-black/60 rounded-2xl border-2 border-${color}-500/30 p-6 max-h-[300px] overflow-y-auto cyber-scroll`}
                >
                  <div className="space-y-2">
                    {Object.entries(saveState.data).map(([key, value], idx) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex justify-between items-center p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20 hover:bg-${color}-500/20 transition-colors`}
                      >
                        <span className="text-white font-bold text-lg truncate pr-4">{key}</span>
                        <motion.span 
                          className={`text-${color}-400 font-black text-2xl`}
                          animate={{ 
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            delay: idx * 0.1
                          }}
                        >
                          {Math.round(value * 100)}%
                        </motion.span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Progress Bar */}
              {saveState.status === 'saving' && (
                <motion.div 
                  className="mt-8 h-3 bg-black/60 rounded-full overflow-hidden border-2 border-cyan-500/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-400"
                    animate={{ 
                      x: ['-100%', '100%']
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{ width: '50%' }}
                  />
                </motion.div>
              )}
              
              {/* Close Button */}
              {saveState.status !== 'saving' && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={onClose}
                  className={`mt-8 w-full py-4 rounded-2xl font-black text-xl uppercase tracking-wider
                           bg-${color}-500/20 border-4 border-${color}-400 text-${color}-400
                           hover:bg-${color}-500/40 hover:scale-105 transition-all`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {saveState.status === 'success' ? 'NICE! 🔥' : 'FUCK! RETRY'}
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
