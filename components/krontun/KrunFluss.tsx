'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface KrunFlussProps {
  krunCount: number;
}

export function KrunFluss({ krunCount }: KrunFlussProps) {
  const [neurons, setNeurons] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Dense neuronal grid
    const newNeurons = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: 250 + Math.random() * 700
    }));
    setNeurons(newNeurons);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-black">
      {/* Dense neuronal network */}
      <svg className="absolute inset-0 w-full h-full">
        {/* Connection lines */}
        {neurons.map((neuron, i) => {
          return neurons
            .filter((other, j) => {
              if (i >= j) return false;
              const dx = neuron.x - other.x;
              const dy = neuron.y - other.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              return distance < 120;
            })
            .map((other, j) => (
              <motion.line
                key={`${i}-${j}`}
                x1={neuron.x}
                y1={neuron.y}
                x2={other.x}
                y2={other.y}
                stroke="rgba(0,255,255,0.08)"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0.05, 0.15, 0.05]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  delay: i * 0.02
                }}
              />
            ));
        })}

        {/* Neuronal nodes */}
        {neurons.map((neuron) => (
          <motion.circle
            key={neuron.id}
            cx={neuron.x}
            cy={neuron.y}
            r="1.5"
            fill="rgba(0,255,255,0.3)"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: neuron.id * 0.03
            }}
          />
        ))}

        {/* Energy pulses through network */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.circle
            key={`pulse-${i}`}
            r="2"
            fill="rgba(0,255,255,0.6)"
            initial={{ 
              cx: Math.random() * window.innerWidth,
              cy: 300 + Math.random() * 600,
              opacity: 0
            }}
            animate={{
              cx: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth
              ],
              cy: [
                300 + Math.random() * 600,
                300 + Math.random() * 600,
                300 + Math.random() * 600
              ],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3
            }}
            style={{ filter: 'blur(1px)' }}
          />
        ))}
      </svg>

      {/* Subtle scanlines */}
      <div className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)'
        }}
      />
    </div>
  );
}
