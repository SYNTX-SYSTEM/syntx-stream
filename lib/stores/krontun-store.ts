import { create } from 'zustand';

interface CronData {
  name: string;
  felder: Record<string, number>;
  modell: string;
  anzahl: number;
}

interface CronResult {
  status: 'active' | 'pending' | 'completed' | 'failed';
  generated: number;
  failed: number;
  avg_quality: number;
  drift: number;
  cost: number;
  duration_ms: number;
}

interface CronLog {
  cron_id: string;
  timestamp: string;
  cron_data: CronData;
  result: CronResult;
}

interface ProcessedFile {
  file_id: string;
  cron_id: string;
  modell: string;
  topic: string;
  style: string;
  quality_score: number;
  drift: number;
  prompt: string;
  filepath: string;
}

interface TopicImpact {
  topic: string;
  timestamp: string;
  count: number;
  avg_quality: number;
  avg_drift: number;
  modell: string;
}

interface QueueStats {
  active: number;
  pending: number;
  completed: number;
  failed: number;
  total: number;
}

interface KrontunStore {
  crons: CronLog[];
  selectedCron: CronLog | null;
  files: ProcessedFile[];
  stats: QueueStats;
  impact: TopicImpact[];
  loading: boolean;
  
  selectCron: (id: string | null) => void;
  loadLogs: () => Promise<void>;
  loadFiles: () => Promise<void>;
  loadStats: () => Promise<void>;
  loadImpact: () => Promise<void>;
  triggerCron: (id: string) => Promise<void>;
  updateCron: (id: string, payload: Partial<CronData>) => Promise<void>;
}

export const useKrontunStore = create<KrontunStore>((set, get) => ({
  crons: [],
  selectedCron: null,
  files: [],
  stats: { active: 0, pending: 0, completed: 0, failed: 0, total: 0 },
  impact: [],
  loading: false,
  
  selectCron: (id) => {
    if (!id) {
      set({ selectedCron: null });
      return;
    }
    const cron = get().crons.find(c => c.cron_id === id);
    set({ selectedCron: cron || null });
  },
  
  loadLogs: async () => {
    set({ loading: true });
    try {
      const res = await fetch('https://dev.syntx-system.com/api/strom/kalibrierung/cron/logs?limit=100');
      const data = await res.json();
      console.log('Logs response:', data);
      if (data.erfolg && Array.isArray(data.logs)) {
        // Add safety checks for each log
        const validLogs = data.logs.filter((log: any) => 
          log.result && 
          typeof log.result.avg_quality === 'number' &&
          typeof log.result.drift === 'number'
        );
        set({ crons: validLogs, loading: false });
      } else {
        set({ crons: [], loading: false });
      }
    } catch (error) {
      console.error('Failed to load cron logs:', error);
      set({ crons: [], loading: false });
    }
  },
  
  loadFiles: async () => {
    try {
      const res = await fetch('https://dev.syntx-system.com/api/strom/processed-files');
      const data = await res.json();
      if (data.erfolg) {
        set({ files: data.files });
      }
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  },
  
  loadStats: async () => {
    try {
      const res = await fetch('https://dev.syntx-system.com/api/strom/kalibrierung/cron/stats');
      const data = await res.json();
      console.log('Stats response:', data);
      if (data.erfolg) {
        set({ stats: {
          active: data.active || 0,
          pending: data.pending || 0,
          completed: data.completed || 0,
          failed: data.failed || 0,
          total: data.total || 0
        }});
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  },
  
  loadImpact: async () => {
    try {
      const res = await fetch('https://dev.syntx-system.com/api/strom/kalibrierung/cron/impact');
      const data = await res.json();
      if (data.erfolg) {
        set({ impact: data.impact || [] });
      }
    } catch (error) {
      console.error('Failed to load impact:', error);
    }
  },
  
  triggerCron: async (id) => {
    try {
      const url = 'https://dev.syntx-system.com/api/strom/kalibrierung/cron/' + id + '/run';
      const res = await fetch(url, { method: 'POST' });
      const data = await res.json();
      if (data.erfolg) {
        await get().loadLogs();
      }
    } catch (error) {
      console.error('Failed to trigger cron:', error);
    }
  },
  
  updateCron: async (id, payload) => {
    try {
      const url = 'https://dev.syntx-system.com/api/strom/kalibrierung/cron/' + id;
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.erfolg) {
        await get().loadLogs();
      }
    } catch (error) {
      console.error('Failed to update cron:', error);
    }
  }
}));
