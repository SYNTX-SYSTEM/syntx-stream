'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { SyntxAPI } from '@/lib/syntx-api';
import { 
  getKategorieGradient, 
  getKategorieIcon,
  type Language 
} from '@/lib/kategorien';

interface Topic {
  name: string;
  kategorie: string;
  weight: number;
  x: number;
  y: number;
}

interface TopicFieldPulseProps {
  language?: Language;
}

export function TopicFieldPulse({ language = 'de' }: TopicFieldPulseProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    loadTopicsFromAPI();
  }, []);
  
  const loadTopicsFromAPI = async () => {
    try {
      const data = await SyntxAPI.getTopics();
      const savedWeights = await SyntxAPI.getTopicWeights();
      
      const allTopics: Topic[] = [];
      const topicsData = data.topics as Record<string, string[]>;
      
      const categories = Object.entries(topicsData);
      let globalIndex = 0;
      const cols = 6;
      const spacing = 140;
      
      categories.forEach(([kategorie, topicList]) => {
        topicList.forEach((name: string) => {
          const col = globalIndex % cols;
          const row = Math.floor(globalIndex / cols);
          
          const savedWeight = savedWeights.weights?.[name];
          const weight = savedWeight !== undefined ? savedWeight : (0.2 + Math.random() * 0.7);
          
          allTopics.push({
            name,
            kategorie,
            weight,
            x: col * spacing + 100,
            y: row * spacing + 50,
          });
          
          globalIndex++;
        });
      });
      
      setTopics(allTopics);
    } catch (error) {
      console.error('Failed to load topics:', error);
    }
  };
  
  const updateWeight = async (name: string, delta: number) => {
    const newTopics = topics.map(t => 
      t.name === name 
        ? { ...t, weight: Math.max(0, Math.min(1, t.weight + delta)) }
        : t
    );
    
    setTopics(newTopics);
    await saveWeightsToAPI(newTopics);
  };
  
  const saveWeightsToAPI = async (updatedTopics: Topic[]) => {
    setIsSaving(true);
    
    try {
      const topicWeights: Record<string, number> = {};
      updatedTopics.forEach(t => {
        topicWeights[t.name] = t.weight;
      });
      
      await SyntxAPI.saveTopicWeights(topicWeights);
      console.log('✅ Weights saved!');
      
    } catch (error) {
      console.error('Failed to save weights:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {isSaving && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 right-4 z-[999] bg-cyan-500 text-black px-4 py-2 rounded-lg font-bold text-sm shadow-2xl"
        >
          💾 Speichere Gewichtungen...
        </motion.div>
      )}
      
      <div 
        ref={containerRef}
        className="relative w-full h-[700px] bg-slate-900 rounded-lg overflow-hidden border-2 border-cyan-500/20"
      >
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="cyan" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="absolute inset-0 pointer-events-none z-40">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 h-[600px] w-16">
            <div className="relative h-full w-8 rounded-full overflow-hidden border-2 border-white/30 shadow-2xl bg-gray-800/50">
              <div className="absolute inset-0 bg-gradient-to-b from-green-500 via-yellow-500 to-red-500 opacity-80"></div>
              
              {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map((percent) => {
                const position = 100 - percent;
                return (
                  <div key={percent} className="absolute left-0 right-0" style={{ top: `${position}%` }}>
                    <div className="absolute left-0 w-full h-px bg-white/70"></div>
                    <div className="absolute -right-14 top-1/2 transform -translate-y-1/2 pointer-events-auto">
                      <div className={`text-xs font-bold ${
                        percent >= 70 ? 'text-green-400' :
                        percent >= 30 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {percent}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <AnimatePresence>
              {isDragging && (() => {
                const topic = topics.find(t => t.name === isDragging);
                if (!topic) return null;
                const position = 100 - (topic.weight * 100);
                
                return (
                  <motion.div
                    key="pointer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0, top: `${position}%` }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute left-0 w-full"
                  >
                    <div className="relative">
                      <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-cyan-400 drop-shadow-lg"></div>
                      </div>
                      <div className="absolute left-0 w-8 h-0.5 bg-cyan-400 shadow-lg shadow-cyan-400/80"></div>
                      <div className="absolute left-20 top-1/2 transform -translate-y-1/2 bg-cyan-500 text-black px-2 py-1 rounded font-bold text-xs whitespace-nowrap">
                        {(topic.weight * 100).toFixed(0)}%
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
            
            <div className="absolute -top-8 left-0 text-xs text-gray-400 font-bold">HIGH</div>
            <div className="absolute -bottom-8 left-0 text-xs text-gray-400 font-bold">LOW</div>
          </div>
        </div>
        
        {(isDragging || hoveredTopic) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            {(() => {
              const topic = topics.find(t => t.name === (isDragging || hoveredTopic));
              if (!topic) return null;
              
              return (
                <div className="bg-black/90 backdrop-blur-xl px-6 py-4 rounded-xl border-2 border-cyan-500/50 shadow-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="text-cyan-400 font-bold text-lg">{topic.name}</div>
                    <div className="h-6 w-px bg-gray-600"></div>
                    <div className="flex items-center space-x-2">
                      <div className="text-gray-400 text-sm">Gewichtung:</div>
                      <div className="text-white font-bold text-2xl">{(topic.weight * 100).toFixed(0)}%</div>
                    </div>
                    <div className="h-6 w-px bg-gray-600"></div>
                    <div className={`px-3 py-1 rounded-lg text-sm font-bold ${
                      topic.weight < 0.3 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      topic.weight < 0.7 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {topic.weight < 0.3 ? 'LOW' : topic.weight < 0.7 ? 'MEDIUM' : 'HIGH'}
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
        
        {topics.map((topic) => {
          const size = 90 + (topic.weight * 90);
          const glowIntensity = topic.weight * 40;
          const icon = getKategorieIcon(topic.kategorie);
          const isActive = isDragging === topic.name || hoveredTopic === topic.name;
          
          return (
            <motion.div
              key={topic.name}
              className="absolute cursor-grab active:cursor-grabbing"
              drag
              dragMomentum={false}
              dragElastic={0.1}
              dragConstraints={containerRef}
              onDragStart={() => setIsDragging(topic.name)}
              onDragEnd={() => setIsDragging(null)}
              onMouseEnter={() => setHoveredTopic(topic.name)}
              onMouseLeave={() => setHoveredTopic(null)}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: isActive ? 1.15 : 1,
                x: topic.x,
                y: topic.y,
                zIndex: isActive ? 100 : 1
              }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20 
              }}
              style={{
                width: size,
                height: size,
                left: 0,
                top: 0,
              }}
              onClick={() => updateWeight(topic.name, 0.1)}
              onDoubleClick={() => updateWeight(topic.name, -0.5)}
            >
              <motion.div
                className="absolute inset-0 rounded-full blur-2xl"
                animate={{
                  opacity: isActive ? [0.4, 0.8, 0.4] : [0.2, 0.4, 0.2],
                  scale: isActive ? [0.95, 1.15, 0.95] : [0.9, 1.1, 0.9],
                }}
                transition={{
                  duration: isActive ? 2 : 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  background: `radial-gradient(circle, rgba(34, 211, 238, ${topic.weight * 0.8}) 0%, transparent 70%)`,
                }}
              />
              
              <motion.div
                className={`relative w-full h-full rounded-full bg-gradient-to-br ${getKategorieGradient(topic.kategorie)} 
                            flex flex-col items-center justify-center text-white text-center p-3 shadow-2xl
                            border-2 ${isActive ? 'border-white' : 'border-white/20'}`}
                animate={{
                  boxShadow: isActive 
                    ? `0 0 ${glowIntensity * 2}px rgba(34, 211, 238, 1)` 
                    : `0 0 ${glowIntensity}px rgba(34, 211, 238, ${topic.weight})`,
                  y: isDragging === topic.name ? 0 : [0, -10, 0],
                }}
                transition={{
                  y: {
                    duration: 2 + Math.random(),
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <div className="text-[11px] font-black leading-tight mb-2 px-1 drop-shadow-lg tracking-tight">
                  {topic.name}
                </div>
                
                <div className="font-mono text-cyan-100 font-black text-xl drop-shadow-lg">
                  {(topic.weight * 100).toFixed(0)}%
                </div>
                
                <div className="absolute -top-2 -right-2 bg-black/90 text-cyan-400 text-[8px] px-2 py-0.5 rounded-full flex items-center gap-1 border border-cyan-500/30">
                  <span>{icon}</span>
                </div>
                
                <div className="absolute bottom-1 left-1 right-1 h-1 bg-black/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                    animate={{ width: `${topic.weight * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          );
        })}
        
        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-xl p-4 rounded-xl border border-cyan-500/30 text-sm z-50">
          <div className="text-cyan-400 font-bold mb-2 flex items-center space-x-2">
            <span>STEUERUNG</span>
            <span className="text-[10px] text-green-400">🌊 API CONNECTED</span>
          </div>
          <div className="space-y-1 text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span>Drag: Verschieben</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Click: +10% (speichert)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Double-Click: -50% (speichert)</span>
            </div>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 space-y-4 z-50">
          <div className="bg-black/80 backdrop-blur-xl p-4 rounded-xl border border-cyan-500/30">
            <div className="text-cyan-400 font-bold mb-3">FELD STATUS</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between space-x-4">
                <span className="text-gray-400">Total:</span>
                <span className="text-white font-bold">{topics.length}</span>
              </div>
              <div className="flex items-center justify-between space-x-4">
                <span className="text-gray-400">Aktiv:</span>
                <span className="text-green-400 font-bold">{topics.filter(t => t.weight > 0.7).length}</span>
              </div>
              <div className="flex items-center justify-between space-x-4">
                <span className="text-gray-400">Medium:</span>
                <span className="text-yellow-400 font-bold">{topics.filter(t => t.weight >= 0.3 && t.weight <= 0.7).length}</span>
              </div>
              <div className="flex items-center justify-between space-x-4">
                <span className="text-gray-400">Drift:</span>
                <span className="text-red-400 font-bold">{topics.filter(t => t.weight < 0.3).length}</span>
              </div>
              <div className="h-px bg-gray-700 my-2"></div>
              <div className="flex items-center justify-between space-x-4">
                <span className="text-gray-400">Ø Weight:</span>
                <span className="text-cyan-400 font-bold">
                  {topics.length > 0 ? (topics.reduce((sum, t) => sum + t.weight, 0) / topics.length * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-black/80 backdrop-blur-xl p-4 rounded-xl border border-cyan-500/30">
            <div className="text-cyan-400 font-bold mb-3">KATEGORIEN</div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-cyan-400 to-blue-600 border border-white/20"></div>
                <span className="text-gray-300">💻 Technologie</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-400 to-pink-600 border border-white/20"></div>
                <span className="text-gray-300">🌍 Gesellschaft</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-400 to-red-600 border border-white/20"></div>
                <span className="text-gray-300">⚠️ Grenzwertig</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-red-500 to-red-700 border border-white/20"></div>
                <span className="text-gray-300">🔴 Kritisch</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-green-400 to-emerald-600 border border-white/20"></div>
                <span className="text-gray-300">✅ Harmlos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-400 to-orange-600 border border-white/20"></div>
                <span className="text-gray-300">🔶 Kontrovers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-400 to-indigo-600 border border-white/20"></div>
                <span className="text-gray-300">📚 Bildung</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 MEGA CYBER OVERVIEW */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl border-2 border-cyan-500/30 p-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                'radial-gradient(circle at 0% 0%, #06b6d4 0%, transparent 50%)',
                'radial-gradient(circle at 100% 100%, #ec4899 0%, transparent 50%)',
                'radial-gradient(circle at 0% 100%, #8b5cf6 0%, transparent 50%)',
                'radial-gradient(circle at 100% 0%, #06b6d4 0%, transparent 50%)',
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <motion.div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, #06b6d4 0px, transparent 2px, transparent 4px)',
            }}
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <motion.div 
              className="text-2xl font-black tracking-wider"
              animate={{
                textShadow: [
                  '0 0 10px #06b6d4, 0 0 20px #06b6d4',
                  '0 0 20px #ec4899, 0 0 40px #ec4899',
                  '0 0 10px #06b6d4, 0 0 20px #06b6d4',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-magenta-500 to-purple-600">
                ⚡ TOPIC GEWICHTUNG MATRIX
              </span>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <motion.div
                className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30"
                animate={{ borderColor: ['rgba(6, 182, 212, 0.3)', 'rgba(6, 182, 212, 0.8)', 'rgba(6, 182, 212, 0.3)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-cyan-400 font-mono text-xs font-bold">{topics.length} TOPICS</span>
              </motion.div>
              
              <motion.div
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-green-400 text-xs font-bold">LIVE</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-h-[400px] overflow-y-auto pr-2 cyber-scroll">
            {topics
              .sort((a, b) => b.weight - a.weight)
              .map((topic, index) => {
                const icon = getKategorieIcon(topic.kategorie);
                const isHigh = topic.weight >= 0.7;
                const isMed = topic.weight >= 0.3 && topic.weight < 0.7;
                
                return (
                  <motion.div
                    key={topic.name}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.03,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    whileHover={{ scale: 1.05, zIndex: 100 }}
                    className="relative group cursor-pointer"
                  >
                    <div className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300
                                    ${isHigh ? 'border-green-500/40 bg-gradient-to-br from-green-500/10 to-emerald-500/5' :
                                      isMed ? 'border-yellow-500/40 bg-gradient-to-br from-yellow-500/10 to-orange-500/5' :
                                      'border-red-500/40 bg-gradient-to-br from-red-500/10 to-rose-500/5'}`}
                    >
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        animate={{
                          boxShadow: isHigh 
                            ? ['0 0 20px rgba(34,197,94,0.5)', '0 0 40px rgba(34,197,94,0.8)', '0 0 20px rgba(34,197,94,0.5)']
                            : isMed
                            ? ['0 0 20px rgba(234,179,8,0.5)', '0 0 40px rgba(234,179,8,0.8)', '0 0 20px rgba(234,179,8,0.5)']
                            : ['0 0 20px rgba(239,68,68,0.5)', '0 0 40px rgba(239,68,68,0.8)', '0 0 20px rgba(239,68,68,0.5)']
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      
                      <motion.div
                        className="absolute inset-0 opacity-30 pointer-events-none"
                        style={{
                          background: 'linear-gradient(180deg, transparent 0%, rgba(6, 182, 212, 0.1) 50%, transparent 100%)',
                          backgroundSize: '100% 200%',
                        }}
                        animate={{ backgroundPosition: ['0% 0%', '0% 100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                      
                      <div className="relative p-4 backdrop-blur-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 mr-2">
                            <div className="text-white font-bold text-xs leading-tight mb-1">{topic.name}</div>
                            <div className="text-gray-400 text-[9px] font-mono">{topic.kategorie}</div>
                          </div>
                          
                          <motion.div 
                            className="text-lg"
                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                            transition={{ duration: 3, repeat: Infinity, delay: index * 0.1 }}
                          >
                            {icon}
                          </motion.div>
                        </div>
                        
                        <div className="flex items-end justify-between mb-3">
                          <motion.div 
                            className={`font-mono font-black text-2xl ${
                              isHigh ? 'text-green-400' : isMed ? 'text-yellow-400' : 'text-red-400'
                            }`}
                            animate={{ 
                              scale: [1, 1.05, 1],
                              textShadow: isHigh 
                                ? ['0 0 5px rgba(34,197,94,0.5)', '0 0 15px rgba(34,197,94,1)', '0 0 5px rgba(34,197,94,0.5)']
                                : isMed
                                ? ['0 0 5px rgba(234,179,8,0.5)', '0 0 15px rgba(234,179,8,1)', '0 0 5px rgba(234,179,8,0.5)']
                                : ['0 0 5px rgba(239,68,68,0.5)', '0 0 15px rgba(239,68,68,1)', '0 0 5px rgba(239,68,68,0.5)']
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.05 }}
                          >
                            {(topic.weight * 100).toFixed(0)}%
                          </motion.div>
                          
                          <motion.div 
                            className={`text-[9px] font-black px-2 py-1 rounded ${
                              isHigh ? 'bg-green-500/30 text-green-300 border border-green-500/50' :
                              isMed ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50' :
                              'bg-red-500/30 text-red-300 border border-red-500/50'
                            }`}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
                          >
                            {isHigh ? 'HIGH' : isMed ? 'MED' : 'LOW'}
                          </motion.div>
                        </div>
                        
                        <div className="relative h-2 bg-black/70 rounded-full overflow-hidden">
                          <motion.div 
                            className={`absolute inset-y-0 left-0 ${
                              isHigh ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-green-400' :
                              isMed ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400' :
                              'bg-gradient-to-r from-red-400 via-rose-500 to-red-400'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${topic.weight * 100}%`,
                              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                            }}
                            transition={{ 
                              width: { duration: 0.8, delay: index * 0.03 },
                              backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
                            }}
                            style={{ backgroundSize: '200% 100%' }}
                          />
                          
                          <motion.div
                            className={`absolute inset-0 ${
                              isHigh ? 'bg-green-400/30' : isMed ? 'bg-yellow-400/30' : 'bg-red-400/30'
                            }`}
                            animate={{ opacity: [0, 0.5, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .cyber-scroll::-webkit-scrollbar {
          width: 10px;
        }
        .cyber-scroll::-webkit-scrollbar-track {
          background: linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(6,182,212,0.1) 50%, rgba(0,0,0,0.5) 100%);
          border-radius: 5px;
        }
        .cyber-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #06b6d4 0%, #ec4899 50%, #8b5cf6 100%);
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.8);
        }
        .cyber-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #22d3ee 0%, #f472b6 50%, #a78bfa 100%);
          box-shadow: 0 0 20px rgba(6, 182, 212, 1);
        }
      `}</style>
    </div>
  );
}
