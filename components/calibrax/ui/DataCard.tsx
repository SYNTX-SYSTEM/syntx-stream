'use client';

import { motion } from 'framer-motion';

interface DataCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function DataCard({ title, icon, children, action }: DataCardProps) {
  return (
    <div className="border-2 border-cyan-500/20 rounded-xl p-5 bg-gradient-to-br from-gray-900/50 to-gray-950/50 relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent" 
        animate={{ x: ['-100%', '200%'] }} 
        transition={{ duration: 3, repeat: Infinity }} 
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <h3 className="text-lg font-bold text-cyan-400">{title}</h3>
          </div>
          {action}
        </div>
        {children}
      </div>
    </div>
  );
}
