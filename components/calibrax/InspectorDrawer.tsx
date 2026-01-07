'use client';

import { useState } from 'react';
import { CyberModal } from '@/components/ui/CyberModal';
import { StageDisplay } from './StageDisplay';
import { ScoreTag } from './ScoreTag';
import type { CalibrationRun } from '@/types/calibrax';

interface InspectorDrawerProps {
  run: CalibrationRun | null;
  onClose: () => void;
}

export function InspectorDrawer({ run, onClose }: InspectorDrawerProps) {
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({
    gpt_system: true,
    gpt_output: true,
    mistral_input: false,
    mistral_output: false,
    parsed_fields: true,
  });

  if (!run) return null;

  const timestamp = new Date(run.timestamp).toLocaleString('de-DE');

  const toggleStage = (stage: string) => {
    setExpandedStages(prev => ({ ...prev, [stage]: !prev[stage] }));
  };

  return (
    <CyberModal
      isOpen={!!run}
      onClose={onClose}
      title="🔱 CALIBRATION INSPECTOR"
      subtitle={`${run.cron_id} • ${timestamp}`}
      width="full"
      showLogo={true}
    >
      {/* Scores Section */}
      <div className="mb-6">
        <ScoreTag
          quality={run.result.avg_quality}
          drift={run.result.drift}
          status={run.result.status}
        />
      </div>

      {/* Config Info */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <InfoCard label="Model" value={run.cron_data.modell} />
        <InfoCard label="Fields" value={Object.keys(run.cron_data.felder).length.toString()} />
        <InfoCard label="Prompts" value={run.cron_data.anzahl.toString()} />
      </div>

      {/* 5 STAGES */}
      <div className="space-y-4">
        {/* Stage 1: GPT System Prompt */}
        <StageDisplay
          title="Stage 1: GPT System Prompt"
          emoji="🧠"
          color="purple"
          content={run.stages?.gpt_system_prompt || 'No system prompt available'}
          expanded={expandedStages.gpt_system}
          onToggle={() => toggleStage('gpt_system')}
          isCode={true}
        />

        {/* Stage 2: GPT Output (Meta-Prompt) */}
        <StageDisplay
          title="Stage 2: GPT Output (Meta-Prompt)"
          emoji="✨"
          color="blue"
          content={run.stages?.gpt_output_meta_prompt || 'No meta-prompt available'}
          expanded={expandedStages.gpt_output}
          onToggle={() => toggleStage('gpt_output')}
          isCode={true}
        />

        {/* Stage 3: Mistral Input (Wrapped) */}
        <StageDisplay
          title="Stage 3: Mistral Input (Wrapped Prompt)"
          emoji="🔧"
          color="cyan"
          content={run.stages?.mistral_input || 'No mistral input available'}
          expanded={expandedStages.mistral_input}
          onToggle={() => toggleStage('mistral_input')}
          isCode={true}
        />

        {/* Stage 4: Mistral Output (Full Response) */}
        <StageDisplay
          title="Stage 4: Mistral Output (Full Response)"
          emoji="🌊"
          color="green"
          content={run.stages?.mistral_output || 'No mistral output available'}
          expanded={expandedStages.mistral_output}
          onToggle={() => toggleStage('mistral_output')}
          isCode={true}
        />

        {/* Stage 5: Parsed SYNTX Fields */}
        <StageDisplay
          title="Stage 5: Parsed SYNTX Fields"
          emoji="💎"
          color="yellow"
          content={
            run.stages?.parsed_fields ? (
              <div className="space-y-3">
                {Object.entries(run.stages.parsed_fields).map(([field, content]) => (
                  <FieldDisplay key={field} name={field} content={content || ''} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No parsed fields available</p>
            )
          }
          expanded={expandedStages.parsed_fields}
          onToggle={() => toggleStage('parsed_fields')}
          isCode={false}
        />
      </div>

      {/* Result Stats */}
      <div className="grid grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-800">
        <StatCard label="Generated" value={run.result.generated.toString()} color="green" />
        <StatCard label="Failed" value={run.result.failed.toString()} color="red" />
        <StatCard label="Duration" value={`${(run.result.duration_ms / 1000).toFixed(2)}s`} color="blue" />
        <StatCard label="Cost" value={`$${run.result.cost.toFixed(4)}`} color="yellow" />
      </div>
    </CyberModal>
  );
}

// Info Card Component
function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{label}</p>
      <p className="text-lg font-mono text-cyan-400">{value}</p>
    </div>
  );
}

// Field Display Component
function FieldDisplay({ name, content }: { name: string; content: string }) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-cyan-500/30 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{name}</span>
      </div>
      <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
        {content || <span className="text-gray-600 italic">Empty</span>}
      </p>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    green: 'border-green-500/30 bg-green-900/10',
    red: 'border-red-500/30 bg-red-900/10',
    blue: 'border-blue-500/30 bg-blue-900/10',
    yellow: 'border-yellow-500/30 bg-yellow-900/10',
  };

  return (
    <div className={`border rounded-lg p-3 ${colorMap[color] || colorMap.blue}`}>
      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{label}</p>
      <p className="text-base font-mono text-white">{value}</p>
    </div>
  );
}
