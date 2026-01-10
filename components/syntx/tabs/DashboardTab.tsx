'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

// ═══════════════════════════════════════════════════════════════
// SYNTX CHROMATIK
// ═══════════════════════════════════════════════════════════════

const SYNTX_CHROMATIK = {
  FIELD_CORE: '#06b6d4',
  DRIFT_ZONE: '#a855f7',
  NORMAL_AREA: '#ef4444',
  NEURON_PATH: '#22c55e',
  OUTPUT_CORE: '#ec4899',
  WARNING: '#eab308',
};

// Score → Color Mapping (Universal)
const getScoreColor = (score: number) => {
  if (score > 70) return SYNTX_CHROMATIK.NEURON_PATH;
  if (score > 40) return SYNTX_CHROMATIK.WARNING;
  return SYNTX_CHROMATIK.NORMAL_AREA;
};

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface WrapperSignature {
  colors: string[];
  pattern: string;
  avg_score: number;
}

interface DashboardData {
  system_health: {
    total_prompts: number;
    avg_score: number;
    perfect_scores: number;
    success_rate: number;
  };
  queue: {
    incoming: number;
    processing: number;
    processed: number;
    errors: number;
  };
  topics: Record<string, {
    count: number;
    avg_score: number;
  }>;
  wrappers: Record<string, {
    total_jobs: number;
    avg_score: number;
    success_rate: number;
  }>;
  wrapper_signatures: Record<string, WrapperSignature>;
  recent_completed: Array<{
    job_id: string;
    filename: string;
    wrapper: string;
    score: number;
    duration_ms: number;
    timestamp?: string;
    completed_at?: string;
    topic?: string;
    rating?: string;
  }>;
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export function DashboardTab() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pulseWave, setPulseWave] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        console.log('🔄 Fetching dashboard data...');
        
        const [dashboardRes, queueRes, topicsRes, wrappersRes] = await Promise.all([
          fetch('https://dev.syntx-system.com/api/strom/analytics/complete-dashboard'),
          fetch('https://dev.syntx-system.com/api/strom/monitoring/live-queue'),
          fetch('https://dev.syntx-system.com/api/strom/analytics/topics'),
          fetch('https://dev.syntx-system.com/api/strom/compare/wrappers'),
        ]);

        const [dashboard, queue, topics, wrappers] = await Promise.all([
          dashboardRes.json(),
          queueRes.json(),
          topicsRes.json(),
          wrappersRes.json(),
        ]);

        console.log('✅ Wrappers data:', wrappers.wrappers);

        // GENERATE WRAPPER SIGNATURES DYNAMISCH AUS AVG_SCORE
        const wrapper_signatures: Record<string, WrapperSignature> = {};
        Object.entries(wrappers.wrappers || {}).forEach(([name, data]: [string, any]) => {
          const score = data.avg_score || 0;
          const baseColor = getScoreColor(score);
          
          // Pattern based on wrapper name
          let pattern = 'DEFAULT';
          if (name.includes('syntex') || name.includes('system')) pattern = 'PULSING_DEPTH';
          else if (name.includes('sigma')) pattern = 'HEARTBEAT';
          else if (name.includes('deep')) pattern = 'WATER_LINES';
          else if (name.includes('human')) pattern = 'FLOW';

          wrapper_signatures[name] = {
            colors: [baseColor, SYNTX_CHROMATIK.DRIFT_ZONE],
            pattern,
            avg_score: score
          };
        });

        console.log('✅ Generated signatures:', wrapper_signatures);

        setData({
          system_health: dashboard.system_health || {
            total_prompts: 0,
            avg_score: 0,
            perfect_scores: 0,
            success_rate: 0
          },
          queue: queue.queue || {
            incoming: 0,
            processing: 0,
            processed: 0,
            errors: 0
          },
          topics: topics.topics || {},
          wrappers: wrappers.wrappers || {},
          wrapper_signatures,
          recent_completed: (queue.recent_completed || []).slice(0, 10).map((item: any) => ({
            job_id: item.filename || item.job_id || "UNKNOWN",
            filename: item.filename || "UNKNOWN",
            score: item.score || 0,
            wrapper: item.wrapper || "unknown",
            duration_ms: item.duration_ms || 0,
            timestamp: item.completed_at || item.timestamp,
            completed_at: item.completed_at,
            topic: item.topic,
            rating: item.rating
          })).filter((item: any) => item.job_id !== "UNKNOWN")
        });

        setPulseWave(true);
        setTimeout(() => setPulseWave(false), 2000);
        setError(null);
      } catch (err: any) {
        console.error('❌ Dashboard fetch error:', err);
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingOrganism />;
  }

  if (error) {
    return <ErrorField message={error} />;
  }

  if (!data) {
    return <ErrorField message="No data available" />;
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <NeuronalField />
      
      <div className="relative z-10 p-8 space-y-8">
        <HeaderCore health={data.system_health} />

        <AnimatePresence>
          {pulseWave && <PulseWave />}
        </AnimatePresence>

        <div className="relative space-y-8">
          <QueueOrganism queue={data.queue} />
          <TopicsField topics={data.topics} />
          <WrapperField wrappers={data.wrappers} signatures={data.wrapper_signatures} />
          {data.recent_completed.length > 0 && (
            <GalaxyStream items={data.recent_completed} signatures={data.wrapper_signatures} />
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LOADING & ERROR (unchanged)
// ═══════════════════════════════════════════════════════════════

function LoadingOrganism() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="relative">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute inset-0 border-2 rounded-full"
            style={{ borderColor: SYNTX_CHROMATIK.FIELD_CORE }}
            animate={{
              scale: [1, 2],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
        <motion.div
          className="relative w-32 h-32 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          <Image src="/Logo1.png" alt="SYNTX" width={80} height={80} />
        </motion.div>
      </div>
    </div>
  );
}

function ErrorField({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-4">
      <motion.div
        className="text-6xl"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ⚠️
      </motion.div>
      <motion.div
        className="text-2xl font-mono"
        style={{ color: SYNTX_CHROMATIK.NORMAL_AREA }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        FELD BRUCH
      </motion.div>
      <div className="text-sm font-mono text-gray-500 max-w-md text-center">
        {message}
      </div>
    </div>
  );
}

function NeuronalField() {
  return (
    <div className="absolute inset-0 opacity-20">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${SYNTX_CHROMATIK.FIELD_CORE}40 1px, transparent 1px), linear-gradient(90deg, ${SYNTX_CHROMATIK.FIELD_CORE}40 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`neuron-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: SYNTX_CHROMATIK.FIELD_CORE,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

function PulseWave() {
  return (
    <motion.div
      className="absolute top-0 left-0 right-0 h-1 z-50"
      style={{
        background: `linear-gradient(90deg, transparent, ${SYNTX_CHROMATIK.FIELD_CORE}, transparent)`,
        boxShadow: `0 0 20px ${SYNTX_CHROMATIK.FIELD_CORE}`,
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: [0, 1, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: 'easeOut' }}
    />
  );
}

// Header, Queue, Topics (unchanged from previous version - keeping them short)
function HeaderCore({ health }: { health: DashboardData['system_health'] }) {
  return (
    <motion.div className="relative" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
      <div className="flex items-center justify-center gap-6">
        <motion.div animate={{ scale: [1, 1.05, 1], boxShadow: [`0 0 20px ${SYNTX_CHROMATIK.FIELD_CORE}80`, `0 0 40px ${SYNTX_CHROMATIK.FIELD_CORE}`, `0 0 20px ${SYNTX_CHROMATIK.FIELD_CORE}80`] }} transition={{ duration: 3, repeat: Infinity }} className="rounded-full">
          <Image src="/Logo1.png" alt="SYNTX" width={100} height={100} />
        </motion.div>
        <div className="text-center">
          <motion.h1 className="text-6xl font-black tracking-widest mb-2" style={{ color: SYNTX_CHROMATIK.FIELD_CORE, textShadow: `0 0 30px ${SYNTX_CHROMATIK.FIELD_CORE}` }} animate={{ textShadow: [`0 0 30px ${SYNTX_CHROMATIK.FIELD_CORE}`, `0 0 50px ${SYNTX_CHROMATIK.FIELD_CORE}`, `0 0 30px ${SYNTX_CHROMATIK.FIELD_CORE}`] }} transition={{ duration: 2, repeat: Infinity }}>DASHBOARD</motion.h1>
          <p className="text-sm font-mono text-gray-500 tracking-[0.3em]">LEBENDER ORGANISMUS · ECHTZEIT STROM</p>
        </div>
      </div>
      <div className="flex justify-center gap-8 mt-8">
        <HealthNode label="PROMPTS" value={health.total_prompts} />
        <HealthNode label="AVG SCORE" value={Math.round(health.avg_score)} suffix="%" />
        <HealthNode label="SUCCESS" value={Math.round(health.success_rate * 100)} suffix="%" color={SYNTX_CHROMATIK.NEURON_PATH} />
      </div>
    </motion.div>
  );
}

function HealthNode({ label, value, suffix = '', color = SYNTX_CHROMATIK.FIELD_CORE }: any) {
  return (
    <motion.div className="relative" whileHover={{ scale: 1.1 }}>
      <motion.div className="absolute -inset-4 rounded-full blur-xl" style={{ backgroundColor: color }} animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
      <div className="relative text-center">
        <motion.div className="text-4xl font-black font-mono" style={{ color }} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>{value}{suffix}</motion.div>
        <div className="text-xs text-gray-500 font-mono mt-1 tracking-wider">{label}</div>
      </div>
    </motion.div>
  );
}

function QueueOrganism({ queue }: { queue: DashboardData['queue'] }) {
  return (
    <motion.div className="relative" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
      <div className="flex justify-center gap-16">
        <QueueCore label="INCOMING" value={queue.incoming} color={SYNTX_CHROMATIK.DRIFT_ZONE} />
        <QueueCore label="PROCESSING" value={queue.processing} color={SYNTX_CHROMATIK.WARNING} isPulsing />
        <QueueCore label="PROCESSED" value={queue.processed} color={SYNTX_CHROMATIK.NEURON_PATH} />
        <QueueCore label="ERRORS" value={queue.errors} color={SYNTX_CHROMATIK.NORMAL_AREA} />
      </div>
    </motion.div>
  );
}

function QueueCore({ label, value, color, isPulsing = false }: any) {
  return (
    <motion.div className="relative group cursor-pointer" whileHover={{ scale: 1.1 }}>
      {[...Array(3)].map((_, i) => (
        <motion.div key={`ring-${i}`} className="absolute inset-0 border-2 rounded-full" style={{ borderColor: color }} animate={{ scale: [1, 1.5 + i * 0.3], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
      ))}
      <motion.div className="relative w-32 h-32 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20`, border: `2px solid ${color}`, boxShadow: `0 0 30px ${color}60` }} animate={isPulsing ? { scale: [1, 1.1, 1], boxShadow: [`0 0 30px ${color}60`, `0 0 50px ${color}`, `0 0 30px ${color}60`] } : {}} transition={{ duration: 1.5, repeat: Infinity }}>
        <div className="text-center">
          <motion.div className="text-4xl font-black font-mono" style={{ color }}>{value}</motion.div>
          <div className="text-[10px] text-gray-500 font-mono mt-1 tracking-widest">{label}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TopicsField({ topics }: { topics: Record<string, any> }) {
  const topicArray = Object.entries(topics);
  if (topicArray.length === 0) return null;
  return (
    <motion.div className="relative mt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black tracking-widest" style={{ color: SYNTX_CHROMATIK.DRIFT_ZONE, textShadow: `0 0 20px ${SYNTX_CHROMATIK.DRIFT_ZONE}` }}>TOPIC FIELD</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {topicArray.map(([topic, data], i) => (
          <TopicNode key={`topic-${topic}`} topic={topic} data={data} delay={i * 0.1} />
        ))}
      </div>
    </motion.div>
  );
}

function TopicNode({ topic, data, delay }: any) {
  const color = getScoreColor(data.avg_score);
  return (
    <motion.div className="relative group cursor-pointer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} whileHover={{ scale: 1.05, y: -5 }}>
      <motion.div className="px-6 py-4 rounded-xl" style={{ backgroundColor: `${color}10`, border: `2px solid ${color}60` }} animate={{ boxShadow: [`0 0 15px ${color}40`, `0 0 25px ${color}60`, `0 0 15px ${color}40`] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="text-lg font-bold font-mono uppercase tracking-wider" style={{ color }}>{topic}</div>
        <div className="flex gap-4 mt-2 text-sm font-mono text-gray-400">
          <span>{data.count} runs</span>
          <span>·</span>
          <motion.span style={{ color }} animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity }}>{Math.round(data.avg_score)}%</motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WRAPPER FIELD - NOW WITH DYNAMIC SIGNATURES
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// GALAXY FLOW - Mit Neuronalem Netz Background
// ═══════════════════════════════════════════════════════════════

function GalaxyStream({ items, signatures }: { items: DashboardData['recent_completed']; signatures: Record<string, WrapperSignature> }) {
  if (!items || items.length === 0) return null;

  return (
    <motion.div className="relative mt-16 pb-16 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      {/* NEURONAL NETWORK BACKGROUND */}
      <NeuronalNetworkBackground />

      <div className="relative z-10 text-center mb-12">
        <motion.h2 
          className="text-4xl font-black tracking-[0.3em]" 
          style={{ color: SYNTX_CHROMATIK.NEURON_PATH, textShadow: `0 0 30px ${SYNTX_CHROMATIK.NEURON_PATH}` }}
          animate={{
            textShadow: [
              `0 0 30px ${SYNTX_CHROMATIK.NEURON_PATH}`,
              `0 0 50px ${SYNTX_CHROMATIK.NEURON_PATH}`,
              `0 0 30px ${SYNTX_CHROMATIK.NEURON_PATH}`
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          GALAXY FLOW
        </motion.h2>
        <p className="text-xs text-gray-500 font-mono mt-2 tracking-[0.3em]">
          {items.length} CELESTIAL BODIES IN STREAM
        </p>
      </div>

      {/* GALAXY FLOW CONTAINER */}
      <div className="relative h-96 w-full z-10">
        {/* MAIN STREAM LINE */}
        <motion.div 
          className="absolute left-0 right-0 top-1/2 h-1" 
          style={{
            background: `linear-gradient(90deg, transparent, ${SYNTX_CHROMATIK.FIELD_CORE} 10%, ${SYNTX_CHROMATIK.FIELD_CORE} 90%, transparent)`,
            boxShadow: `0 0 30px ${SYNTX_CHROMATIK.FIELD_CORE}, 0 0 60px ${SYNTX_CHROMATIK.FIELD_CORE}40`,
          }}
          animate={{
            boxShadow: [
              `0 0 30px ${SYNTX_CHROMATIK.FIELD_CORE}, 0 0 60px ${SYNTX_CHROMATIK.FIELD_CORE}40`,
              `0 0 50px ${SYNTX_CHROMATIK.FIELD_CORE}, 0 0 100px ${SYNTX_CHROMATIK.FIELD_CORE}60`,
              `0 0 30px ${SYNTX_CHROMATIK.FIELD_CORE}, 0 0 60px ${SYNTX_CHROMATIK.FIELD_CORE}40`,
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* STARS & PLANETS */}
        {items.map((item, i) => {
          const xPos = (i / (items.length - 1)) * 90 + 5;
          const yVariation = Math.sin(i * 0.8) * 80;
          
          return (
            <CelestialBody 
              key={`celestial-${item.filename}-${i}`}
              item={item}
              index={i}
              xPos={xPos}
              yVariation={yVariation}
              signature={signatures[item.wrapper]}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// NEURONAL NETWORK BACKGROUND - Like SYNTX Login
// ═══════════════════════════════════════════════════════════════

function NeuronalNetworkBackground() {
  const neurons = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  const connections = neurons.flatMap((neuron, i) => 
    neurons.slice(i + 1, i + 4).map(target => ({
      from: neuron,
      to: target,
      distance: Math.sqrt(
        Math.pow(target.x - neuron.x, 2) + Math.pow(target.y - neuron.y, 2)
      ),
    }))
  ).filter(conn => conn.distance < 25);

  return (
    <div className="absolute inset-0 opacity-40">
      {/* STRONGER DIGITAL STREAMS */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`stream-${i}`}
          className="absolute h-full"
          style={{
            left: `${(i / 20) * 100}%`,
            width: '2px',
            background: `linear-gradient(180deg, transparent, ${i % 3 === 0 ? SYNTX_CHROMATIK.FIELD_CORE : i % 3 === 1 ? SYNTX_CHROMATIK.DRIFT_ZONE : SYNTX_CHROMATIK.OUTPUT_CORE}80, transparent)`,
            boxShadow: `0 0 10px ${i % 3 === 0 ? SYNTX_CHROMATIK.FIELD_CORE : i % 3 === 1 ? SYNTX_CHROMATIK.DRIFT_ZONE : SYNTX_CHROMATIK.OUTPUT_CORE}`,
          }}
          animate={{
            opacity: [0.4, 0.9, 0.4],
            scaleY: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        >
          {/* Binary numbers */}
          {[...Array(10)].map((_, j) => (
            <motion.div
              key={`binary-${j}`}
              className="absolute text-xs font-mono font-bold"
              style={{
                top: `${j * 10}%`,
                left: '-4px',
                color: i % 3 === 0 ? SYNTX_CHROMATIK.FIELD_CORE : i % 3 === 1 ? SYNTX_CHROMATIK.DRIFT_ZONE : SYNTX_CHROMATIK.OUTPUT_CORE,
                textShadow: `0 0 10px ${i % 3 === 0 ? SYNTX_CHROMATIK.FIELD_CORE : i % 3 === 1 ? SYNTX_CHROMATIK.DRIFT_ZONE : SYNTX_CHROMATIK.OUTPUT_CORE}`,
              }}
              animate={{
                y: ['0%', '1000%'],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: j * 0.4 + i * 0.15,
              }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </motion.div>
          ))}
        </motion.div>
      ))}

      {/* NEURONAL NETWORK */}
      <svg className="absolute inset-0 w-full h-full">
        {/* Connections */}
        {connections.map((conn, i) => (
          <motion.line
            key={`conn-${i}`}
            x1={`${conn.from.x}%`}
            y1={`${conn.from.y}%`}
            x2={`${conn.to.x}%`}
            y2={`${conn.to.y}%`}
            stroke={SYNTX_CHROMATIK.FIELD_CORE}
            strokeWidth="1"
            strokeOpacity="0.4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 1, 0],
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.05,
            }}
          />
        ))}
      </svg>

      {/* Neurons */}
      {neurons.map((neuron, i) => (
        <motion.div
          key={`neuron-${neuron.id}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${neuron.x}%`,
            top: `${neuron.y}%`,
            backgroundColor: SYNTX_CHROMATIK.FIELD_CORE,
            boxShadow: `0 0 10px ${SYNTX_CHROMATIK.FIELD_CORE}`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
            boxShadow: [
              `0 0 10px ${SYNTX_CHROMATIK.FIELD_CORE}`,
              `0 0 20px ${SYNTX_CHROMATIK.FIELD_CORE}`,
              `0 0 10px ${SYNTX_CHROMATIK.FIELD_CORE}`,
            ],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}

      {/* Hexagonal Grid (subtle) */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.08 }}>
        <defs>
          <pattern id="hexagons-galaxy" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
            <polygon 
              points="30,0 45,13 45,39 30,52 15,39 15,13" 
              fill="none" 
              stroke={SYNTX_CHROMATIK.FIELD_CORE} 
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons-galaxy)" />
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CELESTIAL BODY - Star or Planet
// ═══════════════════════════════════════════════════════════════

function CelestialBody({ item, index, xPos, yVariation, signature }: {
  item: any;
  index: number;
  xPos: number;
  yVariation: number;
  signature?: WrapperSignature;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const sig = signature || { colors: [SYNTX_CHROMATIK.FIELD_CORE], pattern: 'DEFAULT', avg_score: 0 };
  const primaryColor = sig.colors[0];
  const secondaryColor = sig.colors[1] || primaryColor;
  const scoreColor = getScoreColor(item.score);

  const size = 20 + (item.score / 100) * 60;
  const isStar = item.score > 60;

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${xPos}%`,
        top: `calc(50% + ${yVariation}px)`,
        width: `${size}px`,
        height: `${size}px`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15, duration: 0.8 }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      whileHover={{ scale: 1.3, zIndex: 100 }}
    >
      {/* ORBITAL RINGS */}
      {!isStar && (
        <motion.div
          className="absolute inset-0 border-2 rounded-full"
          style={{ 
            borderColor: `${primaryColor}40`,
            width: `${size * 1.5}px`,
            height: `${size * 1.5}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0, 0.4],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: index * 0.3,
          }}
        />
      )}

      {/* STAR OR PLANET */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: isStar
            ? `radial-gradient(circle, ${scoreColor} 0%, ${primaryColor} 50%, ${primaryColor}40 100%)`
            : `radial-gradient(circle, ${primaryColor}80 0%, ${secondaryColor}60 60%, ${primaryColor}20 100%)`,
          border: `2px solid ${primaryColor}`,
          boxShadow: isStar
            ? `0 0 ${size}px ${scoreColor}, inset 0 0 ${size/2}px ${scoreColor}80`
            : `0 0 ${size/2}px ${primaryColor}80, inset 0 0 ${size/4}px ${primaryColor}40`,
        }}
        animate={isStar ? {
          boxShadow: [
            `0 0 ${size}px ${scoreColor}, inset 0 0 ${size/2}px ${scoreColor}80`,
            `0 0 ${size*1.5}px ${scoreColor}, inset 0 0 ${size/1.5}px ${scoreColor}`,
            `0 0 ${size}px ${scoreColor}, inset 0 0 ${size/2}px ${scoreColor}80`,
          ]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* STAR RAYS */}
        {isStar && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`ray-${i}`}
                className="absolute bg-white"
                style={{
                  width: '2px',
                  height: `${size * 0.4}px`,
                  left: '50%',
                  top: '50%',
                  transformOrigin: 'center',
                  transform: `rotate(${i * 45}deg) translateY(-${size/2}px)`,
                  opacity: 0.8,
                }}
                animate={{
                  opacity: [0.4, 0.9, 0.4],
                  height: [`${size * 0.4}px`, `${size * 0.6}px`, `${size * 0.4}px`],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </>
        )}

        {/* SCORE */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center font-black font-mono"
            style={{
              fontSize: `${size * 0.35}px`,
              color: isStar ? 'white' : scoreColor,
              textShadow: `0 0 ${size/3}px ${isStar ? 'white' : scoreColor}`,
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {item.score}
          </motion.div>
        </div>

        {/* RATING */}
        {item.rating && (
          <div 
            className="absolute -bottom-3 left-1/2 -translate-x-1/2"
            style={{ fontSize: `${size * 0.35}px` }}
          >
            {item.rating}
          </div>
        )}
      </motion.div>

      {/* TOOLTIP WITH COPYABLE FILENAME */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute -top-48 left-1/2 -translate-x-1/2 w-96 p-4 rounded-xl z-50"
            style={{
              backgroundColor: `${primaryColor}15`,
              border: `2px solid ${primaryColor}`,
              backdropFilter: 'blur(20px)',
            }}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl mb-2">{isStar ? '⭐' : '🪐'}</div>
                <div className="font-bold text-lg" style={{ color: primaryColor }}>
                  {isStar ? 'STAR' : 'PLANET'}
                </div>
              </div>

              {/* COPYABLE FILENAME */}
              <div className="border-t pt-3" style={{ borderColor: `${primaryColor}40` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-400">FILENAME:</div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.filename);
                    }}
                    className="text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors"
                    style={{ color: primaryColor, border: `1px solid ${primaryColor}40` }}
                  >
                    📋 COPY
                  </button>
                </div>
                <div 
                  className="text-[11px] font-mono text-gray-300 break-all leading-tight p-2 rounded cursor-text select-text"
                  style={{ backgroundColor: `${primaryColor}08` }}
                  onClick={(e) => {
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(e.currentTarget);
                    selection?.removeAllRanges();
                    selection?.addRange(range);
                  }}
                >
                  {item.filename}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-400">Wrapper:</div>
                <div className="text-right font-mono uppercase" style={{ color: primaryColor }}>
                  {item.wrapper}
                </div>

                <div className="text-gray-400">Score:</div>
                <div className="text-right font-black" style={{ color: scoreColor }}>
                  {item.score}%
                </div>

                <div className="text-gray-400">Time:</div>
                <div className="text-right font-mono text-gray-300">
                  {item.completed_at || 'N/A'}
                </div>

                {item.topic && (
                  <>
                    <div className="text-gray-400">Topic:</div>
                    <div className="text-right uppercase text-gray-300">{item.topic}</div>
                  </>
                )}

                <div className="text-gray-400">Type:</div>
                <div className="text-right font-bold" style={{ color: primaryColor }}>
                  {isStar ? 'HIGH PERFORMER' : 'STANDARD'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TRAILING PARTICLES */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`trail-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: primaryColor,
            left: '-10px',
            top: '50%',
          }}
          animate={{
            x: [0, -60 - i * 30],
            opacity: [0.9, 0],
            scale: [1, 0.2],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </motion.div>
  );
}


function WrapperField({ wrappers, signatures }: { wrappers: Record<string, any>; signatures: Record<string, WrapperSignature> }) {
  const wrapperArray = Object.entries(wrappers);
  if (wrapperArray.length === 0) return null;

  return (
    <motion.div className="relative mt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black tracking-widest" style={{ color: SYNTX_CHROMATIK.OUTPUT_CORE, textShadow: `0 0 20px ${SYNTX_CHROMATIK.OUTPUT_CORE}` }}>WRAPPER SIGNATURES</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {wrapperArray.map(([wrapper, data]) => (
          <WrapperSignature key={`wrapper-${wrapper}`} wrapper={wrapper} data={data} signature={signatures[wrapper]} />
        ))}
      </div>
    </motion.div>
  );
}

function WrapperSignature({ wrapper, data, signature }: any) {
  const sig = signature || { colors: [SYNTX_CHROMATIK.FIELD_CORE], pattern: 'DEFAULT' };
  return (
    <motion.div className="relative group cursor-pointer" whileHover={{ scale: 1.05 }}>
      <motion.div className="p-6 rounded-xl" style={{ background: `linear-gradient(135deg, ${sig.colors[0]}20, ${sig.colors[sig.colors.length - 1]}20)`, border: `2px solid ${sig.colors[0]}60` }} animate={{ boxShadow: sig.colors.map((c: string) => `0 0 20px ${c}60`) }} transition={{ duration: sig.pattern === 'HEARTBEAT' ? 1 : 2, repeat: Infinity }}>
        <div className="text-sm font-mono font-bold uppercase tracking-wider mb-3" style={{ color: sig.colors[0] }}>{wrapper}</div>
        <div className="space-y-1 text-xs font-mono text-gray-400">
          <div>{data.total_jobs} jobs</div>
          <div style={{ color: sig.colors[0] }}>{Math.round(data.avg_score)}% avg</div>
        </div>
      </motion.div>
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ backgroundColor: sig.colors[0] }} />
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// GALAXY STREAM - NOW WITH DYNAMIC SIGNATURES
// ═══════════════════════════════════════════════════════════════

