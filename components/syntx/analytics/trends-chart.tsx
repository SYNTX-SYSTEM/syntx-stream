'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface TrendsData {
  current_avg: number
  trend: string
  velocity: number
  predicted_next: number
  moving_average: number[]
}

export function TrendsChart() {
  const [data, setData] = useState<TrendsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    fetch('https://dev.syntx-system.com/analytics/trends')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 500) }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="flex items-center justify-center p-12"><TrendingUp className="w-10 h-10 text-green-500 animate-pulse" /></div>

  const TrendIcon = data?.trend === 'STEIGEND' ? TrendingUp : data?.trend === 'FALLEND' ? TrendingDown : Minus
  const trendColor = data?.trend === 'STEIGEND' ? 'text-green-400' : data?.trend === 'FALLEND' ? 'text-red-400' : 'text-yellow-400'
  const ma = data?.moving_average || []
  const maxMa = Math.max(...ma, 1)

  return (
    <div className="relative bg-black/80 rounded-2xl border border-green-500/30 overflow-hidden">
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green-500/50" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-500/50" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-500/50" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-500/50" />

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-green-500/20 rounded-lg ${pulse ? 'animate-pulse' : ''}`}>
              <TrendIcon className={`w-6 h-6 ${trendColor}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-400">TRENDS</h3>
              <p className="text-gray-600 text-xs font-mono">// MOVING AVG</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-lg border ${trendColor} border-current bg-current/10 font-mono font-bold`}>{data?.trend}</span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-black/50 rounded-lg p-2 text-center border border-green-500/20">
            <div className="text-xl font-bold text-cyan-400 font-mono">{data?.current_avg?.toFixed(1)}</div>
            <div className="text-gray-600 text-[10px] font-mono">CURRENT</div>
          </div>
          <div className="bg-black/50 rounded-lg p-2 text-center border border-green-500/20">
            <div className="text-xl font-bold text-yellow-400 font-mono">{data?.velocity?.toFixed(2)}</div>
            <div className="text-gray-600 text-[10px] font-mono">VELOCITY</div>
          </div>
          <div className="bg-black/50 rounded-lg p-2 text-center border border-green-500/20">
            <div className="text-xl font-bold text-purple-400 font-mono">{data?.predicted_next}</div>
            <div className="text-gray-600 text-[10px] font-mono">PREDICTED</div>
          </div>
        </div>

        <div className="h-16 flex items-end space-x-px">
          {ma.slice(-20).map((val, i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t opacity-80" style={{ height: `${(val / maxMa) * 100}%`, minHeight: val > 0 ? '2px' : '0' }} />
          ))}
        </div>
      </div>
    </div>
  )
}
