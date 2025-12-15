'use client'

import { useState, useEffect } from 'react'
import { Timer, Zap } from 'lucide-react'

interface PerformanceData {
  gesamt: { avg_duration_ms: number; min_ms: number; max_ms: number; total_jobs: number }
  by_wrapper: Record<string, { avg_ms: number; min_ms: number; max_ms: number; count: number }>
}

export function PerformanceMetrics() {
  const [data, setData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    fetch('https://dev.syntx-system.com/analytics/performance')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 500) }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="flex items-center justify-center p-12"><Timer className="w-10 h-10 text-amber-500 animate-pulse" /></div>

  const wrappers = Object.entries(data?.by_wrapper || {}).sort((a, b) => a[1].avg_ms - b[1].avg_ms)
  const maxAvg = Math.max(...wrappers.map(([_, w]) => w.avg_ms))

  const colors: Record<string, string> = {
    human: 'bg-yellow-500', syntex_system: 'bg-blue-500', sigma: 'bg-purple-500', deepsweep: 'bg-cyan-500'
  }

  return (
    <div className="relative bg-black/80 rounded-2xl border border-amber-500/30 overflow-hidden">
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500/50" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500/50" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500/50" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500/50" />

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-amber-500/20 rounded-lg ${pulse ? 'animate-pulse' : ''}`}>
              <Timer className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-400">PERFORMANCE</h3>
              <p className="text-gray-600 text-xs font-mono">// DURATION BY WRAPPER</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-400 font-mono">{(data?.gesamt?.avg_duration_ms || 0 / 1000).toFixed(1)}s</div>
            <div className="text-gray-600 text-xs font-mono">AVG TOTAL</div>
          </div>
        </div>

        <div className="space-y-3">
          {wrappers.map(([name, stats], i) => {
            const width = (stats.avg_ms / maxAvg) * 100
            const color = colors[name] || 'bg-gray-500'
            return (
              <div key={name} className={`${pulse && i === 0 ? 'scale-[1.01]' : ''} transition-all`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300 font-mono text-sm">{name.toUpperCase()}</span>
                  <div className="flex items-center space-x-4 text-xs font-mono">
                    <span className="text-gray-500">min: {(stats.min_ms / 1000).toFixed(1)}s</span>
                    <span className="text-amber-400 font-bold">{(stats.avg_ms / 1000).toFixed(1)}s</span>
                    <span className="text-gray-500">max: {(stats.max_ms / 1000).toFixed(1)}s</span>
                  </div>
                </div>
                <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
                  <div className={`h-full ${color} opacity-80 rounded-full`} style={{ width: `${width}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
