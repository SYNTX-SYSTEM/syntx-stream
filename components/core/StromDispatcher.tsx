'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { SyntxAPI } from '@/lib/syntx-api';
import { Zap, CheckCircle, XCircle } from 'lucide-react';

export function StromDispatcher() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const dispatchStrom = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await SyntxAPI.dispatchStrom({
        felder_topics: { 
          'Quantencomputer': 1.0,
          'Künstliche Intelligenz': 0.7
        },
        felder_styles: { 
          'technisch': 1.0 
        },
        strom_anzahl: 3,
        sprachen: ['de']
      });
      
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Strom-Dispatch failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-8 bg-slate-900 rounded-lg border-2 border-cyan-500/20">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
          🌊 STROM ORCHESTRATOR
        </h2>
        <p className="text-gray-400 mt-2">
          Dispatche kohärente Prompt-Ströme ins System
        </p>
      </div>
      
      {/* Dispatch Button */}
      <motion.button
        className={`w-full py-6 rounded-lg font-bold text-xl relative overflow-hidden
                    ${loading ? 'cursor-wait' : 'cursor-pointer'}
                    ${error ? 'bg-gradient-to-r from-red-500 to-red-700' : 'bg-gradient-to-r from-cyan-500 to-blue-600'}`}
        whileHover={!loading ? { scale: 1.02 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        onClick={dispatchStrom}
        disabled={loading}
      >
        {/* Animated Background */}
        {loading && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: [-200, 800],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}
        
        {/* Button Content */}
        <div className="relative z-10 flex items-center justify-center space-x-3">
          {loading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-6 h-6" />
            </motion.div>
          )}
          <span>
            {loading ? '⚡ STRÖME FLIESSEN...' : 
             error ? '❌ DRIFT ERKANNT' :
             result ? '✓ STRÖME ERZEUGT' :
             '🌊 STROM DISPATCHEN'}
          </span>
        </div>
      </motion.button>
      
      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 space-y-4"
          >
            {/* Summary */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
                <div className="text-green-400 text-sm">ERFOLG</div>
                <div className="text-2xl font-bold text-white">{result.erfolg}</div>
              </div>
              <div className="bg-red-500/20 p-4 rounded-lg border border-red-500/30">
                <div className="text-red-400 text-sm">FEHLER</div>
                <div className="text-2xl font-bold text-white">{result.fehlgeschlagen}</div>
              </div>
              <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                <div className="text-blue-400 text-sm">KOSTEN</div>
                <div className="text-2xl font-bold text-white">${result.kosten_usd}</div>
              </div>
              <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
                <div className="text-purple-400 text-sm">STRÖME</div>
                <div className="text-2xl font-bold text-white">{result.anzahl}</div>
              </div>
            </div>
            
            {/* Ströme List */}
            <div className="space-y-3">
              {result.stroeme?.map((strom: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-800 p-4 rounded-lg border border-cyan-500/20"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-cyan-400 font-bold">{strom.topic}</div>
                      <div className="text-gray-400 text-sm">{strom.style} · {strom.sprache}</div>
                    </div>
                    {strom.erfolg ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  
                  {strom.strom_text && (
                    <div className="text-sm text-gray-300 mb-2">
                      {strom.strom_text}
                    </div>
                  )}
                  
                  {strom.erfolg && (
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div>Score: <span className="text-green-400">{strom.qualitaet}</span></div>
                      <div>Cost: <span className="text-blue-400">${strom.kosten}</span></div>
                      <div>Time: <span className="text-purple-400">{strom.dauer_ms}ms</span></div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}
