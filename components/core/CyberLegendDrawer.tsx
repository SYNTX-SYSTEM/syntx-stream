'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Activity, TrendingUp, Zap, BarChart3 } from 'lucide-react';
import kategorien from '@/data/kategorien.json';

interface CyberLegendDrawerProps {
  topics: Array<{
    name: string;
    kategorie: string;
    weight: number;
    x: number;
    y: number;
  }>;
}

const getKategorieGradient = (kategorie: string) => {
  const kat = kategorien.kategorien[kategorie as keyof typeof kategorien.kategorien];
  return kat?.visual?.tailwind_gradient || 'from-gray-400 to-gray-600';
};

const getKategorieIcon = (kategorie: string) => {
  const kat = kategorien.kategorien[kategorie as keyof typeof kategorien.kategorien];
  return kat?.visual?.icon || '📦';
};

const getKategorieName = (kategorie: string) => {
  const kat = kategorien.kategorien[kategorie as keyof typeof kategorien.kategorien];
  return kat?.names?.de || kategorie;
};

export function CyberLegendDrawer({ topics }: CyberLegendDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const kategorieGroups = Object.keys(kategorien.kategorien).map(kat => ({
    key: kat,
    name: getKategorieName(kat),
    icon: getKategorieIcon(kat),
    gradient: getKategorieGradient(kat),
    count: topics.filter(t => t.kategorie === kat).length,
    avgWeight: topics.filter(t => t.kategorie === kat).reduce((sum, t) => sum + t.weight, 0) / (topics.filter(t => t.kategorie === kat).length || 1)
  }));

  return (
    <>
      {/* TOGGLE BUTTON */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] bg-gradient-to-l from-cyan-500 to-cyan-600 text-white px-3 py-8 rounded-l-2xl border-4 border-r-0 border-white shadow-2xl"
        style={{ boxShadow: '0 0 40px rgba(6,182,212,0.8)' }}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <ChevronRight size={32} /> : <ChevronLeft size={32} />}
        </motion.div>
        
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-xs font-black uppercase"
            style={{ writingMode: 'vertical-rl' }}
          >
            LEGENDS
          </motion.div>
        )}
      </motion.button>
      
      {/* DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            exit={{ x: 500 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[400px] bg-black/95 backdrop-blur-xl border-l-4 border-cyan-400 z-[99] overflow-hidden shadow-2xl"
            style={{ boxShadow: '-20px 0 60px rgba(6,182,212,0.4)' }}
          >
            {/* Animated background */}
            <motion.div 
              className="absolute inset-0 opacity-10"
              animate={{ 
                backgroundPosition: ['0px 0px', '100px 100px', '0px 0px']
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(6,182,212,0.5) 20px, rgba(6,182,212,0.5) 21px)',
              }} 
            />
            
            {/* Scan lines */}
            <motion.div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(6,182,212,0.8) 4px, rgba(6,182,212,0.8) 6px)'
              }}
              animate={{ y: [0, 50, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            
            <div className="relative h-full overflow-y-auto p-6 space-y-6 cyber-scroll">
              {/* HEADER */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b-2 border-cyan-400/30 pb-4"
              >
                <h2 className="text-cyan-400 font-black text-2xl tracking-wider uppercase flex items-center gap-2">
                  <Activity className="animate-pulse" />
                  SYSTEM LEGENDS
                </h2>
                <p className="text-gray-400 text-xs mt-1">Real-time Analytics Dashboard</p>
              </motion.div>
              
              {/* STATS CARD */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="relative bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl border-2 border-pink-400/40 p-4 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(236,72,153,0.5) 10px, rgba(236,72,153,0.5) 11px)',
                  }} />
                </div>
                
                <div className="relative flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <BarChart3 className="text-pink-400" size={24} />
                  </motion.div>
                  <h3 className="text-pink-400 font-black text-lg">QUICK STATS</h3>
                </div>
                
                <div className="relative grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-gray-400 text-[10px] mb-1">TOPICS</div>
                    <motion.div 
                      className="text-white font-black text-3xl"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {topics.length}
                    </motion.div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-[10px] mb-1">Ø WEIGHT</div>
                    <div className="text-cyan-400 font-black text-2xl">
                      {topics.length > 0 ? Math.round((topics.reduce((sum, t) => sum + t.weight, 0) / topics.length) * 100) : 0}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-[10px] mb-1">GROUPS</div>
                    <div className="text-purple-400 font-black text-2xl">
                      {Object.keys(kategorien.kategorien).length}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* KATEGORIEN */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border-2 border-cyan-400/40 p-4 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(6,182,212,0.5) 10px, rgba(6,182,212,0.5) 11px)',
                  }} />
                </div>
                
                <div className="relative flex items-center gap-3 mb-4">
                  <Activity className="text-cyan-400" size={20} />
                  <h3 className="text-cyan-400 font-black text-lg">KATEGORIEN</h3>
                </div>
                
                <div className="relative space-y-2">
                  {kategorieGroups.map((kat, idx) => (
                    <motion.div
                      key={kat.key}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      whileHover={{ x: 5, scale: 1.02 }}
                      className="flex items-center gap-3 bg-black/40 rounded-xl p-2 border border-cyan-500/20 hover:border-cyan-500/50 transition-all"
                    >
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${kat.gradient} flex items-center justify-center border-2 border-white/30 text-lg`}>
                        {kat.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-sm truncate">{kat.name}</div>
                        <div className="text-gray-400 text-[10px]">{kat.count} topics</div>
                      </div>
                      <div className="text-cyan-400 font-black text-lg">
                        {Math.round(kat.avgWeight * 100)}%
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* GEWICHTUNG */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border-2 border-green-400/40 p-4 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(74,222,128,0.5) 10px, rgba(74,222,128,0.5) 11px)',
                  }} />
                </div>
                
                <div className="relative flex items-center gap-3 mb-4">
                  <TrendingUp className="text-green-400" size={20} />
                  <h3 className="text-green-400 font-black text-lg">GEWICHTUNG</h3>
                </div>
                
                <div className="relative space-y-3">
                  <motion.div 
                    className="flex items-center gap-3"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-16 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white/30" />
                    <div className="flex-1">
                      <div className="text-white font-bold text-sm">HIGH</div>
                      <div className="text-gray-400 text-[10px]">70-100%</div>
                    </div>
                    <div className="text-green-400 font-black text-2xl">
                      {topics.filter(t => t.weight >= 0.7).length}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-3"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-16 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full border-2 border-white/30" />
                    <div className="flex-1">
                      <div className="text-white font-bold text-sm">MEDIUM</div>
                      <div className="text-gray-400 text-[10px]">40-70%</div>
                    </div>
                    <div className="text-yellow-400 font-black text-2xl">
                      {topics.filter(t => t.weight >= 0.4 && t.weight < 0.7).length}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-3"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-16 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full border-2 border-white/30" />
                    <div className="flex-1">
                      <div className="text-white font-bold text-sm">LOW</div>
                      <div className="text-gray-400 text-[10px]">0-40%</div>
                    </div>
                    <div className="text-orange-400 font-black text-2xl">
                      {topics.filter(t => t.weight < 0.4).length}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* CONTROLS */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border-2 border-purple-400/40 p-4 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(168,85,247,0.5) 10px, rgba(168,85,247,0.5) 11px)',
                  }} />
                </div>
                
                <div className="relative flex items-center gap-3 mb-4">
                  <Zap className="text-purple-400" size={20} />
                  <h3 className="text-purple-400 font-black text-lg">CONTROLS</h3>
                </div>
                
                <div className="relative space-y-3 text-sm">
                  <motion.div 
                    className="flex items-start gap-3 bg-black/40 rounded-lg p-2 border border-purple-500/20"
                    whileHover={{ x: 5 }}
                  >
                    <div className="text-2xl">🖱️</div>
                    <div className="flex-1">
                      <div className="text-white font-bold">Click</div>
                      <div className="text-gray-400 text-xs">+10% Weight Increase</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-3 bg-black/40 rounded-lg p-2 border border-purple-500/20"
                    whileHover={{ x: 5 }}
                  >
                    <div className="text-2xl">🖱️🖱️</div>
                    <div className="flex-1">
                      <div className="text-white font-bold">Double-Click</div>
                      <div className="text-gray-400 text-xs">-20% Weight Decrease</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-3 bg-black/40 rounded-lg p-2 border border-purple-500/20"
                    whileHover={{ x: 5 }}
                  >
                    <div className="text-2xl">✋</div>
                    <div className="flex-1">
                      <div className="text-white font-bold">Drag & Drop</div>
                      <div className="text-gray-400 text-xs">Move Topic Position</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-3 bg-black/40 rounded-lg p-2 border border-purple-500/20"
                    whileHover={{ x: 5 }}
                  >
                    <div className="text-2xl">💾</div>
                    <div className="flex-1">
                      <div className="text-white font-bold">Save Button</div>
                      <div className="text-gray-400 text-xs">Persist All Changes</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* FOOTER */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-gray-500 text-xs pb-4"
              >
                <div className="text-cyan-400 font-mono mb-1">SYNTX STREAM v2.1</div>
                <div>Real-time Topic Weight Control</div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
