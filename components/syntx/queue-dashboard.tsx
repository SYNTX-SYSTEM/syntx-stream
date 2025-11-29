'use client';

import { useState, useEffect } from 'react';
import { Activity, TrendingUp, AlertCircle, CheckCircle, RefreshCw, Clock, Zap } from 'lucide-react';

interface QueueStats {
  incoming: number;
  processing: number;
  processed: number;
  state: string;
  health: string;
  timestamp: string;
  queue_capacity: number;
  total_generated: number;
  progress_current: number; // NEU: Aktuelle Fortschrittszahl
  progress_total: number;   // NEU: Gesamtziel
  progress_percentage: number; // NEU: Prozentualer Fortschritt
}

// 🔥 ECHTE SYNTX API CALLS - MIT KORREKTEN DATEN
const fetchRealQueueData = async (): Promise<QueueStats> => {
  try {
    console.log('🔄 FETCHING LIVE SYNTX DATA...');
    
    const [queueResponse, healthResponse, verlaufResponse] = await Promise.all([
      fetch('https://dev.syntx-system.com/strom/queue/status'),
      fetch('https://dev.syntx-system.com/strom/health'),
      fetch('https://dev.syntx-system.com/strom/queue/verlauf?limit=50') // Mehr Daten für besseren Fortschritt
    ]);

    if (!queueResponse.ok || !healthResponse.ok) {
      throw new Error(`API error: ${queueResponse.status}`);
    }

    const queueData = await queueResponse.json();
    const healthData = await healthResponse.json();
    const verlaufData = await verlaufResponse.json();

    console.log('📊 LIVE QUEUE DATA:', queueData);
    console.log('📈 VERLAUF DATA:', verlaufData);

    // 💡 ECHTE DATEN von deinen API Calls
    const incoming = queueData.data?.in_queue || 0;
    const processed = queueData.data?.total_verarbeitet || 0;
    const total_generated = queueData.data?.total_generiert || 0;
    const isActive = queueData.data?.strom_status === 'AKTIV';
    
    // State basierend auf ECHTEN Feldern
    let state: string;
    if (incoming === 0) state = 'STARVING';
    else if (incoming < 50) state = 'LOW';
    else if (incoming < 200) state = 'BALANCED';
    else if (incoming < 450) state = 'HIGH';
    else state = 'OVERFLOW';

    // 🎯 BATCH-GRÖSSE & FORTSCHRITT
    const BATCH_SIZE = 100; // Deine Consumer Batch-Größe
    
    // Fortschritt berechnen basierend auf Verlaufsdaten
    const calculateProgress = () => {
      if (!verlaufData.data?.verlauf_strom) {
        return {
          current: 0,
          total: BATCH_SIZE,
          percentage: 0
        };
      }

      const now = new Date().getTime();
      const oneHourAgo = now - (60 * 60 * 1000); // Letzte Stunde
      
      // Zähle erfolgreiche Jobs in der letzten Stunde
      const recentSuccessfulJobs = verlaufData.data.verlauf_strom.filter((item: any) => {
        try {
          const itemTime = new Date(item.timestamp).getTime();
          const isRecent = itemTime > oneHourAgo;
          const isSuccessful = item.quality_score?.total_score > 0;
          return isRecent && isSuccessful;
        } catch {
          return false;
        }
      }).length;

      // Wenn Consumer aktiv, zeige Fortschritt des aktuellen Batches
      if (isActive && incoming > 0) {
        const currentProgress = Math.min(recentSuccessfulJobs, BATCH_SIZE);
        const percentage = Math.round((currentProgress / BATCH_SIZE) * 100);
        
        return {
          current: currentProgress,
          total: BATCH_SIZE,
          percentage: percentage
        };
      }
      
      // Wenn nicht aktiv, zeige 0 Fortschritt
      return {
        current: 0,
        total: BATCH_SIZE,
        percentage: 0
      };
    };

    const progress = calculateProgress();
    const processing = isActive && incoming > 0 ? BATCH_SIZE : 0;
    
    return {
      incoming,
      processing, // Batch-Größe
      processed,
      state,
      health: healthData.status === 'STROM_FLIESST' ? 'OK' : 'DEGRADED',
      timestamp: queueData.data?.timestamp || new Date().toISOString(),
      queue_capacity: 600,
      total_generated,
      progress_current: progress.current, // NEU
      progress_total: progress.total,     // NEU
      progress_percentage: progress.percentage // NEU
    };
    
  } catch (error) {
    console.error('❌ API FEHLER:', error);
    throw new Error(`SYNTX API nicht erreichbar: ${error}`);
  }
};

