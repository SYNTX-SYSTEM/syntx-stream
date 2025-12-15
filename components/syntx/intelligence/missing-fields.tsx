'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Shield, TrendingDown } from 'lucide-react'

interface FieldAnalysis {
  field: string
  detection_rate: number
  detected_count: number
  missing_count: number
  severity: string
}

export function MissingFieldsAnalysis() {
  const [data, setData] = useState<{ fields_by_detection_rate: FieldAnalysis[], total_jobs_analyzed: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://dev.syntx-system.com/prompts/advanced/fields-missing-analysis')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const getSeverityColor = (severity: string) => {
    if (severity === 'CRITICAL') return { border: 'border-red-500/50', text: 'text-red-400', bg: 'bg-red-500' }
    if (severity === 'WARNING') return { border: 'border-yellow-500/50', text: 'text-yellow-400', bg: 'bg-yellow-500' }
    return { border: 'border-green-500/50', text: 'text-green-400', bg: 'bg-green-500' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-16 h-16 border-2 border-red-500/30 rounded-lg flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-black/80 rounded-2xl border border-red-500/30 overflow-hidden">
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-500/50" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-red-500/50" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-red-500/50" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-red-500/50" />

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-400">FIELD DETECTION GAPS</h3>
              <p className="text-gray-600 text-xs font-mono">// MISSING FIELD ANALYSIS</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-500 text-xs font-mono">ANALYZED</div>
            <div className="text-cyan-400 font-mono font-bold">{data?.total_jobs_analyzed || 0}</div>
          </div>
        </div>

        <div className="space-y-3">
          {data?.fields_by_detection_rate?.slice(0, 6).map((field, i) => {
            const colors = getSeverityColor(field.severity)
            return (
              <div key={field.field} className={`p-4 bg-black/50 border ${colors.border} rounded-xl`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 ${colors.bg}/20 ${colors.text} text-xs font-mono rounded`}>
                      {field.severity}
                    </span>
                    <span className="text-white font-mono font-bold">{field.field}</span>
                  </div>
                  <span className={`text-2xl font-black font-mono ${colors.text}`}>
                    {field.detection_rate.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                  <div className={`h-full ${colors.bg}`} style={{ width: `${Math.min(field.detection_rate, 100)}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-600 font-mono mt-1">
                  <span>Detected: {field.detected_count}</span>
                  <span>Missing: {field.missing_count}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
