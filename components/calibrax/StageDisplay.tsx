'use client';

import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface StageDisplayProps {
  title: string;
  emoji: string;
  color: string;
  content: string | React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  isCode?: boolean;
}

export function StageDisplay({
  title,
  emoji,
  color,
  content,
  expanded,
  onToggle,
  isCode = true,
}: StageDisplayProps) {
  const [copied, setCopied] = useState(false);

  const colorMap: Record<string, { border: string; bg: string; glow: string }> = {
    purple: {
      border: 'border-purple-500/30',
      bg: 'bg-purple-900/10',
      glow: 'shadow-purple-500/20',
    },
    blue: {
      border: 'border-blue-500/30',
      bg: 'bg-blue-900/10',
      glow: 'shadow-blue-500/20',
    },
    cyan: {
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-900/10',
      glow: 'shadow-cyan-500/20',
    },
    green: {
      border: 'border-green-500/30',
      bg: 'bg-green-900/10',
      glow: 'shadow-green-500/20',
    },
    yellow: {
      border: 'border-yellow-500/30',
      bg: 'bg-yellow-900/10',
      glow: 'shadow-yellow-500/20',
    },
  };

  const colors = colorMap[color] || colorMap.cyan;

  const handleCopy = async () => {
    if (typeof content === 'string') {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      className={`border rounded-xl overflow-hidden ${colors.border} ${colors.bg} shadow-lg ${colors.glow}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all group"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          <div className="text-left">
            <span className="text-lg font-bold text-white block">{title}</span>
            <span className="text-xs text-gray-500 font-mono">
              {expanded ? 'Click to collapse' : 'Click to expand'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {expanded && isCode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          )}
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
          )}
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-gray-700/50"
        >
          <div className="p-4">
            {isCode && typeof content === 'string' ? (
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-black/30 p-4 rounded-lg overflow-x-auto max-h-96 border border-gray-800">
                {content}
              </pre>
            ) : (
              content
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
