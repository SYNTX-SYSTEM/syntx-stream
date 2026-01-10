import { create } from 'zustand';

interface CronData {
  name: string;
  felder: Record<string, number>;
  modell: string;
}

interface CronStages {
  parsed_fields: Record<string, string | null>;
}

interface CronScores {
  overall: number;
  field_completeness: number;
  structure_adherence: number;
}

interface CronMeta {
  duration_ms: number;
  retry_count: number;
  success: boolean;
}

interface CronLog {
  timestamp: string;
  cron_data: CronData;
  stages: CronStages;
  scores: CronScores;
  meta: CronMeta;
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
  stats: QueueStats;
  loading: boolean;
  
  selectCron: (cron: CronLog | null) => void;
  loadLogs: () => Promise<void>;
  loadStats: () => Promise<void>;
}

export const useKrontunStore = create<KrontunStore>((set) => ({
  crons: [],
  selectedCron: null,
  stats: { active: 0, pending: 0, completed: 0, failed: 0, total: 0 },
  loading: false,
  
  selectCron: (cron) => {
    set({ selectedCron: cron });
  },
  
  loadLogs: async () => {
    set({ loading: true });
    try {
      const res = await fetch('https://dev.syntx-system.com/api/strom/kalibrierung/cron/logs?limit=100');
      const data = await res.json();
      
      if (data.erfolg && Array.isArray(data.logs)) {
        const validLogs = data.logs.filter((log: any) => 
          log.scores && 
          log.meta &&
          log.cron_data
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
  
  loadStats: async () => {
    try {
      const res = await fetch('https://dev.syntx-system.com/api/strom/kalibrierung/cron/stats');
      const data = await res.json();
      
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
  }
}));
