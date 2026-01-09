'use client';

import { motion } from 'framer-motion';

interface ResonanzCardProps {
  title: string;
  value: string | number;
  resonanz: string;
  icon?: React.ReactNode;
}

export function ResonanzCard({ title, value, resonanz, icon }: ResonanzCardProps) {
  const isDrift = resonanz === 'DRIFT';
  const isActive = resonanz === 'AKTIV';
  const isCritical = resonanz === 'KRITISCH';
  
  const getColors = () => {
    if (isDrift) return {
      border: 'border-red-500',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      glow: 'rgba(239, 68, 68, 0.6)',
      accent: '#ef4444'
    };
    if (isCritical) return {
      border: 'border-orange-500',
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      glow: 'rgba(249, 115, 22, 0.6)',
      accent: '#f97316'
    };
    return {
      border: 'border-cyan-500',
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      glow: 'rgba(6, 182, 212, 0.6)',
      accent: '#06b6d4'
    };
  };
  
  const colors = getColors();
  
  return (
    <motion.div
      className="relative group"
      whileHover={{ scale: 1.02 }}
    >
      {/* Holographic Edge Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-30 blur transition duration-500" />
      
      <motion.div
        className={`relative p-6 rounded-xl border-2 ${colors.border} ${colors.bg} backdrop-blur-sm overflow-hidden`}
        animate={
          isDrift ? {
            borderColor: ['#dc2626', '#ef4444', '#dc2626'],
            scale: [1, 1.02, 1]
          } : isCritical ? {
            x: [0, -2, 2, -2, 0],
          } : {
            borderColor: ['#06b6d4', '#22d3ee', '#06b6d4'],
          }
        }
        transition={
          isDrift ? {
            duration: 3,
            repeat: Infinity,
          } : isCritical ? {
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 2
          } : {
            duration: 4,
            repeat: Infinity,
          }
        }
        style={{
          boxShadow: `0 0 30px ${colors.glow}`
        }}
      >
        {/* Hexagon Pattern Background */}
        <div className="absolute inset-0 opacity-5"
             style={{
               backgroundImage: `radial-gradient(circle at 25px 25px, ${colors.accent} 2%, transparent 0%), 
                                radial-gradient(circle at 75px 75px, ${colors.accent} 2%, transparent 0%)`,
               backgroundSize: '50px 50px'
             }}
        />
        
        {/* Scan Line */}
        <motion.div
          className={`absolute left-0 right-0 h-px ${isDrift ? 'bg-red-500' : isCritical ? 'bg-orange-500' : 'bg-cyan-500'} opacity-50`}
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Data Stream */}
        <div className="absolute top-0 right-0 bottom-0 w-8 overflow-hidden opacity-20">
          <motion.div
            className="text-xs font-mono"
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className={colors.text}>
                {Math.random().toString(2).substring(2, 10)}
              </div>
            ))}
          </motion.div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
            {icon}
          </div>
          
          <div className={`text-3xl font-black ${colors.text} mb-2 font-mono`}>
            {value}
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.div 
              className={`w-2 h-2 rounded-full ${
                isDrift ? 'bg-red-500' : 
                isCritical ? 'bg-orange-500' : 
                'bg-cyan-500'
              }`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}
            />
            <span className={`text-xs font-bold ${colors.text} tracking-widest`}>
              {resonanz}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
