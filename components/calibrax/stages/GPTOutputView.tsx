'use client';

import { Copy, Check } from 'lucide-react';
import type { CalibrationRun } from '@/types/calibrax';
import { DataCard } from '../ui/DataCard';

interface GPTOutputViewProps {
  run: CalibrationRun;
  onCopy: (text: string) => void;
  copied: boolean;
}

export function GPTOutputView({ run, onCopy, copied }: GPTOutputViewProps) {
  return (
    <DataCard 
      title="Generated Meta-Prompt" 
      icon="📄" 
      action={
        <button onClick={() => onCopy(run.stages?.gpt_output_meta_prompt || '')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
        </button>
      }
    >
      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed bg-black/30 rounded-lg p-4 border border-gray-800 max-h-96 overflow-y-auto">
        {run.stages?.gpt_output_meta_prompt || 'No content available'}
      </pre>
    </DataCard>
  );
}
