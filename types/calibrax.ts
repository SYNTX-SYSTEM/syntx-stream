// 🔱 CALIBRAX TYPE DEFINITIONS
// SYNTX::KRONTUN Stream Visualization Types

export interface CalibrationRun {
  stages?: CalibrationStages;
  cron_id: string;
  timestamp: string;
  cron_data: CronData;
  result: CalibrationResult;
}

export interface CronData {
  name: string;
  modell: string;
  anzahl: number;
  felder: FieldWeights;
}

export interface FieldWeights {
  Driftkorper: number;
  Kalibrierung: number;
  Stromung: number;
  [key: string]: number; // Allow dynamic fields
}

export interface CalibrationResult {
  status: 'completed' | 'failed' | 'running';
  generated: number;
  failed: number;
  avg_quality: number;
  drift: number; // 0.0 - 1.0 (percentage as decimal)
  cost: number;
  duration_ms: number;
}

// Zoom Levels
export type ZoomLevel = 'cron-overview' | 'prompt-level' | 'field-level';

// Drift Color Mapping
export interface DriftColor {
  color: string; // Hex color
  glow: number; // 0-1 intensity
  label: string; // "Stable", "Warning", "Critical"
}

// Stream Store State
export interface StreamState {
  calibrations: CalibrationRun[];
  filteredCalibrations: CalibrationRun[];
  selectedRun: CalibrationRun | null;
  zoomLevel: ZoomLevel;
  filters: StreamFilters;
  isLoading: boolean;
  error: string | null;
}

export interface StreamFilters {
  model?: string;
  driftMin?: number;
  driftMax?: number;
  timeframe?: {
    start: string;
    end: string;
  };
  status?: 'completed' | 'failed' | 'running';
}

// Actions
export interface StreamActions {
  fetchCalibrations: (limit?: number) => Promise<void>;
  setSelectedRun: (run: CalibrationRun | null) => void;
  setZoomLevel: (level: ZoomLevel) => void;
  setFilters: (filters: Partial<StreamFilters>) => void;
  clearFilters: () => void;
}
// Add after CalibrationResult interface:

export interface ParsedFields {
  driftkorper?: string;
  kalibrierung?: string;
  stromung?: string;
  drift?: string;
  hintergrund_muster?: string;
  druckfaktoren?: string;
  tiefe?: string;
  wirkung?: string;
  klartext?: string;
  [key: string]: string | undefined;
}

export interface CalibrationStages {
  gpt_system_prompt: string;
  gpt_output_meta_prompt: string;
  mistral_input: string;
  mistral_output: string;
  parsed_fields: ParsedFields;
}
