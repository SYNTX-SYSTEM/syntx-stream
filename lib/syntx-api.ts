/**
 * 🌊 SYNTX API CLIENT
 * TypeScript Client für Strom-Orchestrator API
 */

const API_BASE = process.env.NEXT_PUBLIC_SYNTX_API || 'https://dev.syntx-system.com/api/strom';

export interface FeldGewichtung {
  [topic: string]: number;
}

export interface StromParameter {
  felder_topics: FeldGewichtung;
  felder_styles: FeldGewichtung;
  strom_anzahl: number;
  sprache: string;
}

export interface StromErgebnis {
  erfolg: boolean;
  topic: string;
  style: string;
  sprache: string;
  strom_text: string | null;
  qualitaet: number | null;
  kosten: number | null;
  dauer_ms: number;
}

export interface SystemStatus {
  status: string;
  felder_verfuegbar: {
    topics: number;
    kategorien: number;
    styles: number;
  };
  model: string;
  max_stroeme_pro_anfrage: number;
}

export class SyntxAPI {
  
  static async getStatus(): Promise<SystemStatus> {
    const res = await fetch(`${API_BASE}/strom/status`);
    if (!res.ok) throw new Error('Failed to fetch status');
    return res.json();
  }
  
  static async getVerfuegbareFelder() {
    const res = await fetch(`${API_BASE}/felder/verfuegbar`);
    if (!res.ok) throw new Error('Failed to fetch felder');
    return res.json();
  }
  
  static async getTopics() {
    const res = await fetch(`${API_BASE}/kalibrierung/topics`);
    if (!res.ok) throw new Error('Failed to fetch topics');
    return res.json();
  }
  
  static async updateTopics(kategorie: string, topics: string[], aktion: 'set' | 'add' | 'remove') {
    const res = await fetch(`${API_BASE}/kalibrierung/topics`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kategorie, topics, aktion })
    });
    if (!res.ok) throw new Error('Failed to update topics');
    return res.json();
  }
  
  static async getStyles() {
    const res = await fetch(`${API_BASE}/kalibrierung/styles`);
    if (!res.ok) throw new Error('Failed to fetch styles');
    return res.json();
  }
  
  static async updateStyles(styles: string[], aktion: 'set' | 'add' | 'remove') {
    const res = await fetch(`${API_BASE}/kalibrierung/styles`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ styles, aktion })
    });
    if (!res.ok) throw new Error('Failed to update styles');
    return res.json();
  }
  
  static async getOpenAIConfig() {
    const res = await fetch(`${API_BASE}/kalibrierung/openai`);
    if (!res.ok) throw new Error('Failed to fetch OpenAI config');
    return res.json();
  }
  
  static async updateOpenAIConfig(config: {
    model: string;
    temperature: number;
    top_p: number;
    max_tokens: number;
    max_refusal_retries: number;
  }) {
    const res = await fetch(`${API_BASE}/kalibrierung/openai`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    if (!res.ok) throw new Error('Failed to update OpenAI config');
    return res.json();
  }
  
  static async getCronJobs() {
    const res = await fetch(`${API_BASE}/kalibrierung/cron`);
    if (!res.ok) throw new Error('Failed to fetch cron jobs');
    return res.json();
  }
  
  static async addCronJob(job: {
    name: string;
    rhythmus: string;
    wrapper?: string;
    batch_groesse?: number;
    typ: 'producer' | 'consumer';
  }) {
    const res = await fetch(`${API_BASE}/kalibrierung/cron`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job)
    });
    if (!res.ok) throw new Error('Failed to add cron job');
    return res.json();
  }
  
  static async deleteCronJob(pattern: string) {
    const res = await fetch(`${API_BASE}/kalibrierung/cron/${pattern}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete cron job');
    return res.json();
  }
  
  static async getResonanzParameter() {
    const res = await fetch(`${API_BASE}/resonanz/parameter`);
    if (!res.ok) throw new Error('Failed to fetch resonanz parameter');
    return res.json();
  }
  
  static async dispatchStrom(params: StromParameter) {
    const res = await fetch(`${API_BASE}/strom/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to dispatch strom');
    return res.json();
  }

  // 🌊 TOPIC WEIGHTS
  static async getTopicWeights() {
    const res = await fetch(`${API_BASE}/topic-weights`);
    if (!res.ok) throw new Error('Failed to fetch topic weights');
    return res.json();
  }
  
  static async saveTopicWeights(weights: Record<string, number>) {
    const res = await fetch(`${API_BASE}/topic-weights`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weights })
    });
    if (!res.ok) throw new Error('Failed to save topic weights');
    return res.json();
  }
  
  static async getTopicWeight(topicName: string) {
    const res = await fetch(`${API_BASE}/topic-weights/${encodeURIComponent(topicName)}`);
    if (!res.ok) throw new Error('Failed to fetch topic weight');
    return res.json();
  }
  
  static async updateTopicWeight(topicName: string, weight: number) {
    const res = await fetch(`${API_BASE}/topic-weights/${encodeURIComponent(topicName)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weight })
    });
    if (!res.ok) throw new Error('Failed to update topic weight');
    return res.json();
  }
}
