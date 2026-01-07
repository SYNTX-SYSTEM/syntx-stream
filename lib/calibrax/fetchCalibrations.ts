// 🔥 CALIBRAX API CLIENT
// Fetches calibration data from KRONTUN backend

import type { CalibrationRun } from '@/types/calibrax';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dev.syntx-system.com/api/strom';

export async function fetchCalibrations(limit: number = 100): Promise<CalibrationRun[]> {
  try {
    const response = await fetch(`${API_BASE}/kalibrierung/cron/logs?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.erfolg) {
      throw new Error('API returned erfolg: false');
    }
    
    return data.logs as CalibrationRun[];
  } catch (error) {
    console.error('❌ Failed to fetch calibrations:', error);
    throw error;
  }
}

export async function fetchCalibrationStats() {
  try {
    const response = await fetch(`${API_BASE}/kalibrierung/cron/stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.erfolg) {
      throw new Error('API returned erfolg: false');
    }
    
    return {
      active: data.active,
      pending: data.pending,
      completed: data.completed,
      failed: data.failed,
      total: data.total
    };
  } catch (error) {
    console.error('❌ Failed to fetch stats:', error);
    throw error;
  }
}
