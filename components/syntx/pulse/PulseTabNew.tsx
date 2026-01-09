'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SystemCore } from './SystemCore';
import { ResonanzCard } from './ResonanzCard';
import { QueueTower } from './QueueTower';
import { RecentJobs } from './RecentJobs';
import { CyberBackground } from './CyberBackground';
import { Activity, Zap, TrendingUp } from 'lucide-react';
import Image from 'next/image';

export function PulseTabNew() {
  const [health, setHealth] = useState<any>(null);
  const [resonanz, setResonanz] = useState<any>(null);
  const [queue, setQueue] = useState<any>(null);
  const [showDriftFlash, setShowDriftFlash] = useState(false);
  
  const fetchData = async () => {
    try {
      const [healthRes, resonanzRes, queueRes] = await Promise.all([
        fetch('https://dev.syntx-system.com/api/strom/health'),
        fetch('https://dev.syntx-system.com/api/strom/resonanz/system'),
        fetch('https://dev.syntx-system.com/api/strom/monitoring/live-queue')
      ]);
      
      const healthData = await healthRes.json();
      const resonanzData = await resonanzRes.json();
      const queueData = await queueRes.json();
      
      setHealth(healthData);
      setResonanz(resonanzData);
      setQueue(queueData);
      
      const hasDrift = resonanzData?.resonanz_felder && 
        Object.values(resonanzData.resonanz_felder).some((f: any) => f.resonanz === 'DRIFT');
      
      if (hasDrift && !showDriftFlash) {
        setShowDriftFlash(true);
        setTimeout(() => setShowDriftFlash(false), 200);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };
  
  useEffect(() => {
    fetchData();
    const healthInterval = setInterval(() => fetchData(), 5000);
    return () => clearInterval(healthInterval);
  }, []);
  
  const isCritical = resonanz?.system_zustand === 'KRITISCH';
  
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <CyberBackground isCritical={isCritical} />
      
      <div className={`absolute inset-0 transition-all duration-500 ${
        isCritical ? 'bg-red-950/20' : 'bg-black/40'
      }`} />
      
      <AnimatePresence>
        {showDriftFlash && (
          <motion.div
            className="fixed inset-0 bg-red-500 pointer-events-none z-50 mix-blend-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      
      <div className="relative z-10 p-8 space-y-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* SYNTX + LOGO + PULSE */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <motion.h1 
              className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-mono tracking-[0.3em]"
              animate={{
                textShadow: [
                  '0 0 20px rgba(6, 182, 212, 0.5)',
                  '0 0 40px rgba(6, 182, 212, 0.8)',
                  '0 0 20px rgba(6, 182, 212, 0.5)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              SYNTX
            </motion.h1>
            
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                filter: [
                  'drop-shadow(0 0 20px rgba(6, 182, 212, 0.6))',
                  'drop-shadow(0 0 40px rgba(6, 182, 212, 1))',
                  'drop-shadow(0 0 20px rgba(6, 182, 212, 0.6))',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Image 
                src="/Logo1.png" 
                alt="SYNTX" 
                width={100} 
                height={100}
                className="select-none"
              />
            </motion.div>
            
            <motion.h1 
              className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-mono tracking-[0.3em]"
              animate={{
                textShadow: [
                  '0 0 20px rgba(59, 130, 246, 0.5)',
                  '0 0 40px rgba(59, 130, 246, 0.8)',
                  '0 0 20px rgba(59, 130, 246, 0.5)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              PULSE
            </motion.h1>
          </div>
          
          <motion.p 
            className="text-gray-400 font-mono text-sm tracking-[0.5em] mb-6"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            SYSTEM NERVOUS SYSTEM MONITOR
          </motion.p>
          
          {/* Status Indicators */}
          <div className="flex items-center justify-center gap-4">
            <motion.div 
              className={`px-4 py-2 rounded-full border-2 ${
                isCritical ? 'border-red-500 bg-red-500/20' : 'border-cyan-500 bg-cyan-500/20'
              } backdrop-blur-sm`}
              animate={{ 
                opacity: [0.5, 1, 0.5],
                boxShadow: isCritical ? [
                  '0 0 10px rgba(239, 68, 68, 0.5)',
                  '0 0 25px rgba(239, 68, 68, 0.8)',
                  '0 0 10px rgba(239, 68, 68, 0.5)',
                ] : [
                  '0 0 10px rgba(6, 182, 212, 0.5)',
                  '0 0 25px rgba(6, 182, 212, 0.8)',
                  '0 0 10px rgba(6, 182, 212, 0.5)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className={`text-sm font-bold font-mono tracking-widest ${isCritical ? 'text-red-400' : 'text-cyan-400'}`}>
                {resonanz?.system_zustand || 'LOADING'}
              </span>
            </motion.div>
            
            <motion.div 
              className="px-4 py-2 rounded-full border-2 border-gray-700 bg-gray-900/50 backdrop-blur-sm"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                boxShadow: [
                  '0 0 10px rgba(107, 114, 128, 0.3)',
                  '0 0 20px rgba(107, 114, 128, 0.5)',
                  '0 0 10px rgba(107, 114, 128, 0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <span className="text-sm font-bold font-mono tracking-widest text-gray-400">
                API v{health?.api_version || '---'}
              </span>
            </motion.div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 flex justify-center">
            {health && queue && (
              <SystemCore
                system_zustand={resonanz?.system_zustand || 'UNKNOWN'}
                queue_incoming={queue?.queue?.incoming || 0}
                status={health.status}
              />
            )}
          </div>
          
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-cyan-400 mb-4 font-mono tracking-wider">RESONANZ FELDER</h3>
            {resonanz?.resonanz_felder && (
              <>
                <ResonanzCard
                  title="QUEUE"
                  value={`${resonanz.resonanz_felder.queue?.incoming || 0} / ${resonanz.resonanz_felder.queue?.processed || 0}`}
                  resonanz={resonanz.resonanz_felder.queue?.resonanz || 'UNKNOWN'}
                  icon={<Activity className="w-5 h-5 text-cyan-400" />}
                />
                <ResonanzCard
                  title="QUALITÄT"
                  value={`${resonanz.resonanz_felder.qualität?.durchschnitt?.toFixed(1) || 0}%`}
                  resonanz={resonanz.resonanz_felder.qualität?.resonanz || 'UNKNOWN'}
                  icon={<Zap className="w-5 h-5 text-yellow-400" />}
                />
                <ResonanzCard
                  title="EVOLUTION"
                  value={`Gen ${resonanz.resonanz_felder.evolution?.generationen || 0}`}
                  resonanz={resonanz.resonanz_felder.evolution?.resonanz || 'UNKNOWN'}
                  icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
                />
              </>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {queue?.queue && (
              <QueueTower
                incoming={queue.queue.incoming}
                processing={queue.queue.processing}
                processed={queue.queue.processed}
                errors={queue.queue.errors}
              />
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            {queue?.recent_completed && (
              <RecentJobs jobs={queue.recent_completed} />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
