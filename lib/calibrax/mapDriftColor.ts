// 🌊 DRIFT COLOR MAPPER
// Maps drift percentage to color, glow, and label

import type { DriftColor } from '@/types/calibrax';

export function mapDriftColor(drift: number): DriftColor {
  // drift is 0.0 - 1.0 (e.g., 0.05 = 5%)
  const driftPercent = drift * 100;

  // Hyperstable (0-5%)
  if (driftPercent < 5) {
    return {
      color: '#00D9FF', // Cyan/Blue
      glow: 0.9,
      label: 'Hyperstable'
    };
  }
  
  // Stable (5-10%)
  if (driftPercent < 10) {
    return {
      color: '#00FF88', // Green
      glow: 0.7,
      label: 'Stable'
    };
  }
  
  // Good (10-15%)
  if (driftPercent < 15) {
    return {
      color: '#88FF00', // Light Green
      glow: 0.5,
      label: 'Good'
    };
  }
  
  // Warning (15-20%)
  if (driftPercent < 20) {
    return {
      color: '#FFD700', // Yellow
      glow: 0.6,
      label: 'Warning'
    };
  }
  
  // Critical (20-30%)
  if (driftPercent < 30) {
    return {
      color: '#FF6B00', // Orange
      glow: 0.8,
      label: 'Critical'
    };
  }
  
  // Severe (30%+)
  return {
    color: '#FF0055', // Red
    glow: 1.0,
    label: 'Severe'
  };
}

export function getDriftGradient(drift: number): string {
  const { color } = mapDriftColor(drift);
  return `linear-gradient(135deg, ${color}40, ${color})`;
}
