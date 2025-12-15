'use client'

import { useState, useEffect } from 'react'
import { GitCompare } from 'lucide-react'

interface WrapperData { total_jobs: number; avg_score: number; success_rate: number; avg_duration_ms: number }

export function WrapperComparison() {
  const [data, setData] = useState<{ wrappers: Record<string, WrapperData> } | null>(null)
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    fetch('https://dev.syntx-system.com/compare/wrappers')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 500) }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="flex items-center justify-center p-12"><GitCompare className="w-10 h-10 text-indigo-500 animate-pulse" /></div>

  const wrappers = Object.entries(data?.wrappers || {}).sort((a, b) => b[1].avg_score - a[1].avg_score)
  const colors: Record<string, string> = {
    human: 'border-yellow-500/50 text-yellow-400',
    syntex_system: 'border-blue-500/50 text-blue-400',
    sigma: 'border-purple-500/50 text-purple-400',
    deepsweep: 'border-cyan-500/50 text-cyan-400'
  }

  return (
    <div className="relative bg-black/80 rounded-2xl border border-indigo-500/30 overflow-hidden">
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-indigo-500/50" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-indigo-500/50" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-indigo-500/50" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-indigo-500/50" />

      <div className="relative p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-2 bg-indigo-500/20 rounded-lg ${pulse ? 'animate-pulse' : ''}`}>
            <GitCompare className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-indigo-400">WRAPPER COMPARISON</h3>
            <p className="text-gray-600 text-xs font-mono">// BY SCORE</p>
          </div>
        </div>

        <div className="space-y-2">
          {wrappers.map(([name, stats], i) => {
            const color = colors[name] || 'border-gray-500/50 text-gray-400'
            return (
              <div key={name} className={`p-3 bg-black/50 border ${color.split(' ')[0]} rounded-xl ${pulse && i === 0 ? 'scale-[1.01]' : ''} transition-all`}>
                <div className="flex items-center justify-between">
                  <span className={`font-mono font-bold ${color.split(' ')[1]}`}>{name.toUpperCase()}</span>
                  <span className="text-2xl font-black text-cyan-400 font-mono">{stats.avg_score.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-xs font-mono text-gray-500 mt-1">
                  <span>{stats.total_jobs} jobs</span>
                  <span>{(stats.avg_duration_ms / 1000).toFixed(1)}s avg</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
