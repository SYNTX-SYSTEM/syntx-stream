'use client';

import { motion } from 'framer-motion';

interface CyberStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

export function CyberStatCard({ icon, label, value, color }: CyberStatCardProps) {
  const colorMap: Record<string, string> = {
    blue: 'border-blue-500/30 bg-blue-900/10',
    yellow: 'border-yellow-500/30 bg-yellow-900/10',
    green: 'border-green-500/30 bg-green-900/10',
    cyan: 'border-cyan-500/30 bg-cyan-900/10',
    purple: 'border-purple-500/30 bg-purple-900/10',
  };

  return (
    <div className={`border-2 ${colorMap[color]} rounded-xl p-3 relative overflow-hidden group hover:scale-105 transition-transform`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <div className="relative flex items-center gap-2 mb-2">
        <div className="text-cyan-400">{icon}</div>
        <p className="text-xs text-gray-500 uppercase tracking-wider font-mono">{label}</p>
      </div>
      <p className="text-sm font-mono font-bold text-white relative">{value}</p>
    </div>
  );
}
