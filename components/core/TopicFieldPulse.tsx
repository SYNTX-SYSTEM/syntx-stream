'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { SyntxAPI } from '@/lib/syntx-api';
import kategorien from '@/data/kategorien.json';
import { CyberSaveModal } from './CyberSaveModal';
import { CyberLegendDrawer } from './CyberLegendDrawer';
import { Save } from 'lucide-react';

interface Topic {
  name: string;
  kategorie: string;
  weight: number;
  x: number;
  y: number;
}

interface SaveState {
  status: 'saving' | 'success' | 'error';
  message: string;
  details?: string;
  data?: Record<string, number>;
}

const getKategorieGradient = (kategorie: string) => {
  const kat = kategorien.kategorien[kategorie as keyof typeof kategorien.kategorien];
  return kat?.visual?.tailwind_gradient || 'from-gray-400 to-gray-600';
};

const getKategorieIcon = (kategorie: string) => {
  const kat = kategorien.kategorien[kategorie as keyof typeof kategorien.kategorien];
  return kat?.visual?.icon || '📦';
};

export function TopicFieldPulse({ language = 'de' }: { language?: string }) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>({
    status: 'saving',
    message: 'SAVING...',
  });
  const clickTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});
  const clickCountRef = useRef<Record<string, number>>({});
  
  useEffect(() => {
    loadTopicsFromAPI();
  }, []);
  
  const loadTopicsFromAPI = async () => {
    try {
      const savedWeights = await SyntxAPI.getTopicWeights();
      
      const allTopics: Topic[] = [];
      const cols = 5;
      const spacing = 180;
      
      const topicNames = Object.keys(savedWeights.weights || {});
      
      if (topicNames.length < 5) {
        const kategorieNames = Object.keys(kategorien.kategorien);
        let globalIdx = 0;
        
        kategorieNames.forEach((kategorie) => {
          for (let i = 1; i <= 3; i++) {
            const col = globalIdx % cols;
            const row = Math.floor(globalIdx / cols);
            
            allTopics.push({
              name: `${kategorie}_${i}`,
              kategorie: kategorie,
              weight: 0.3 + Math.random() * 0.5,
              x: col * spacing + 100,
              y: row * spacing + 120,
            });
            globalIdx++;
          }
        });
        
        const weights: Record<string, number> = {};
        allTopics.forEach(t => weights[t.name] = t.weight);
        await SyntxAPI.saveTopicWeights(weights);
        
      } else {
        topicNames.forEach((name, idx) => {
          const col = idx % cols;
          const row = Math.floor(idx / cols);
          
          const kategorie = Object.keys(kategorien.kategorien).find(kat => 
            name.toLowerCase().includes(kat.toLowerCase())
          ) || Object.keys(kategorien.kategorien)[0];
          
          allTopics.push({
            name,
            kategorie,
            weight: savedWeights.weights[name],
            x: col * spacing + 100,
            y: row * spacing + 120,
          });
        });
      }
      
      setTopics(allTopics);
      setHasUnsavedChanges(false);
      
    } catch (error) {
      console.error('Failed to load topics:', error);
    }
  };
  
  const manualSave = async () => {
    try {
      const topicWeights: Record<string, number> = {};
      topics.forEach(t => {
        topicWeights[t.name] = Number(t.weight.toFixed(2));
      });
      
      setSaveState({
        status: 'saving',
        message: 'SAVING TO BACKEND...',
        details: `Updating ${Object.keys(topicWeights).length} topics`,
        data: topicWeights
      });
      setSaveModalOpen(true);
      
      const result = await SyntxAPI.saveTopicWeights(topicWeights);
      
      if (result && result.erfolg) {
        setSaveState({
          status: 'success',
          message: 'SAVE SUCCESSFUL! 🔥',
          details: `${result.gespeichert || Object.keys(topicWeights).length} topics updated successfully`,
          data: topicWeights
        });
        setHasUnsavedChanges(false);
      } else {
        throw new Error('Backend returned erfolg: false');
      }
      
    } catch (error) {
      console.error('❌ SAVE FAILED:', error);
      setSaveState({
        status: 'error',
        message: 'SAVE FAILED! 💀',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  
  const handleBubbleClick = (topicName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (clickTimeoutRef.current[topicName]) {
      clearTimeout(clickTimeoutRef.current[topicName]);
    }
    
    clickCountRef.current[topicName] = (clickCountRef.current[topicName] || 0) + 1;
    
    clickTimeoutRef.current[topicName] = setTimeout(() => {
      const clickCount = clickCountRef.current[topicName] || 1;
      
      if (clickCount === 1) {
        const newTopics = topics.map(t => 
          t.name === topicName 
            ? { ...t, weight: Math.min(1, t.weight + 0.1) }
            : t
        );
        setTopics(newTopics);
        setHasUnsavedChanges(true);
      } else {
        const newTopics = topics.map(t => 
          t.name === topicName 
            ? { ...t, weight: Math.max(0, t.weight - 0.2) }
            : t
        );
        setTopics(newTopics);
        setHasUnsavedChanges(true);
      }
      
      clickCountRef.current[topicName] = 0;
    }, 300);
  };
  
  const getWeightColor = (weight: number) => {
    if (weight >= 0.7) return 'from-green-400 via-emerald-400 to-green-500';
    if (weight >= 0.4) return 'from-yellow-400 via-amber-400 to-orange-400';
    return 'from-orange-500 via-red-500 to-rose-600';
  };
  
  const getWeightStatus = (weight: number) => {
    if (weight >= 0.7) return { text: '🔥 HIGH', color: 'text-green-400', bg: 'bg-green-500/30', border: 'border-green-400' };
    if (weight >= 0.4) return { text: '⚡ MED', color: 'text-yellow-400', bg: 'bg-yellow-500/30', border: 'border-yellow-400' };
    return { text: '💧 LOW', color: 'text-orange-400', bg: 'bg-orange-500/30', border: 'border-orange-400' };
  };

  const sortedTopics = [...topics].sort((a, b) => b.weight - a.weight);

  return (
    <>
      <CyberSaveModal 
        isOpen={saveModalOpen}
        saveState={saveState}
        onClose={() => setSaveModalOpen(false)}
      />
      
      <CyberLegendDrawer topics={topics} />
      
      <div className="space-y-6">
        {/* TOPIC FIELD PULSE */}
        <div className="relative bg-black rounded-3xl border-4 border-cyan-400 overflow-hidden shadow-2xl shadow-cyan-500/50">
          {/* Animated hexagon pattern */}
          <motion.div 
            className="absolute inset-0 opacity-10"
            animate={{ 
              backgroundPosition: ['0px 0px', '100px 100px', '0px 0px']
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: `
                radial-gradient(circle at 25px 25px, rgba(6,182,212,0.3) 2px, transparent 2px),
                radial-gradient(circle at 75px 75px, rgba(6,182,212,0.3) 2px, transparent 2px)
              `,
              backgroundSize: '100px 100px'
            }} 
          />
          
          <motion.div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(6,182,212,0.8) 4px, rgba(6,182,212,0.8) 6px)'
            }}
            animate={{ y: [0, 50, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          
          <div className="relative p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <motion.h3 
                  className="text-cyan-400 font-black text-3xl tracking-wider uppercase"
                  animate={{ 
                    textShadow: [
                      '0 0 20px rgba(6,182,212,0.8)',
                      '0 0 40px rgba(6,182,212,1)',
                      '0 0 20px rgba(6,182,212,0.8)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  TOPIC FIELD PULSE
                </motion.h3>
                <p className="text-cyan-300 text-lg font-bold mt-1">⚡ Interactive Weight Control System</p>
              </div>
              
              {/* MEGA SAVE BUTTON */}
              <motion.button
                onClick={manualSave}
                disabled={!hasUnsavedChanges}
                whileHover={hasUnsavedChanges ? { scale: 1.05 } : {}}
                whileTap={hasUnsavedChanges ? { scale: 0.95 } : {}}
                className={`relative px-8 py-4 rounded-2xl font-black text-xl uppercase tracking-wider flex items-center gap-3
                         ${hasUnsavedChanges 
                           ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-4 border-white cursor-pointer' 
                           : 'bg-gray-800 text-gray-500 border-4 border-gray-700 cursor-not-allowed'
                         } transition-all overflow-hidden`}
                style={hasUnsavedChanges ? {
                  boxShadow: '0 0 40px rgba(6,182,212,0.8)'
                } : {}}
              >
                {hasUnsavedChanges && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                )}
                
                <motion.div
                  animate={hasUnsavedChanges ? { rotate: 360 } : {}}
                  transition={hasUnsavedChanges ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
                >
                  <Save size={28} />
                </motion.div>
                
                <span className="relative">
                  {hasUnsavedChanges ? 'SAVE WEIGHTS' : 'NO CHANGES'}
                </span>
                
                {hasUnsavedChanges && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full border-2 border-white"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.button>
            </div>
            
            <div className="relative flex gap-8">
              {/* SCALE BAR */}
              <div className="flex-shrink-0 w-24 h-[650px] bg-gradient-to-b from-green-400 via-yellow-400 via-orange-400 to-red-500 rounded-3xl relative shadow-2xl border-4 border-white/30">
                {[100, 80, 60, 40, 20, 0].map(val => (
                  <div key={val} className="absolute left-full ml-4 text-xl text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                       style={{ top: `${100 - val}%`, transform: 'translateY(-50%)' }}>
                    {val}%
                  </div>
                ))}
                
                {isDragging && (
                  <motion.div
                    className="absolute left-0 right-0 h-3 bg-white shadow-2xl shadow-white rounded-full border-2 border-black"
                    style={{ 
                      top: `${100 - (topics.find(t => t.name === isDragging)?.weight || 0.5) * 100}%`,
                      boxShadow: '0 0 30px rgba(255,255,255,1), 0 0 60px rgba(6,182,212,1)'
                    }}
                    layoutId="pointer"
                  />
                )}
              </div>
              
              {/* BUBBLES FIELD */}
              <div className="relative flex-1 h-[650px] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black rounded-3xl border-4 border-cyan-500/40">
                <AnimatePresence>
                  {topics.map((topic) => {
                    const gradient = getKategorieGradient(topic.kategorie);
                    const icon = getKategorieIcon(topic.kategorie);
                    const weightColor = getWeightColor(topic.weight);
                    const isActive = isDragging === topic.name || hoveredTopic === topic.name;
                    
                    const size = 100 + (topic.weight * 80);
                    
                    return (
                      <motion.div
                        key={topic.name}
                        drag
                        dragMomentum={false}
                        dragElastic={0.1}
                        onDragStart={() => setIsDragging(topic.name)}
                        onDragEnd={(e, info) => {
                          setIsDragging(null);
                          const newTopics = topics.map(t =>
                            t.name === topic.name
                              ? { ...t, x: t.x + info.offset.x, y: t.y + info.offset.y }
                              : t
                          );
                          setTopics(newTopics);
                        }}
                        onClick={(e) => handleBubbleClick(topic.name, e)}
                        onHoverStart={() => setHoveredTopic(topic.name)}
                        onHoverEnd={() => setHoveredTopic(null)}
                        style={{ x: topic.x, y: topic.y }}
                        className="absolute cursor-pointer flex flex-col items-center"
                        whileHover={{ scale: 1.15, zIndex: 100 }}
                        whileTap={{ scale: 0.85 }}
                        animate={{
                          y: [0, -15, 0],
                        }}
                        transition={{
                          y: { duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                      >
                        <div 
                          className={`rounded-full bg-gradient-to-br ${gradient} 
                                    flex flex-col items-center justify-center
                                    border-[6px] ${isActive ? 'border-white' : 'border-white/50'} relative overflow-hidden`}
                          style={{
                            width: size,
                            height: size,
                            boxShadow: isActive 
                              ? '0 0 60px rgba(6,182,212,1), 0 0 100px rgba(6,182,212,0.8), inset 0 0 60px rgba(255,255,255,0.3)'
                              : '0 0 40px rgba(0,0,0,0.8), inset 0 0 40px rgba(255,255,255,0.2)'
                          }}>
                          
                          <motion.div
                            className="absolute inset-4 rounded-full border-4 border-white/30"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          />
                          
                          <motion.div
                            className="absolute inset-0 rounded-full bg-white"
                            animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          
                          <motion.div 
                            className="relative text-5xl mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                            animate={{ rotate: isActive ? [0, 5, -5, 0] : 0 }}
                            transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
                          >
                            {icon}
                          </motion.div>
                          
                          <div className="relative text-white text-base font-black text-center px-2 leading-tight uppercase drop-shadow-[0_0_10px_rgba(0,0,0,1)]">
                            {topic.name.split('_')[0]}
                          </div>
                        </div>
                        
                        <motion.div 
                          className={`mt-3 px-5 py-2 rounded-full text-2xl font-black
                                    bg-gradient-to-r ${weightColor} text-white border-4 border-white`}
                          animate={{
                            scale: [1, 1.1, 1],
                            boxShadow: [
                              '0 0 20px rgba(255,255,255,0.5)',
                              '0 0 40px rgba(255,255,255,1)',
                              '0 0 20px rgba(255,255,255,0.5)'
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {Math.round(topic.weight * 100)}%
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        
        {/* MATRIX */}
        <div className="relative bg-black rounded-3xl border-4 border-purple-400 overflow-hidden shadow-2xl shadow-purple-500/50">
          <div className="absolute inset-0 opacity-5 pointer-events-none font-mono text-green-400 text-xs leading-3 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: `${i * 2}%`, top: -100 }}
                animate={{ y: [0, 800] }}
                transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }}
              >
                {Array.from({ length: 20 }).map((_, j) => (
                  <div key={j}>{String.fromCharCode(0x30A0 + Math.random() * 96)}</div>
                ))}
              </motion.div>
            ))}
          </div>
          
          <div className="relative p-8">
            <motion.h3 
              className="text-purple-400 font-black text-3xl tracking-wider uppercase mb-6 flex items-center gap-4"
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(168,85,247,0.8)',
                  '0 0 40px rgba(168,85,247,1)',
                  '0 0 20px rgba(168,85,247,0.8)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>⚡</motion.span>
              TOPIC GEWICHTUNGS MATRIX
            </motion.h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 max-h-[600px] overflow-y-auto pr-4 cyber-scroll">
              {sortedTopics.map((topic, idx) => {
                const gradient = getKategorieGradient(topic.kategorie);
                const status = getWeightStatus(topic.weight);
                const icon = getKategorieIcon(topic.kategorie);
                
                return (
                  <motion.div
                    key={topic.name}
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: idx * 0.015, type: "spring", bounce: 0.4 }}
                    whileHover={{ scale: 1.08, y: -8, zIndex: 50 }}
                    className={`relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border-4 ${status.border} p-5 
                             hover:shadow-2xl transition-all group cursor-pointer overflow-hidden`}
                    style={{
                      boxShadow: `0 0 20px ${status.border === 'border-green-400' ? 'rgba(74,222,128,0.3)' : status.border === 'border-yellow-400' ? 'rgba(250,204,21,0.3)' : 'rgba(251,146,60,0.3)'}`
                    }}
                  >
                    {/* Cyber pattern background */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `repeating-linear-gradient(
                          ${45 * (idx % 4)}deg,
                          transparent,
                          transparent 10px,
                          ${status.border === 'border-green-400' ? 'rgba(74,222,128,0.5)' : status.border === 'border-yellow-400' ? 'rgba(250,204,21,0.5)' : 'rgba(251,146,60,0.5)'} 10px,
                          ${status.border === 'border-green-400' ? 'rgba(74,222,128,0.5)' : status.border === 'border-yellow-400' ? 'rgba(250,204,21,0.5)' : 'rgba(251,146,60,0.5)'} 11px
                        )`
                      }} />
                    </div>
                    
                    {/* Corner decorations */}
                    {[0, 1, 2, 3].map(corner => (
                      <motion.div
                        key={corner}
                        className={`absolute w-8 h-8 ${status.bg} border-2 ${status.border}`}
                        style={{
                          top: corner < 2 ? -1 : 'auto',
                          bottom: corner >= 2 ? -1 : 'auto',
                          left: corner % 2 === 0 ? -1 : 'auto',
                          right: corner % 2 === 1 ? -1 : 'auto',
                          clipPath: corner === 0 ? 'polygon(0 0, 100% 0, 0 100%)' :
                                   corner === 1 ? 'polygon(100% 0, 100% 100%, 0 0)' :
                                   corner === 2 ? 'polygon(0 100%, 100% 100%, 0 0)' :
                                   'polygon(100% 100%, 100% 0, 0 100%)'
                        }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: corner * 0.25 }}
                      />
                    ))}
                    
                    <div className="relative flex items-center gap-4 mb-4">
                      <motion.div 
                        className="text-5xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        {icon}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-black text-xl truncate drop-shadow-lg uppercase">
                          {topic.name.replace(/_/g, ' ')}
                        </div>
                        <div className="text-gray-300 text-sm font-bold capitalize mt-1">{topic.kategorie}</div>
                      </div>
                    </div>
                    
                    <div className={`${status.bg} ${status.border} border-2 rounded-xl px-3 py-1 inline-block mb-4`}>
                      <span className={`${status.color} font-black text-base`}>{status.text}</span>
                    </div>
                    
                    <div className="relative flex items-center justify-center mb-4 py-3">
                      <motion.div 
                        className={`text-7xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
                        style={{
                          filter: 'drop-shadow(0 0 20px rgba(6,182,212,1))'
                        }}
                        animate={{ 
                          scale: [1, 1.08, 1],
                          filter: [
                            'drop-shadow(0 0 20px rgba(6,182,212,0.8))',
                            'drop-shadow(0 0 40px rgba(6,182,212,1))',
                            'drop-shadow(0 0 20px rgba(6,182,212,0.8))'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {Math.round(topic.weight * 100)}%
                      </motion.div>
                    </div>
                    
                    <div className="relative h-6 bg-black rounded-xl overflow-hidden border-4 border-white/20">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${gradient} relative`}
                        initial={{ width: 0 }}
                        animate={{ width: `${topic.weight * 100}%` }}
                        transition={{ duration: 1, delay: idx * 0.02, type: "spring" }}
                      >
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                            backgroundSize: '50% 100%'
                          }}
                          animate={{ backgroundPosition: ['-100% 0', '200% 0'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
