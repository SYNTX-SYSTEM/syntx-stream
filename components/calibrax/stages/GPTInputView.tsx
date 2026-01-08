'use client';

import { Copy, Check, Brain, Cpu, Target, TrendingUp, Sparkles, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CalibrationRun } from '@/types/calibrax';
import { DataCard } from '../ui/DataCard';
import { InfoRow } from '../ui/InfoRow';

interface GPTInputViewProps {
  run: CalibrationRun;
  onCopy: (text: string) => void;
  copied: boolean;
}

export function GPTInputView({ run, onCopy, copied }: GPTInputViewProps) {
  // Extract REAL category from wrapper name
  // "SYNTEX::TRUE_RAW Calibration" -> we need to check actual topics
  const extractCategory = (name: string): string => {
    if (name.includes('TRUE_RAW')) return 'true_raw';
    if (name.includes('Bildung') || name.includes('Chemie') || name.includes('Mathematik')) return 'bildung';
    if (name.includes('Migration') || name.includes('Gleichberechtigung')) return 'gesellschaft';
    if (name.includes('Astronomie') || name.includes('Yoga') || name.includes('Katzen')) return 'harmlos';
    if (name.includes('Waffen') || name.includes('Drogen')) return 'kritisch';
    if (name.includes('Militär') || name.includes('Selbstverteidigung')) return 'grenzwertig';
    return 'unknown';
  };
  
  const category = extractCategory(run.cron_data.name);
  
  return (
    <div className="space-y-4">
      {/* Neural Generation Strategy */}
      <div className="relative border-2 border-cyan-500/30 rounded-2xl p-6 bg-gradient-to-br from-blue-950/30 to-purple-950/30 overflow-hidden">
        {/* Neural connections background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            {[...Array(6)].map((_, i) => (
              <motion.circle
                key={`neuron-${i}`}
                cx={`${15 + i * 14}%`}
                cy="50%"
                r="3"
                fill="cyan"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
            {[...Array(5)].map((_, i) => (
              <motion.line
                key={`conn-${i}`}
                x1={`${15 + i * 14}%`}
                y1="50%"
                x2={`${15 + (i + 1) * 14}%`}
                y2="50%"
                stroke="cyan"
                strokeWidth="2"
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </svg>
        </div>

        <div className="relative space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-7 h-7 text-cyan-400" />
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              GPT-4 Neural Generation Strategy
            </h3>
          </div>

          {/* Parameters */}
          <motion.div 
            className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-4"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-bold text-blue-300">PARAMETERS</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Category:</span>
                <span className="text-blue-300 font-mono font-bold">{category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Model:</span>
                <span className="text-blue-300 font-mono">gpt-4o</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Temp:</span>
                <span className="text-blue-300 font-mono">0.7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tokens:</span>
                <span className="text-blue-300 font-mono">500</span>
              </div>
            </div>
          </motion.div>

          {/* Optimization */}
          <motion.div 
            className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-4"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-bold text-purple-300">OPTIMIZATION</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span className="text-gray-300">100% Field Completeness</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span className="text-gray-300">&gt;95% Structure Adherence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span className="text-gray-300">Erfolgreiche Patterns nutzen</span>
              </li>
            </ul>
          </motion.div>

          {/* Success Patterns */}
          <motion.div 
            className="bg-gradient-to-r from-green-900/30 to-cyan-900/30 border border-green-500/30 rounded-xl p-4"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm font-bold text-green-300">SUCCESS</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Score:</span>
                <motion.span 
                  className="text-green-400 font-mono font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  100.0/100
                </motion.span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Detection:</span>
                <span className="text-green-400 font-mono font-bold">100%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wrapper Config */}
      <DataCard title="Wrapper Config" icon="⚙️">
        <InfoRow label="Name" value={run.cron_data.name} />
        <InfoRow label="Model" value={run.cron_data.modell} />
        <InfoRow label="Fields" value={Object.keys(run.cron_data.felder).length.toString()} />
      </DataCard>

      {/* Field Weights */}
      <DataCard title="Field Weights" icon="⚖️">
        {Object.entries(run.cron_data.felder).map(([field, weight], i) => (
          <div key={field} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
            <span className="text-sm text-gray-400 font-mono">{field}</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(weight / Math.max(...Object.values(run.cron_data.felder))) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                />
              </div>
              <span className="text-sm text-cyan-400 font-mono font-bold w-6">{weight}</span>
            </div>
          </div>
        ))}
      </DataCard>

      {/* System Prompt */}
      <DataCard 
        title="System Prompt (Minimal!)" 
        icon="💎"
        action={
          <button onClick={() => onCopy(run.stages?.gpt_system_prompt || '')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </button>
        }
      >
        <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-2 border-purple-500/40 rounded-xl p-6 text-center relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="relative">
            <div className="text-xs text-purple-400 mb-2 font-mono">16 Zeichen • Pure Activation</div>
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-2">
              {run.stages?.gpt_system_prompt || 'SYNTEX::TRUE_RAW'}
            </div>
            <div className="text-xs text-gray-500 italic flex items-center justify-center gap-2">
              <Radio className="w-3 h-3" />
              <span>"Nur Felder, nur Ströme" 🌊</span>
            </div>
          </div>
        </div>
      </DataCard>

      {/* Full Prompt Text that was sent to GPT */}
      <DataCard 
        title="Complete Prompt sent to GPT-4" 
        icon="📜"
        action={
          <button onClick={() => onCopy(run.stages?.gpt_system_prompt || '')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </button>
        }
      >
        <div className="bg-black/40 rounded-xl p-4 border border-gray-800 max-h-96 overflow-y-auto">
          <div className="text-xs text-cyan-400 font-mono mb-3">SYSTEM PROMPT:</div>
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono mb-4 bg-purple-900/20 rounded p-3 border border-purple-500/20">
            {run.stages?.gpt_system_prompt || 'SYNTEX::TRUE_RAW'}
          </pre>
          
          <div className="text-xs text-cyan-400 font-mono mb-3 mt-4">USER PROMPT:</div>
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
            {`Basierend auf erfolgreichen Prompt-Patterns (Avg Score: 100.0/100, Field Completeness: 100.0%):

**ERFOLGREICHE PATTERNS:**
- Top-performende Categories: bildung, harmlos, gesellschaft
- Top-performende Styles: kreativ, akademisch, casual
- Beste Field Detection Rate: 100.0%

**DEINE AUFGABE:**
Erstelle einen Meta-Prompt zum Thema: "${run.cron_data.name}"

**OPTIMIERUNGS-KRITERIEN:**
1. Verwende Ansätze die in erfolgreichen Prompts funktioniert haben
2. Ziele auf 100% Field Completeness (alle SYNTX-Felder auslösbar)
3. Struktur klar und kohärent (>95% Structure Adherence)
4. Stil konsistent beibehalten

Der Prompt sollte ein Llama-Modell durch SYNTX-Wrapper zur semantischen Feldextraktion anregen können.`}
          </pre>
        </div>
      </DataCard>

      {/* Topic */}
      <DataCard 
        title="Generated Topic" 
        icon="📝"
        action={
          <button onClick={() => onCopy(`${run.cron_data.name}`)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </button>
        }
      >
        <div className="bg-black/40 rounded-xl p-4 border border-gray-800">
          <div className="mb-2">
            <span className="text-cyan-400 font-mono text-xs">Meta-Prompt zum Thema:</span>
          </div>
          <div className="text-lg text-white font-semibold mb-2">"{run.cron_data.name}"</div>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            <span>Fokus: {Object.keys(run.cron_data.felder).join(', ')}</span>
          </div>
        </div>
      </DataCard>
    </div>
  );
}
