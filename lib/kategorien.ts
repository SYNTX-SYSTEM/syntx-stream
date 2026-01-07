/**
 * 🌊 SYNTX KATEGORIEN & STYLES
 * Multi-Language Support via JSON
 */

import kategorienData from '@/data/kategorien.json';

export type Language = 'de' | 'en' | 'ru';

export interface KategorieConfig {
  id: string;
  prioritaet: number;
  names: Record<Language, string>;
  beschreibung: Record<Language, string>;
  visual: {
    icon: string;
    farbe_von: string;
    farbe_bis: string;
    tailwind_gradient: string;
  };
}

export interface StyleConfig {
  id: string;
  names: Record<Language, string>;
  beschreibung: Record<Language, string>;
  visual: {
    icon: string;
    farbe_von: string;
    farbe_bis: string;
    tailwind_gradient: string;
  };
}

// Load from JSON
export const KATEGORIEN: Record<string, KategorieConfig> = kategorienData.kategorien;
export const STYLES: Record<string, StyleConfig> = kategorienData.styles;

/**
 * Get kategorie name in specified language
 */
export function getKategorieName(kategorieId: string, lang: Language = 'de'): string {
  return KATEGORIEN[kategorieId]?.names[lang] || kategorieId;
}

/**
 * Get kategorie description in specified language
 */
export function getKategorieBeschreibung(kategorieId: string, lang: Language = 'de'): string {
  return KATEGORIEN[kategorieId]?.beschreibung[lang] || '';
}

/**
 * Get Tailwind gradient class for kategorie
 */
export function getKategorieGradient(kategorieId: string): string {
  return KATEGORIEN[kategorieId]?.visual.tailwind_gradient || 'from-gray-400 to-gray-600';
}

/**
 * Get icon for kategorie
 */
export function getKategorieIcon(kategorieId: string): string {
  return KATEGORIEN[kategorieId]?.visual.icon || '📦';
}

/**
 * Get style name in specified language
 */
export function getStyleName(styleId: string, lang: Language = 'de'): string {
  return STYLES[styleId]?.names[lang] || styleId;
}

/**
 * Get Tailwind gradient class for style
 */
export function getStyleGradient(styleId: string): string {
  return STYLES[styleId]?.visual.tailwind_gradient || 'from-gray-500 to-gray-700';
}

/**
 * Get icon for style
 */
export function getStyleIcon(styleId: string): string {
  return STYLES[styleId]?.visual.icon || '🎯';
}

/**
 * Get all kategorien sorted by priority
 */
export function getAllKategorien(): KategorieConfig[] {
  return Object.values(KATEGORIEN).sort((a, b) => a.prioritaet - b.prioritaet);
}

/**
 * Get all styles
 */
export function getAllStyles(): StyleConfig[] {
  return Object.values(STYLES);
}
