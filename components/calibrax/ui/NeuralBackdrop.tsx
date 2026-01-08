'use client';

import { motion } from 'framer-motion';

interface NeuralBackdropProps {
  onClick: () => void;
}

export function NeuralBackdrop({ onClick }: NeuralBackdropProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl">
        {/* Neural grid */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            {[...Array(20)].map((_, i) => (
              <motion.line
                key={`h-${i}`}
                x1="0"
                y1={`${i * 5}%`}
                x2="100%"
                y2={`${i * 5}%`}
                stroke="cyan"
                strokeWidth="1"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
            {[...Array(20)].map((_, i) => (
              <motion.line
                key={`v-${i}`}
                x1={`${i * 5}%`}
                y1="0"
                x2={`${i * 5}%`}
                y2="100%"
                stroke="cyan"
                strokeWidth="1"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </svg>
        </div>
        
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%` 
            }}
            animate={{ 
              y: [0, -30, 0], 
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 2 + Math.random() * 3, 
              repeat: Infinity, 
              delay: Math.random() * 5 
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
