'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Brain, Clock, Globe, Dna, Save, Calendar, Edit3 } from 'lucide-react';
import { useCronStreamStore } from '@/lib/stores/cron-stream-store';
import type { StromConfig, StromUpdateData } from '@/types/strom';
import { NeuroResultDisplay } from '@/components/birth-field';

interface StreamEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  stream: StromConfig | null;
}

const DAYS = [
  { key: 1, label: 'Mo', full: 'Monday', color: 'cyan' },
  { key: 2, label: 'Di', full: 'Tuesday', color: 'blue' },
  { key: 3, label: 'Mi', full: 'Wednesday', color: 'purple' },
  { key: 4, label: 'Do', full: 'Thursday', color: 'pink' },
  { key: 5, label: 'Fr', full: 'Friday', color: 'cyan' },
  { key: 6, label: 'Sa', full: 'Saturday', color: 'green' },
  { key: 0, label: 'So', full: 'Sunday', color: 'red' },
];

export function StreamEditModal({ isOpen, onClose, stream }: StreamEditModalProps) {
  const { updateStream } = useCronStreamStore();
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultSuccess, setResultSuccess] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  
  const [name, setName] = useState('');
  const [modell, setModell] = useState('gpt-4o');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);
  const [sprachen, setSprachen] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);

  // FIXED CRON PARSER - handles ranges like "1-5"
  const parseCron = (cron: string) => {
    const parts = cron.split(' ');
    if (parts.length >= 5) {
      const min = parseInt(parts[0]) || 0;
      const hr = parseInt(parts[1]) || 8;
      const dayStr = parts[4];
      
      let days: number[] = [];
      
      // All days
      if (dayStr === '*') {
        days = [0, 1, 2, 3, 4, 5, 6];
      } 
      // Range like "1-5"
      else if (dayStr.includes('-')) {
        const [start, end] = dayStr.split('-').map(d => parseInt(d));
        for (let i = start; i <= end; i++) {
          days.push(i);
        }
      }
      // Comma-separated like "1,3,5"
      else if (dayStr.includes(',')) {
        days = dayStr.split(',').map(d => parseInt(d));
      }
      // Single day
      else {
        days = [parseInt(dayStr)];
      }
      
      return { minute: min, hour: hr, days };
    }
    return { minute: 0, hour: 8, days: [1, 2, 3, 4, 5] };
  };

  useEffect(() => {
    if (stream) {
      setName(stream.name);
      setModell(stream.modell);
      setSprachen(stream.sprachen || ['de']);
      setStyles(stream.styles || ['technisch']);
      
      const { minute: min, hour: hr, days } = parseCron(stream.zeitplan);
      setMinute(min);
      setHour(hr);
      setSelectedDays(days);
    }
  }, [stream]);

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const toggleLanguage = (lang: string) => {
    setSprachen(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const toggleStyle = (style: string) => {
    setStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const generateCron = () => {
    const dayStr = selectedDays.length === 7 ? '*' : selectedDays.join(',');
    return `${minute} ${hour} * * ${dayStr}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stream) return;
    
    setLoading(true);
    
    try {
      const formData: StromUpdateData = {
        name,
        muster: stream.muster,
        zeitplan: generateCron(),
        modell,
        felder_topics: stream.felder_topics || { systemstruktur: 0.7, humansprache: 0.5 },
        styles,
        sprachen,
        aktiv: stream.aktiv,
      };
      
      const result = await updateStream(stream.strom_id, formData);
      
      setResultSuccess(result.success);
      setResultMessage(result.message);
      setShowResult(true);
      
    } catch (error) {
      setResultSuccess(false);
      setResultMessage((error as Error).message);
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClose = () => {
    setShowResult(false);
    if (resultSuccess) {
      onClose();
    }
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    if (!isSelected) {
      return 'bg-slate-900/30 border-slate-700 text-slate-500 hover:border-slate-600';
    }
    
    const colors = {
      cyan: 'bg-gradient-to-br from-cyan-500/40 to-cyan-600/40 border-cyan-400 text-cyan-200 shadow-cyan-500/50',
      blue: 'bg-gradient-to-br from-blue-500/40 to-blue-600/40 border-blue-400 text-blue-200 shadow-blue-500/50',
      purple: 'bg-gradient-to-br from-purple-500/40 to-purple-600/40 border-purple-400 text-purple-200 shadow-purple-500/50',
      pink: 'bg-gradient-to-br from-pink-500/40 to-pink-600/40 border-pink-400 text-pink-200 shadow-pink-500/50',
      green: 'bg-gradient-to-br from-green-500/40 to-green-600/40 border-green-400 text-green-200 shadow-green-500/50',
      red: 'bg-gradient-to-br from-red-500/40 to-red-600/40 border-red-400 text-red-200 shadow-red-500/50',
    };
    
    return colors[color as keyof typeof colors] || colors.cyan;
  };

  if (!stream) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-slate-950/95 rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-4 p-6 border-b border-slate-800">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Edit3 className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-purple-400">Edit Neural Stream</h2>
                  <p className="text-sm text-slate-400">Recalibrate field resonance flow</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Stream Identity */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-purple-400 mb-2">
                    <Brain className="w-4 h-4" />
                    STREAM IDENTITY
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Model */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-purple-400 mb-2">
                    <Zap className="w-4 h-4" />
                    MODEL
                  </label>
                  <select
                    value={modell}
                    onChange={(e) => setModell(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="claude-sonnet-4">Claude Sonnet 4</option>
                  </select>
                </div>

                {/* Temporal Matrix */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-purple-400 mb-3">
                    <Calendar className="w-4 h-4" />
                    TEMPORAL MATRIX
                  </label>
                  
                  {/* Days */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {DAYS.map((day) => (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => toggleDay(day.key)}
                        className={`aspect-square rounded-xl border-2 font-bold text-sm transition-all ${getColorClasses(
                          day.color,
                          selectedDays.includes(day.key)
                        )}`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>

                  {/* Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Hour</label>
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={hour}
                        onChange={(e) => setHour(parseInt(e.target.value))}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Minute</label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={minute}
                        onChange={(e) => setMinute(parseInt(e.target.value))}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-slate-500 font-mono">
                    Cron: {generateCron()}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-purple-400 mb-2">
                    <Globe className="w-4 h-4" />
                    LANGUAGE RESONANCE
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {['DE', 'EN', 'ES', 'FR'].map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang.toLowerCase())}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                          sprachen.includes(lang.toLowerCase())
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Styles */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-purple-400 mb-2">
                    <Dna className="w-4 h-4" />
                    STYLE ALCHEMY
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {['technisch', 'akademisch', 'literarisch', 'poetisch'].map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => toggleStyle(style)}
                        className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                          styles.includes(style)
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 font-bold flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {loading ? 'Updating...' : 'Update Stream'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <NeuroResultDisplay
        show={showResult}
        success={resultSuccess}
        operation="update"
        streamName={stream?.name}
        message={resultMessage}
        onClose={handleResultClose}
      />
    </>
  );
}
