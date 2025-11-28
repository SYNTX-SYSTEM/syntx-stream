// lib/syntx-api.ts - SYNTX Felder API Client mit korrekten Endpoints
const API_BASE = 'https://dev.syntx-system.com'

export interface PromptField {
  id: string
  topic: string
  content: string
  style: string
  quality_score: number
  timestamp: string
  cost_field: number
}

export interface TemporalAnalytics {
  time_span: {
    earliest: string
    latest: string
    total_days: number
  }
  generation_flow: {
    total_felder: number
    by_day: Record<string, number>
    avg_per_day: number
  }
}

export interface HealthStatus {
  status: string
  feld_count: number
  api_version: string
  timestamp: string
}

export class SYNTXAPI {
  static async checkHealth(): Promise<HealthStatus> {
    const response = await fetch(`${API_BASE}/strom/health`)
    return await response.json()
  }

  static async getTemporalAnalytics(): Promise<{ temporal_analytics: TemporalAnalytics }> {
    const response = await fetch(`${API_BASE}/strom/analytics/temporal`)
    return await response.json()
  }

  static async getPrompts(limit: number = 5): Promise<{ prompts: PromptField[] }> {
    const response = await fetch(`${API_BASE}/strom/prompts?limit=${limit}`)
    return await response.json()
  }

  static async getTopics() {
    const response = await fetch(`${API_BASE}/strom/topics`)
    return await response.json()
  }

  static async getTemporalPrompts(startDate?: string, endDate?: string, limit: number = 5): Promise<{ prompts: PromptField[] }> {
    let url = `${API_BASE}/strom/prompts/temporal?limit=${limit}`
    if (startDate) url += `&start_date=${startDate}`
    if (endDate) url += `&end_date=${endDate}`
    
    const response = await fetch(url)
    return await response.json()
  }

  // Neuer Stream-Endpoint Simulation - Polling basierend
  static async getLiveStream(limit: number = 3): Promise<PromptField[]> {
    try {
      // Hol die neuesten Felder
      const response = await this.getPrompts(limit)
      return response.prompts || []
    } catch (error) {
      console.error('Stream error:', error)
      return []
    }
  }
}
