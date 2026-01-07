'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Clock, Zap, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import type { CalibrationRun } from '@/types/calibrax';

interface StageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: 'metadata' | 'gpt-input' | 'gpt-output' | 'mistral-input' | 'mistral-output';
  run: CalibrationRun;
}

export function StageDetailModal({ isOpen, onClose, stage, run }: StageDetailModalProps) {
  const [copied, setCopied] = useState(false);

  const stageConfig = {
    'metadata': { title: 'METADATA', emoji: '📋', color: 'purple' },
    'gpt-input': { title: 'GPT INPUT', emoji: '🧠', color: 'blue' },
    'gpt-output': { title: 'GPT OUTPUT', emoji: '✨', color: 'cyan' },
    'mistral-input': { title: 'MISTRAL INPUT', emoji: '🔧', color: 'green' },
    'mistral-output': { title: 'MISTRAL OUTPUT', emoji: '🌊', color: 'yellow' },
  };

  const config = stageConfig[stage];
  const timestamp = new Date(run.timestamp).toLocaleString('de-DE');

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl">
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)`,
                  backgroundSize: '50px 50px',
                }}
              />
            </div>
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{ y: [0, -50, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }}
              />
            ))}
          </motion.div>

          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 pointer-events-none overflow-y-auto">
            <motion.div
              className="relative max-w-6xl w-full pointer-events-auto"
              initial={{ scale: 0.9, opacity: 0, y: -30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -30 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl animate-pulse" />
              
              <div className="relative bg-gray-950 border-2 border-cyan-500/30 rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

                <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 border-b-2 border-cyan-900/50 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <motion.div initial={{ rotate: -10 }} animate={{ rotate: 0 }} className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-xl blur-md" />
                        <div className="relative">
                          <Image src="/Logo1.png" alt="SYNTX" width={64} height={64} className="rounded-lg" />
                        </div>
                      </motion.div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-5xl">{config.emoji}</span>
                          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                            {config.title}
                          </h2>
                        </div>
                        <p className="text-sm text-gray-500 font-mono">Full Pipeline Stage • {timestamp}</p>
                      </div>
                    </div>
                    <motion.button
                      onClick={onClose}
                      className="p-3 hover:bg-red-500/20 rounded-xl transition-colors border-2 border-red-500/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-6 h-6 text-red-400" />
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    <CyberStatCard icon={<Clock className="w-5 h-5" />} label="Timestamp" value={timestamp} color="blue" />
                    <CyberStatCard icon={<Zap className="w-5 h-5" />} label="Duration" value={`${(run.result.duration_ms / 1000).toFixed(2)}s`} color="yellow" />
                    <CyberStatCard icon={<DollarSign className="w-5 h-5" />} label="Cost" value={`$${run.result.cost.toFixed(4)}`} color="green" />
                    <CyberStatCard icon={<CheckCircle className="w-5 h-5" />} label="Quality" value={run.result.avg_quality.toString()} color="cyan" />
                    <CyberStatCard icon={<AlertCircle className="w-5 h-5" />} label="Drift" value={`${(run.result.drift * 100).toFixed(1)}%`} color="purple" />
                  </div>
                </div>

                <div className="p-6 max-h-[65vh] overflow-y-auto bg-gray-950">
                  {stage === 'metadata' && <MetadataView run={run} onCopy={handleCopy} copied={copied} />}
                  {stage === 'gpt-input' && <GPTInputView run={run} onCopy={handleCopy} copied={copied} />}
                  {stage === 'gpt-output' && <TextContentView title="Generated Meta-Prompt" content={run.stages?.gpt_output_meta_prompt} onCopy={handleCopy} copied={copied} />}
                  {stage === 'mistral-input' && <TextContentView title="Wrapped Prompt" content={run.stages?.mistral_input} onCopy={handleCopy} copied={copied} />}
                  {stage === 'mistral-output' && <MistralOutputView run={run} onCopy={handleCopy} copied={copied} />}
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function CyberStatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
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

function MetadataView({ run, onCopy, copied }: { run: CalibrationRun; onCopy: (text: string) => void; copied: boolean }) {
  return (
    <div className="space-y-4">
      <DataCard title="Calibration Info" icon="📋">
        <InfoRow label="Name" value={run.cron_data.name} />
        <InfoRow label="Model" value={run.cron_data.modell} />
        <InfoRow label="Prompts" value={run.cron_data.anzahl.toString()} />
        <InfoRow label="Cron ID" value={run.cron_id} />
      </DataCard>
      <DataCard title="Field Weights" icon="⚖️">
        {Object.entries(run.cron_data.felder).map(([field, weight]) => (
          <InfoRow key={field} label={field} value={weight.toString()} />
        ))}
      </DataCard>
      <DataCard title="Result Stats" icon="📊">
        <InfoRow label="Generated" value={run.result.generated.toString()} />
        <InfoRow label="Failed" value={run.result.failed.toString()} />
        <InfoRow label="Status" value={run.result.status} />
      </DataCard>
    </div>
  );
}

function GPTInputView({ run, onCopy, copied }: { run: CalibrationRun; onCopy: (text: string) => void; copied: boolean }) {
  return (
    <div className="space-y-4">
      <DataCard title="Wrapper Configuration" icon="⚙️">
        <InfoRow label="Name" value={run.cron_data.name} />
        <InfoRow label="Model" value={run.cron_data.modell} />
        <InfoRow label="Total Prompts" value={run.cron_data.anzahl.toString()} />
        <InfoRow label="Field Count" value={Object.keys(run.cron_data.felder).length.toString()} />
      </DataCard>

      <DataCard title="Field Weights (Wrapper Config)" icon="⚖️">
        {Object.entries(run.cron_data.felder).map(([field, weight]) => (
          <div key={field} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
            <span className="text-sm text-gray-400 font-mono">{field}</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(weight / Math.max(...Object.values(run.cron_data.felder))) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
              </div>
              <span className="text-sm text-cyan-400 font-mono font-bold w-8">{weight}</span>
            </div>
          </div>
        ))}
      </DataCard>

      <DataCard title="GPT System Prompt (Full Text)" icon="📄" action={
        <button onClick={() => onCopy(run.stages?.gpt_system_prompt || '')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
        </button>
      }>
        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed bg-black/30 rounded-lg p-4 border border-gray-800">
          {run.stages?.gpt_system_prompt || 'No system prompt available'}
        </pre>
      </DataCard>
    </div>
  );
}

function TextContentView({ title, content, onCopy, copied }: { title: string; content?: string; onCopy: (text: string) => void; copied: boolean }) {
  return (
    <DataCard title={title} icon="📄" action={
      <button onClick={() => onCopy(content || '')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
      </button>
    }>
      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed bg-black/30 rounded-lg p-4 border border-gray-800">
        {content || 'No content available'}
      </pre>
    </DataCard>
  );
}

function MistralOutputView({ run, onCopy, copied }: { run: CalibrationRun; onCopy: (text: string) => void; copied: boolean }) {
  return (
    <div className="space-y-4">
      <DataCard title="Full Response" icon="🌊" action={
        <button onClick={() => onCopy(run.stages?.mistral_output || '')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
        </button>
      }>
        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed bg-black/30 rounded-lg p-4 border border-gray-800 max-h-64 overflow-y-auto">
          {run.stages?.mistral_output || 'No output available'}
        </pre>
      </DataCard>
      <DataCard title="Parsed SYNTX Fields" icon="💎">
        {run.stages?.parsed_fields && Object.entries(run.stages.parsed_fields).map(([field, content]) => (
          <div key={field} className="mb-3 last:mb-0">
            <div className="text-xs text-cyan-400 font-mono uppercase mb-1">{field}:</div>
            <div className="text-sm text-gray-300 bg-black/30 rounded p-2 border border-gray-800">
              {content || <span className="text-gray-600 italic">Empty</span>}
            </div>
          </div>
        ))}
      </DataCard>
    </div>
  );
}

function DataCard({ title, icon, children, action }: { title: string; icon: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="border-2 border-cyan-500/20 rounded-xl p-5 bg-gradient-to-br from-gray-900/50 to-gray-950/50 relative overflow-hidden">
      <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 3, repeat: Infinity }} />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <h3 className="text-lg font-bold text-cyan-400">{title}</h3>
          </div>
          {action}
        </div>
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
      <span className="text-sm text-gray-500 font-mono">{label}</span>
      <span className="text-sm text-white font-mono">{value}</span>
    </div>
  );
}
