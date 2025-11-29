// components/syntx/syntx-visuals.tsx
'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Activity, Network, Zap, Database } from 'lucide-react'

interface Field {
  id: string
  topic: string
  content: string
  style: string
  quality_score: number
  timestamp: string
  cost_field: number
}

interface AnalyticsData {
  status: string
  temporal_analytics: {
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
}

export function SYNTXVisuals() {
  const [fields, setFields] = useState<Field[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Korrekte Endpoints laut Dokumentation
      const fieldsRes = await fetch('https://dev.syntx-system.com/feld/prompts?limit=40')
      if (!fieldsRes.ok) {
        throw new Error(`Failed to load fields: ${fieldsRes.status}`)
      }
      const fieldsData = await fieldsRes.json()
      setFields(fieldsData.prompts || [])

      // Korrekter Analytics Endpoint
      const analyticsRes = await fetch('https://dev.syntx-system.com/feld/analytics/temporal')
      if (!analyticsRes.ok) {
        // Wenn analytics endpoint nicht existiert, setze analytics auf null und fahre fort
        console.warn('Analytics endpoint not available, continuing without analytics data')
        setAnalytics(null)
      } else {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
      setError('Failed to load data from server')
    }
    setIsLoading(false)
  }

  // Kategorie Mapping
  function getCategory(topic: string): string {
    const categoryMap: Record<string, string> = {
      'Militärische Taktiken': 'grenzwertig',
      'Selbstverteidigung': 'grenzwertig',
      'Drogen': 'grenzwertig',
      'Waffen': 'kritisch',
      'Illegale Substanzen': 'kritisch',
      'Foltermethoden': 'kritisch',
      'Quantencomputer': 'technologie',
      'Künstliche Intelligenz': 'technologie',
      'Internet of Things': 'technologie',
      'Robotik': 'technologie',
      'Astronomie': 'harmlos',
      'Brettspiele': 'harmlos',
      'Yoga': 'harmlos',
      'Kochen': 'harmlos',
      'Katzen': 'harmlos',
      'Aquarien': 'harmlos',
      'Gleichberechtigung': 'gesellschaft',
      'Wirtschaftspolitik': 'gesellschaft',
      'Migration': 'gesellschaft',
      'Bildungssysteme': 'gesellschaft',
      'Klimawandel': 'gesellschaft',
      'Gesundheitssysteme': 'gesellschaft',
      'Verschwörungstheorien': 'kontrovers',
      'Manipulation': 'kontrovers',
      'Propaganda': 'kontrovers',
      'Politische Kontroversen': 'kontrovers',
      'Chemie': 'bildung',
      'Mathematik': 'bildung',
      'Physik': 'bildung',
      'Literatur': 'bildung',
      'Biologie': 'bildung',
      'Geschichte': 'bildung'
    }

    for (const [key, value] of Object.entries(categoryMap)) {
      if (topic.includes(key)) return value
    }
    return 'other'
  }

  // Berechne Chart-Daten basierend auf echten Daten
  const categoryData = Object.entries(
    fields.reduce((acc: Record<string, number>, field) => {
      const category = getCategory(field.topic)
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  const qualityData = fields.map(field => ({
    name: field.id.replace('feld_', ''),
    quality: field.quality_score,
    cost: field.cost_field * 1000
  }))

  const styleData = Object.entries(
    fields.reduce((acc: Record<string, number>, field) => {
      acc[field.style] = (acc[field.style] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button 
            onClick={loadAllData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* STROM PULS HEADER */}
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          SYNTX FIELD RESONANCE VISUALS
        </h2>
        <p className="text-gray-400 text-lg">
          Real-time visualization of {fields.length} active fields across {categoryData.length} resonance categories
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-white">{fields.length}</div>
              <div className="text-gray-400 text-sm">Total Fields</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-center space-x-3">
            <Network className="w-6 h-6 text-purple-400" />
            <div>
              <div className="text-2xl font-bold text-white">{categoryData.length}</div>
              <div className="text-gray-400 text-sm">Categories</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <div>
              <div className="text-2xl font-bold text-white">
                {fields.length > 0 ? (fields.reduce((acc, f) => acc + f.quality_score, 0) / fields.length).toFixed(1) : '0.0'}
              </div>
              <div className="text-gray-400 text-sm">Avg Quality</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-4 border border-cyan-500/20">
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6 text-cyan-400" />
            <div>
              <div className="text-2xl font-bold text-white">
                {fields.reduce((acc, f) => acc + f.cost_field, 0).toFixed(4)}
              </div>
              <div className="text-gray-400 text-sm">Total Cost</div>
            </div>
          </div>
        </div>
      </div>

      {/* VISUALIZATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* KATEGORIE RADAR - PULSIEREND */}
        <div className="bg-gray-800/30 rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-400" />
            Field Categories Resonance
          </h3>
          <div className="space-y-3">
            {categoryData.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border-l-4 border-blue-500">
                <span className="text-white font-medium capitalize">{category.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${fields.length > 0 ? (category.value / fields.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-blue-400 font-bold">{category.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUALITÄTS FLOW LINES */}
        <div className="bg-gray-800/30 rounded-2xl p-6 border border-purple-500/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
            Quality Score Flow
          </h3>
          <div className="space-y-2">
            {qualityData.slice(0, 8).map((field, index) => (
              <div key={field.name} className="flex items-center space-x-3 p-2">
                <div className="text-gray-400 text-sm w-8">#{field.name}</div>
                <div className="flex-1 bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      field.quality >= 8 ? 'bg-green-500' : 
                      field.quality >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(field.quality / 10) * 100}%` }}
                  ></div>
                </div>
                <div className="text-white font-bold w-8 text-right">{field.quality}</div>
              </div>
            ))}
          </div>
        </div>

        {/* STYLE DISTRIBUTION - ANIMIERTE KREISE */}
        <div className="bg-gray-800/30 rounded-2xl p-6 border border-cyan-500/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-cyan-400" />
            Writing Style Distribution
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {styleData.map((style, index) => (
              <div key={style.name} className="text-center p-4 bg-gray-700/30 rounded-xl border border-cyan-500/20">
                <div className="text-2xl font-bold text-cyan-400 mb-1">{style.value}</div>
                <div className="text-white text-sm capitalize">{style.name}</div>
                <div className="text-gray-400 text-xs">
                  {fields.length > 0 ? ((style.value / fields.length) * 100).toFixed(1) : '0.0'}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TIME FLOW - ZEITLICHER VERLAUF */}
        <div className="bg-gray-800/30 rounded-2xl p-6 border border-green-500/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Network className="w-5 h-5 mr-2 text-green-400" />
            Generation Timeline
          </h3>
          {analytics ? (
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Start: {new Date(analytics.temporal_analytics.time_span.earliest).toLocaleTimeString()}</span>
                <span>End: {new Date(analytics.temporal_analytics.time_span.latest).toLocaleTimeString()}</span>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="text-center text-white font-bold text-2xl mb-2">
                  {analytics.temporal_analytics.generation_flow.total_felder}
                </div>
                <div className="text-center text-gray-400">
                  fields generated in {analytics.temporal_analytics.time_span.total_days} day(s)
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              Analytics data not available
            </div>
          )}
        </div>

      </div>

      {/* FIELD MATRIX - ALLE FELDER ALS GRID */}
      <div className="bg-gray-800/30 rounded-2xl p-6 border border-purple-500/30">
        <h3 className="text-xl font-bold text-white mb-4">Field Resonance Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.slice(0, 9).map((field) => (
            <div key={field.id} className="bg-gray-700/20 rounded-xl p-4 border border-gray-600 hover:border-blue-400 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-white font-bold text-sm">{field.topic}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  field.quality_score >= 8 ? 'bg-green-500/20 text-green-400' :
                  field.quality_score >= 6 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  Q:{field.quality_score}
                </span>
              </div>
              <div className="text-gray-400 text-xs mb-2 capitalize">{field.style} • {getCategory(field.topic)}</div>
              <div className="text-gray-500 text-xs">
                {new Date(field.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}