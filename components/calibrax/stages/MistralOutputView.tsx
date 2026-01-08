'use client';

import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CalibrationRun } from '@/types/calibrax';
import { DataCard } from '../ui/DataCard';

interface MistralOutputViewProps {
  run: CalibrationRun;
  onCopy: (text: string) => void;
  copied: boolean;
}

export function MistralOutputView({ run, onCopy, copied }: MistralOutputViewProps) {
  return (
    <div className="space-y-4">
      <DataCard 
        title="Full Response" 
        icon="🌊" 
        action={
          <button onClick={() => onCopy(run.stages?.mistral_output || '')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </button>
        }
      >
        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed bg-black/30 rounded-lg p-4 border border-gray-800 max-h-64 overflow-y-auto">
          {run.stages?.mistral_output || 'No output available'}
        </pre>
      </DataCard>
      
      <DataCard title="Parsed SYNTX Fields" icon="💎">
        {run.stages?.parsed_fields && Object.entries(run.stages.parsed_fields).map(([field, content]) => (
          <div key={field} className="mb-4 last:mb-0">
            <div className="text-xs text-cyan-400 font-mono uppercase mb-2 flex items-center gap-2">
              <motion.div 
                className="w-2 h-2 rounded-full bg-cyan-400"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {field}:
            </div>
            <div className="text-sm text-gray-300 bg-black/30 rounded-lg p-3 border border-gray-800">
              {content || <span className="text-gray-600 italic">Empty</span>}
            </div>
          </div>
        ))}
      </DataCard>
    </div>
  );
}
