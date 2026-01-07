'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { CalibrationRun } from '@/types/calibrax';

interface StreamBlockProps {
  run: CalibrationRun;
  index: number;
  onClick: () => void;
}

export function StreamBlock({ run, index, onClick }: StreamBlockProps) {
  return (
    <motion.div
      className="flex items-center gap-4 p-6 bg-gray-900/30 rounded-2xl border border-gray-800 hover:border-cyan-500/30 transition-colors cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
    >
      {/* Stage 1: GPT System */}
      <StageNode
        emoji="🧠"
        title="GPT System"
        content={run.stages?.gpt_system_prompt?.substring(0, 20) + '...' || 'N/A'}
        color="purple"
      />
      
      <Arrow />
      
      {/* Stage 2: GPT Output */}
      <StageNode
        emoji="✨"
        title="Meta-Prompt"
        content={run.stages?.gpt_output_meta_prompt?.substring(0, 30) + '...' || 'N/A'}
        color="blue"
      />
      
      <Arrow />
      
      {/* Stage 3: Mistral Input */}
      <StageNode
        emoji="🔧"
        title="Wrapped"
        content={run.stages?.mistral_input?.substring(0, 30) + '...' || 'N/A'}
        color="cyan"
      />
      
      <Arrow />
      
      {/* Stage 4: Mistral Output */}
      <StageNode
        emoji="🌊"
        title="Response"
        content={run.stages?.mistral_output?.substring(0, 30) + '...' || 'N/A'}
        color="green"
      />
      
      <Arrow />
      
      {/* Stage 5: Parsed Fields */}
      <StageNode
        emoji="💎"
        title="Parsed"
        content={`${Object.keys(run.stages?.parsed_fields || {}).length} fields`}
        color="yellow"
      />
      
      {/* Score Badge */}
      <div className="ml-auto">
        <ScoreBadge quality={run.result.avg_quality} drift={run.result.drift} />
      </div>
    </motion.div>
  );
}

function StageNode({ emoji, title, content, color }: {
  emoji: string;
  title: string;
  content: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    purple: 'border-purple-500/30 bg-purple-900/10',
    blue: 'border-blue-500/30 bg-blue-900/10',
    cyan: 'border-cyan-500/30 bg-cyan-900/10',
    green: 'border-green-500/30 bg-green-900/10',
    yellow: 'border-yellow-500/30 bg-yellow-900/10',
  };

  return (
    <div className={`border rounded-lg p-3 min-w-[140px] ${colorMap[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{emoji}</span>
        <span className="text-xs text-gray-400 font-mono">{title}</span>
      </div>
      <p className="text-sm text-gray-300 truncate">{content}</p>
    </div>
  );
}

function Arrow() {
  return (
    <ArrowRight className="w-5 h-5 text-cyan-400/50 flex-shrink-0" />
  );
}

function ScoreBadge({ quality, drift }: { quality: number; drift: number }) {
  const driftColor = drift < 0.1 ? 'text-green-400' : drift < 0.2 ? 'text-yellow-400' : 'text-red-400';
  
  return (
    <div className="flex items-center gap-3">
      <div className="text-center">
        <p className="text-xs text-gray-500">Quality</p>
        <p className="text-lg font-bold text-cyan-400">{quality}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-500">Drift</p>
        <p className={`text-lg font-bold ${driftColor}`}>{(drift * 100).toFixed(1)}%</p>
      </div>
    </div>
  );
}