export function QueueDashboard() {
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 LADE LIVE SYNTX DATEN...');
      const realData = await fetchRealQueueData();
      setStats(realData);
      setLastUpdate(new Date().toLocaleTimeString());
      console.log('✅ LIVE DATEN GELADEN:', realData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unbekannter Fehler';
      console.error('❌ LOAD FEHLER:', errorMsg);
      setError(errorMsg);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStateColor = (state: string) => {
    switch(state) {
      case 'STARVING': return 'text-yellow-500';
      case 'LOW': return 'text-blue-400';
      case 'BALANCED': return 'text-green-400';
      case 'HIGH': return 'text-orange-400';
      case 'OVERFLOW': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  if (loading && !stats) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-cyan-500/30 flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mr-2" />
        <span className="text-cyan-400">Lade LIVE-Daten von SYNTX API...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-red-500/30">
        <div className="text-red-400 text-lg font-bold mb-2">❌ SYNTX API FEHLER</div>
        <div className="text-gray-400 text-sm mb-4">{error}</div>
        <button onClick={loadData} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white">
          Erneut versuchen
        </button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-cyan-500/30">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
          <Activity className="w-6 h-6" />
          Queue Dashboard (LIVE SYNTX API)
        </h2>
        <button 
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1 bg-cyan-600 hover:bg-cyan-700 rounded text-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Lädt...' : 'Aktualisieren'}
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Activity />}
          label="Queue State"
          value={stats.state}
          color={getStateColor(stats.state)}
        />
        <StatCard
          icon={<TrendingUp />}
          label="In Queue"
          value={stats.incoming}
          color="text-cyan-400"
        />
        <ProgressStatCard
          icon={<Zap />}
          label="Processing"
          current={stats.progress_current}
          total={stats.progress_total}
          percentage={stats.progress_percentage}
          color="text-blue-400"
        />
        <StatCard
          icon={<AlertCircle />}
          label="Processed"
          value={stats.processed}
          color="text-green-400"
        />
      </div>

      {/* 🎯 FORTSCHRITTS-BALKEN */}
      {stats.progress_percentage > 0 && (
        <div className="mt-4 bg-gray-800 rounded-full h-4 border border-gray-700 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${stats.progress_percentage}%` }}
          ></div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-800/50 rounded border border-gray-700">
        <div className="text-xs text-gray-400">
          API Status: <span className={stats.health === 'OK' ? 'text-green-400' : 'text-red-400'}>{stats.health}</span>
          {' | '}
          Queue: <span className="text-cyan-400">{stats.incoming}</span> Felder
          {' | '}
          Total Generated: <span className="text-purple-400">{stats.total_generated}</span>
          {' | '}
          Last Update: <span className="text-blue-400">{lastUpdate}</span>
          {' | '}
          {stats.progress_percentage > 0 && (
            <>
              Progress: <span className="text-green-400">{stats.progress_percentage}%</span>
              {' | '}
            </>
          )}
          Capacity: <span className="text-orange-400">{stats.queue_capacity}</span>
        </div>
      </div>

      {/* ✅ LIVE DATA INDICATOR */}
      <div className="mt-3 p-2 bg-green-900/30 rounded border border-green-500/50 text-xs text-green-400">
        ✅ LIVE SYNTX API • {stats.incoming} in Queue • {stats.processed} processed • {stats.total_generated} total generated
        {stats.progress_percentage > 0 && ` • Batch: ${stats.progress_current}/${stats.progress_total} (${stats.progress_percentage}%)`}
      </div>

      {/* ⚠️ OVERFLOW WARNING */}
      {stats.state === 'OVERFLOW' && (
        <div className="mt-3 p-2 bg-red-900/30 rounded border border-red-500/50 text-xs text-red-400">
          ⚠️ QUEUE OVERFLOW - {stats.incoming} Felder warten auf Verarbeitung!
        </div>
      )}
    </div>
  );
}

// 🎯 NEUE: Progress StatCard mit Fortschritts-Anzeige
function ProgressStatCard({ icon, label, current, total, percentage, color }: any) {
  return (
    <div className="bg-gray-800/50 p-4 rounded border border-gray-700">
      <div className={`${color} mb-2`}>{icon}</div>
      <div className="text-gray-400 text-sm">{label}</div>
      <div className={`${color} text-2xl font-bold`}>
        {current}/{total}
      </div>
      {percentage > 0 && (
        <div className="text-gray-400 text-xs mt-1">
          {percentage}% complete
        </div>
      )}
    </div>
  );
}

// BEHALTE: Normale StatCard für andere Werte
function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-gray-800/50 p-4 rounded border border-gray-700">
      <div className={`${color} mb-2`}>{icon}</div>
      <div className="text-gray-400 text-sm">{label}</div>
      <div className={`${color} text-2xl font-bold`}>{value}</div>
    </div>
  );
}