'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Zap } from 'lucide-react'

interface DriftItem {
  id: string
  topic: string
  style: string
  wrapper: string
  kalibrierung_score: number
  timestamp: string
  resonanz: string
}

export function DriftMonitor() {
  const [data, setData] = useState<{ count: number; drift_korper: DriftItem[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    fetch('https://dev.syntx-system.com/feld/drift')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 500) }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
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
            <div className={`p-2 bg-red-500/20 rounded-lg ${pulse ? 'animate-pulse' : ''}`}>
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-400">DRIFT MONITOR</h3>
              <p className="text-gray-600 text-xs font-mono">// FIELD LOSS DETECTION</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
            <span className="text-red-400 font-mono font-bold">{data?.count || 0} DRIFTS</span>
          </div>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {data?.drift_korper?.slice(0, 10).map((item, i) => (
            <div key={item.id} className={`p-3 bg-black/50 border border-red-500/20 rounded-lg hover:border-red-500/50 transition-all ${pulse && i === 0 ? 'border-red-500/50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-red-400 font-mono text-xs px-2 py-0.5 bg-red-500/20 rounded">DRIFT</span>
                  <span className="text-cyan-400 font-mono text-sm">{item.topic}</span>
                  <span className="text-gray-600 font-mono text-xs">{item.style}</span>
                </div>
                <div className={`font-mono font-bold ${item.kalibrierung_score > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {item.kalibrierung_score}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-600 font-mono">
                <span>{item.wrapper}</span>
                <span>{new Date(item.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
