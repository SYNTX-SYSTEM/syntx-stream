'use client';

import { motion } from 'framer-motion';

interface NeuralBackgroundProps {
  quality: number;
}

export function NeuralBackground({ quality }: NeuralBackgroundProps) {
  const neuronColor = quality >= 90 ? '#10b981' : quality >= 70 ? '#06b6d4' : '#f59e0b';
  
  // 5 neurons horizontal über die Reihe verteilt
  const neurons = [
    { x: 10, y: 50 },
    { x: 30, y: 50 },
    { x: 50, y: 50 },
    { x: 70, y: 50 },
    { x: 90, y: 50 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Horizontal flowing line */}
      <svg className="absolute inset-0 w-full h-full">
        {/* Main flow line */}
        <motion.line
          x1="0%"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke={neuronColor}
          strokeWidth="2"
          strokeOpacity="0.15"
          strokeDasharray="5,10"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Connecting lines between neurons */}
        {neurons.map((neuron, i) => {
          if (i === neurons.length - 1) return null;
          const next = neurons[i + 1];
          return (
            <motion.line
              key={i}
              x1={`${neuron.x}%`}
              y1={`${neuron.y}%`}
              x2={`${next.x}%`}
              y2={`${next.y}%`}
              stroke={neuronColor}
              strokeWidth="1.5"
              strokeOpacity="0.3"
              animate={{
                strokeOpacity: [0.1, 0.5, 0.1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            />
          );
        })}
      </svg>

      {/* Pulsing neurons */}
      {neurons.map((neuron, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${neuron.x}%`,
            top: `${neuron.y}%`,
            backgroundColor: neuronColor,
            boxShadow: `0 0 15px ${neuronColor}`,
          }}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Flowing particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: neuronColor,
            boxShadow: `0 0 10px ${neuronColor}`,
            top: '50%',
          }}
          animate={{
            left: ['-5%', '105%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
