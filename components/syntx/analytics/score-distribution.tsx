'use client'

import { useState, useEffect } from 'react'
import { BarChart3 } from 'lucide-react'

interface Distribution {
  distribution: Record<string, number>
  statistics: { mean: number; median: number; mode: number }
  total_scores: number
}

export function ScoreDistribution() {
  const [data, setData] = useState<Distribution | null>(null)
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    fetch('https://dev.syntx-system.com/analytics/scores/distribution')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 500) }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="flex items-center justify-center p-12"><BarChart3 className="w-10 h-10 text-blue-500 animate-pulse" /></div>

  const bars = Object.entries(data?.distribution || {})
  const maxVal = Math.max(...bars.map(([_, v]) => v))

  const barColors: Record<string, string> = {
    '0-20': 'bg-red-500', '20-40': 'bg-orange-500', '40-60': 'bg-yellow-500',
    '60-80': 'bg-green-500', '80-90': 'bg-cyan-500', '90-95': 'bg-blue-500',
    '95-98': 'bg-purple-500', '98-100': 'bg-pink-500'
  }

  return (
    <div className="relative bg-black/80 rounded-2xl border border-blue-500/30 overflow-hidden">
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500/50" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500/50" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500/50" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500/50" />

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-blue-500/20 rounded-lg ${pulse ? 'animate-pulse' : ''}`}>
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-400">SCORE DISTRIBUTION</h3>
              <p className="text-gray-600 text-xs font-mono">// {data?.total_scores || 0} SCORES</p>
            </div>
          </div>
          <div className="flex space-x-4 text-sm font-mono">
            <span className="text-gray-500">MEAN: <span className="text-cyan-400">{data?.statistics?.mean?.toFixed(1)}</span></span>
            <span className="text-gray-500">MEDIAN: <span className="text-cyan-400">{data?.statistics?.median}</span></span>
          </div>
        </div>

        <div className="flex items-end justify-between h-40 space-x-1">
          {bars.map(([range, count]) => {
            const height = maxVal > 0 ? (count / maxVal) * 100 : 0
            return (
              <div key={range} className="flex-1 flex flex-col items-center">
                <div className="text-cyan-400 font-mono text-xs mb-1">{count}</div>
                <div className={`w-full ${barColors[range] || 'bg-gray-500'} rounded-t opacity-80`} style={{ height: `${height}%`, minHeight: count > 0 ? '4px' : '0' }} />
                <div className="text-gray-500 font-mono text-[10px] mt-1">{range}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
