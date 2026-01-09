const API_BASE = process.env.NEXT_PUBLIC_SYNTX_API || 'https://dev.syntx-system.com/api/strom';

export interface StromParameter {
  felder_topics: Record<string, number>;
  felder_styles?: Record<string, number>;
  styles?: string[];
  sprachen?: string[];
  strom_anzahl?: number;
  anzahl?: number;
  modell?: string;
}

export class SyntxAPI {
  // Topic Weights
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

  // Topics
  static async getTopics() {
    const res = await fetch(`${API_BASE}/feld/topics`);
    if (!res.ok) throw new Error('Failed to fetch topics');
    return res.json();
  }

  // Strom Dispatch
  static async dispatchStrom(params: StromParameter) {
    const res = await fetch(`${API_BASE}/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to dispatch strom');
    return res.json();
  }

  // Analytics
  static async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/overview`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  }
}
