'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { CalibrationRun } from '@/types/calibrax';
import { AnimatedStream } from './AnimatedStream';
import { NeuralBackground } from './NeuralBackground';
import { StageDetailModal } from './StageDetailModal';

interface StreamRowProps {
  run: CalibrationRun;
  index: number;
  onClick: () => void;
}

type StageType = 'metadata' | 'gpt-input' | 'gpt-output' | 'mistral-input' | 'mistral-output';

export function StreamRow({ run, index, onClick }: StreamRowProps) {
  const [selectedStage, setSelectedStage] = useState<StageType | null>(null);
  
  const time = new Date(run.timestamp).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const stages = [
    {
      id: 'metadata' as StageType,
      emoji: '📋',
      title: 'METADATA',
      color: 'purple',
      preview: (
        <>
          <div className="text-xs text-purple-300 font-mono mb-2">📋 METADATA</div>
          <div className="text-sm text-white font-semibold line-clamp-1 mb-1">{run.cron_data.name}</div>
          <div className="text-xs text-gray-400">{run.cron_data.modell} • {time}</div>
          <div className="text-xs text-purple-400 mt-1">{Object.keys(run.cron_data.felder).length} fields</div>
        </>
      ),
    },
    {
      id: 'gpt-input' as StageType,
      emoji: '🧠',
      title: 'GPT INPUT',
      color: 'blue',
      preview: (
        <>
          <div className="text-xs text-blue-300 font-mono mb-2">🧠 GPT INPUT</div>
          <div className="text-xs text-gray-300 line-clamp-3">
            {run.stages?.gpt_system_prompt?.substring(0, 90) || 'N/A'}...
          </div>
        </>
      ),
    },
    {
      id: 'gpt-output' as StageType,
      emoji: '✨',
      title: 'GPT OUTPUT',
      color: 'cyan',
      preview: (
        <>
          <div className="text-xs text-cyan-300 font-mono mb-2">✨ GPT OUTPUT</div>
          <div className="text-xs text-gray-300 line-clamp-3">
            {run.stages?.gpt_output_meta_prompt?.substring(0, 90) || 'N/A'}...
          </div>
        </>
      ),
    },
    {
      id: 'mistral-input' as StageType,
      emoji: '🔧',
      title: 'MISTRAL INPUT',
      color: 'green',
      preview: (
        <>
          <div className="text-xs text-green-300 font-mono mb-2">🔧 MISTRAL INPUT</div>
          <div className="text-xs text-gray-300 line-clamp-3">
            {run.stages?.mistral_input?.substring(0, 90) || 'N/A'}...
          </div>
        </>
      ),
    },
    {
      id: 'mistral-output' as StageType,
      emoji: '🌊',
      title: 'MISTRAL OUTPUT',
      color: 'yellow',
      preview: (
        <>
          <div className="text-xs text-yellow-300 font-mono mb-2">🌊 MISTRAL OUTPUT</div>
          <div className="text-xs text-gray-300 line-clamp-2 mb-2">
            {run.stages?.mistral_output?.substring(0, 70) || 'N/A'}...
          </div>
          <div className="flex items-center gap-2">
            <Badge label="Q" value={run.result.avg_quality} />
            <Badge label="D" value={`${(run.result.drift * 100).toFixed(0)}%`} />
          </div>
        </>
      ),
    },
  ];

  const handleStageClick = (e: React.MouseEvent, stageId: StageType) => {
    e.stopPropagation();
    setSelectedStage(stageId);
  };

  return (
    <>
      <motion.div
        className="relative flex items-center gap-3 group"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
      >
        {/* Neural Background */}
        <NeuralBackground quality={run.result.avg_quality} />

        {stages.map((stage, i) => (
          <div key={stage.id} className="flex items-center gap-3">
            <StageBox
              color={stage.color}
              onClick={(e) => handleStageClick(e, stage.id)}
            >
              {stage.preview}
            </StageBox>
            
            {i < stages.length - 1 && (
              <AnimatedStream quality={run.result.avg_quality} />
            )}
          </div>
        ))}
      </motion.div>

      {/* Stage Detail Modal */}
      {selectedStage && (
        <StageDetailModal
          isOpen={selectedStage !== null}
          onClose={() => setSelectedStage(null)}
          stage={selectedStage}
          run={run}
        />
      )}
    </>
  );
}

function StageBox({ color, onClick, children }: { 
  color: string;
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}) {
  const colorMap: Record<string, string> = {
    purple: 'border-purple-500/30 bg-purple-900/10 hover:border-purple-500/60 hover:bg-purple-900/20',
    blue: 'border-blue-500/30 bg-blue-900/10 hover:border-blue-500/60 hover:bg-blue-900/20',
    cyan: 'border-cyan-500/30 bg-cyan-900/10 hover:border-cyan-500/60 hover:bg-cyan-900/20',
    green: 'border-green-500/30 bg-green-900/10 hover:border-green-500/60 hover:bg-green-900/20',
    yellow: 'border-yellow-500/30 bg-yellow-900/10 hover:border-yellow-500/60 hover:bg-yellow-900/20',
  };

  return (
    <motion.div
      className={`relative border rounded-xl p-3 min-w-[180px] flex-1 ${colorMap[color]} cursor-pointer transition-all`}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
    >
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

function Badge({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="px-2 py-0.5 bg-black/30 border border-gray-700 rounded text-xs font-mono">
      <span className="text-gray-500">{label}:</span>
      <span className="text-white font-bold ml-1">{value}</span>
    </div>
  );
}
