'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Droplet } from 'lucide-react';

interface Job {
  filename: string;
  score: number;
  wrapper: string;
  completed_at: string;
  rating: string;
}

interface RecentJobsProps {
  jobs: Job[];
}

export function RecentJobs({ jobs }: RecentJobsProps) {
  const getJobColor = (score: number) => {
    if (score >= 60) return {
      bg: 'bg-gradient-to-r from-green-500/20 to-cyan-500/20',
      border: 'border-green-500/50',
      text: 'text-green-400',
      glow: 'shadow-green-500/30',
      icon: <Zap className="w-4 h-4" />
    };
    if (score >= 30) return {
      bg: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20',
      border: 'border-yellow-500/50',
      text: 'text-yellow-400',
      glow: 'shadow-yellow-500/30',
      icon: <Zap className="w-4 h-4" />
    };
    return {
      bg: 'bg-gradient-to-r from-red-500/20 to-rose-500/20',
      border: 'border-red-500/50',
      text: 'text-red-400',
      glow: 'shadow-red-500/30',
      icon: <Droplet className="w-4 h-4" />
    };
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-cyan-400 font-mono tracking-wider">RECENT COMPLETED</h3>
        <span className="text-xs text-gray-500 font-mono">{jobs.length} jobs</span>
      </div>
      
      <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-900">
        <AnimatePresence mode="popLayout">
          {jobs.map((job, index) => {
            const colors = getJobColor(job.score);
            const shouldShake = job.score < 30;
            const shouldGlitch = job.score === 0;
            
            return (
              <motion.div
                key={job.filename}
                initial={{ opacity: 0, x: 100 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  ...(shouldShake && {
                    x: [0, -2, 2, -2, 0],
                  })
                }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ 
                  type: 'spring',
                  delay: index * 0.05,
                  ...(shouldShake && {
                    x: {
                      duration: 0.3,
                      repeat: 2,
                      repeatDelay: 0.5
                    }
                  })
                }}
                whileHover={{ scale: 1.02, boxShadow: `0 0 20px ${colors.glow}` }}
                className={`relative p-4 rounded-lg border-2 ${colors.border} ${colors.bg} backdrop-blur-sm overflow-hidden group`}
              >
                {/* Glitch Effect for score 0 */}
                {shouldGlitch && (
                  <motion.div
                    className="absolute inset-0 bg-red-500/20"
                    animate={{
                      opacity: [0, 0.5, 0],
                      x: [0, -2, 2, 0]
                    }}
                    transition={{
                      duration: 0.2,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  />
                )}
                
                {/* Scan Line */}
                <motion.div
                  className="absolute left-0 right-0 h-px bg-white/20"
                  animate={{ top: ['0%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className={colors.text}>
                      {colors.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white font-mono">
                        {job.wrapper}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        {job.completed_at}
                      </div>
                    </div>
                  </div>
                  
                  <motion.div 
                    className={`text-2xl font-black ${colors.text} font-mono tabular-nums`}
                    animate={shouldGlitch ? {
                      opacity: [1, 0.5, 1],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={shouldGlitch ? {
                      duration: 0.3,
                      repeat: Infinity,
                      repeatDelay: 2
                    } : {}}
                  >
                    {job.score}
                  </motion.div>
                </div>
                
                {/* Score Bar */}
                <div className="mt-2 h-1 bg-gray-900 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${
                      job.score >= 60 ? 'from-green-500 to-cyan-500' :
                      job.score >= 30 ? 'from-yellow-500 to-orange-500' :
                      'from-red-500 to-rose-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${job.score}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
