'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Sparkles, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

interface InsightModalProps {
  log: {
    timestamp: string;
    cron_data: {
      name: string;
      modell: string;
      felder: Record<string, number>;
    };
    stages: {
      parsed_fields: Record<string, string | null>;
      gpt_output_meta_prompt?: string;
    };
    scores: {
      overall: number;
      field_completeness: number;
      structure_adherence: number;
    };
    meta: {
      duration_ms: number;
      retry_count: number;
      success: boolean;
    };
  } | null;
  onClose: () => void;
}

export function InsightModal({ log, onClose }: InsightModalProps) {
  if (!log) return null;

  const duration = (log.meta.duration_ms / 1000).toFixed(1);
  const allFields = Object.keys(log.cron_data.felder);
  const parsedFields = Object.keys(log.stages.parsed_fields).filter(
    key => log.stages.parsed_fields[key] !== null
  );
  const extractionRate = (parsedFields.length / allFields.length) * 100;

  // Get prompt topic safely
  const promptTopic = log.stages.gpt_output_meta_prompt?.split('.')[0] || 'ein Thema';

  // Generate insights
  const getScoreInsight = (score: number) => {
    if (score >= 90) return { 
      icon: Sparkles, 
      text: 'EXCELLENT', 
      color: '#22c55e',
      desc: 'Die AI hat nahezu perfekt gearbeitet. Alle semantischen Strukturen wurden erkannt und korrekt extrahiert.'
    };
    if (score >= 70) return { 
      icon: TrendingUp, 
      text: 'GOOD', 
      color: '#06b6d4',
      desc: 'Solide Leistung. Die AI versteht die Aufgabe und liefert brauchbare Ergebnisse mit kleinen Unschärfen.'
    };
    if (score >= 50) return { 
      icon: Minus, 
      text: 'MODERATE', 
      color: '#eab308',
      desc: 'Mittelmäßige Kalibrierung. Die AI driftet leicht – manche Felder werden nicht korrekt erkannt oder interpretiert.'
    };
    return { 
      icon: TrendingDown, 
      text: 'POOR', 
      color: '#ef4444',
      desc: 'Schwache Leistung. Die AI ist am Driften – semantische Strukturen werden nicht oder falsch erkannt. Recalibration nötig.'
    };
  };

  const overallInsight = getScoreInsight(log.scores.overall);
  const Icon = overallInsight.icon;

  // Model color
  const getModelColor = () => {
    if (log.cron_data.modell.includes('gpt')) return { main: '#06b6d4', rgb: 'rgba(6,182,212' };
    if (log.cron_data.modell.includes('mistral')) return { main: '#a855f7', rgb: 'rgba(168,85,247' };
    if (log.cron_data.modell.includes('claude')) return { main: '#ec4899', rgb: 'rgba(236,72,153' };
    return { main: '#00ffff', rgb: 'rgba(0,255,255' };
  };

  const color = getModelColor();

  // Story generation
  const getStory = () => {
    const stories = [];

    // Opening
    stories.push({
      title: 'Was ist hier passiert?',
      text: `Am ${new Date(log.timestamp).toLocaleDateString()} um ${new Date(log.timestamp).toLocaleTimeString()} wurde **${log.cron_data.modell}** mit einem Kalibrierungs-Test konfrontiert. Das Ziel: Prüfen, ob die AI noch semantisch stabil ist – oder ob sie driftet.`
    });

    // The test
    stories.push({
      title: 'Der Test',
      text: `Die AI bekam einen Text über "${promptTopic}..." und musste daraus **${allFields.length} spezifische SYNTX-Felder** extrahieren: ${allFields.slice(0, 5).join(', ')}${allFields.length > 5 ? '...' : ''}.`
    });

    // The result
    if (log.scores.overall >= 80) {
      stories.push({
        title: 'Das Ergebnis: Stabil',
        text: `**${log.cron_data.modell}** hat ${parsedFields.length} von ${allFields.length} Feldern korrekt extrahiert (${extractionRate.toFixed(0)}%). Die AI ist **semantisch stabil** – sie versteht, was "Driftkörper", "Kalibrierung" und "Strömung" bedeuten und kann diese Konzepte im Text identifizieren.`
      });
    } else if (log.scores.overall >= 50) {
      stories.push({
        title: 'Das Ergebnis: Leichter Drift',
        text: `**${log.cron_data.modell}** hat ${parsedFields.length} von ${allFields.length} Feldern extrahiert (${extractionRate.toFixed(0)}%). Die AI zeigt **leichte Drift-Tendenzen** – manche semantische Strukturen werden nicht erkannt. Das System braucht Nachjustierung.`
      });
    } else {
      stories.push({
        title: 'Das Ergebnis: Kritischer Drift',
        text: `**${log.cron_data.modell}** hat nur ${parsedFields.length} von ${allFields.length} Feldern extrahiert (${extractionRate.toFixed(0)}%). Die AI ist am **Driften** – semantische Konzepte werden nicht verstanden. Das ist ein Warnsignal.`
      });
    }

    // Duration insight
    if (log.meta.duration_ms > 60000) {
      stories.push({
        title: 'Performance: Langsam',
        text: `Der Test dauerte **${duration} Sekunden**. Das ist überdurchschnittlich lang – die AI kämpft mit der Aufgabe oder das Backend ist ausgelastet.`
      });
    } else if (log.meta.duration_ms < 30000) {
      stories.push({
        title: 'Performance: Schnell',
        text: `Der Test dauerte nur **${duration} Sekunden**. Schnelle Verarbeitung – die AI arbeitet effizient.`
      });
    }

    // Field completeness
    if (log.scores.field_completeness === 100) {
      stories.push({
        title: 'Vollständigkeit: Perfekt',
        text: `**100% Field Completeness** bedeutet: Alle erwarteten Felder wurden gefunden. Die AI hat nichts übersehen – auch wenn die Qualität der Extraktion variiert.`
      });
    } else {
      stories.push({
        title: 'Vollständigkeit: Lückenhaft',
        text: `Nur **${log.scores.field_completeness}% Field Completeness**. Die AI hat Felder komplett übersehen – das deutet auf strukturelle Probleme hin.`
      });
    }

    // Structure adherence
    if (log.scores.structure_adherence < 70) {
      stories.push({
        title: 'Struktur: Problem',
        text: `**${log.scores.structure_adherence}% Structure Adherence** ist niedrig. Die AI hält sich nicht an die vorgegebene Struktur – die Ausgaben sind chaotisch oder unvollständig formatiert.`
      });
    }

    // Closing
    stories.push({
      title: 'Was bedeutet das?',
      text: log.scores.overall >= 80 
        ? `Dieses System ist **kalibriert**. Die AI versteht semantische Konzepte korrekt und kann sie zuverlässig extrahieren. Das ist genau das, was wir sehen wollen.`
        : log.scores.overall >= 50
        ? `Dieses System braucht **Nachjustierung**. Die AI driftet leicht – durch mehr Training oder Prompt-Optimierung könnte die Performance verbessert werden.`
        : `Dieses System ist am **Driften**. Die AI versteht die semantischen Konzepte nicht mehr korrekt. Das ist ein Warnsignal – Recalibration oder Model-Wechsel notwendig.`
    });

    return stories;
  };

  const stories = getStory();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100000] flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-slate-950/98 rounded-3xl border shadow-2xl overflow-hidden"
          style={{ 
            borderColor: overallInsight.color,
            boxShadow: `0 0 80px ${overallInsight.color}40`
          }}
        >
          {/* Header with score visualization */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-b p-8"
            style={{ borderColor: overallInsight.color + '30' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <Image src="/Logo1.png" alt="SYNTX" width={60} height={60} />
                </motion.div>
                <div>
                  <h2 className="text-4xl font-black text-white mb-2">CALIBRATION INSIGHT</h2>
                  <p className="text-slate-400 font-mono text-sm">{log.cron_data.name}</p>
                </div>
              </div>

              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6 text-slate-300" />
              </motion.button>
            </div>

            {/* Big score display */}
            <div className="flex items-center gap-6">
              <motion.div
                className="relative"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg width="120" height="120">
                  <circle
                    cx="60" cy="60" r="55"
                    fill="none"
                    stroke={overallInsight.color + '20'}
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="60" cy="60" r="55"
                    fill="none"
                    stroke={overallInsight.color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 55}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 55 }}
                    animate={{ 
                      strokeDashoffset: 2 * Math.PI * 55 * (1 - log.scores.overall / 100)
                    }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Icon className="w-8 h-8 mb-1" style={{ color: overallInsight.color }} />
                  </motion.div>
                  <span className="text-3xl font-black" style={{ color: overallInsight.color }}>
                    {log.scores.overall}%
                  </span>
                </div>
              </motion.div>

              <div className="flex-1">
                <motion.div
                  className="text-3xl font-black mb-2"
                  style={{ color: overallInsight.color }}
                  animate={{
                    textShadow: [
                      `0 0 10px ${overallInsight.color}`,
                      `0 0 30px ${overallInsight.color}`,
                      `0 0 10px ${overallInsight.color}`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {overallInsight.text}
                </motion.div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {overallInsight.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Story sections */}
          <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
            {stories.map((story, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="relative pl-6 border-l-2 pb-6"
                style={{ borderColor: color.main + '30' }}
              >
                <motion.div
                  className="absolute -left-2 top-0 w-4 h-4 rounded-full"
                  style={{ backgroundColor: color.main }}
                  animate={{
                    boxShadow: [
                      `0 0 5px ${color.main}`,
                      `0 0 15px ${color.main}`,
                      `0 0 5px ${color.main}`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                />

                <h3 className="text-xl font-bold text-white mb-2">{story.title}</h3>
                <p className="text-slate-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: story.text.replace(/\*\*(.*?)\*\*/g, `<strong style="color: ${color.main}">$1</strong>`)
                  }}
                />
              </motion.div>
            ))}

            {log.scores.overall < 50 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-4 p-6 bg-red-500/10 border-2 border-red-500/30 rounded-2xl"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
                </motion.div>
                <div>
                  <h4 className="text-lg font-bold text-red-400 mb-2">⚠️ WARNUNG: KRITISCHER DRIFT</h4>
                  <p className="text-red-200 text-sm">
                    Dieses System zeigt kritische Drift-Symptome. Die AI versteht fundamentale semantische Konzepte nicht mehr korrekt. 
                    <strong className="block mt-2">Empfohlene Maßnahmen:</strong>
                    • Model neu trainieren<br/>
                    • Prompts optimieren<br/>
                    • Alternatives Model testen
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-6 bg-slate-900/50"
            style={{ borderColor: color.main + '20' }}
          >
            <motion.button
              onClick={onClose}
              className="w-full py-4 rounded-xl font-bold text-white"
              style={{ 
                background: `linear-gradient(90deg, ${color.rgb},0.8), ${color.main})`,
                boxShadow: `0 0 20px ${color.rgb},0.4)`
              }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: `0 0 40px ${color.rgb},0.6)`
              }}
              whileTap={{ scale: 0.98 }}
            >
              Verstanden · Close Insight
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
