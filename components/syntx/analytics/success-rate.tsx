'use client'

import { useState, useEffect } from 'react'
import { Target, CheckCircle, AlertCircle } from 'lucide-react'

interface SuccessData {
  gesamt_jobs: number
  success_rate: number
  verteilung: {
    perfekt_100: { count: number; prozent: number }
    gut_80_99: { count: number; prozent: number }
    mittel_50_79: { count: number; prozent: number }
    niedrig_0_49: { count: number; prozent: number }
  }
}

export function SuccessRate() {
  const [data, setData] = useState<SuccessData | null>(null)
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    fetch('https://dev.syntx-system.com/analytics/success-rate')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 500) }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="flex items-center justify-center p-12"><Target className="w-10 h-10 text-rose-500 animate-pulse" /></div>

  const tiers = [
    { key: 'perfekt_100', label: 'PERFEKT (100)', color: 'bg-green-500 border-green-500', icon: '💎' },
    { key: 'gut_80_99', label: 'GUT (80-99)', color: 'bg-cyan-500 border-cyan-500', icon: '🔥' },
    { key: 'mittel_50_79', label: 'MITTEL (50-79)', color: 'bg-yellow-500 border-yellow-500', icon: '⚡' },
    { key: 'niedrig_0_49', label: 'NIEDRIG (0-49)', color: 'bg-red-500 border-red-500', icon: '💧' }
  ]

  return (
    <div className="relative bg-black/80 rounded-2xl border border-rose-500/30 overflow-hidden">
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-rose-500/50" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-rose-500/50" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-rose-500/50" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-rose-500/50" />

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-rose-500/20 rounded-lg ${pulse ? 'animate-pulse' : ''}`}>
              <Target className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-rose-400">SUCCESS RATE</h3>
              <p className="text-gray-600 text-xs font-mono">// {data?.gesamt_jobs || 0} JOBS</p>
            </div>
          </div>
          <div className={`text-4xl font-black font-mono ${data?.success_rate || 0 > 50 ? 'text-green-400' : 'text-red-400'} ${pulse ? 'scale-105' : ''} transition-transform`}>
            {data?.success_rate || 0}%
          </div>
        </div>

        <div className="space-y-3">
          {tiers.map(({ key, label, color, icon }) => {
            const tier = data?.verteilung?.[key as keyof typeof data.verteilung]
            return (
              <div key={key} className="p-3 bg-black/50 border border-gray-800 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{icon}</span>
                    <span className="text-gray-300 font-mono text-sm">{label}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-500 font-mono text-xs">{tier?.count || 0}</span>
                    <span className="text-cyan-400 font-mono font-bold">{tier?.prozent?.toFixed(1) || 0}%</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                  <div className={`h-full ${color.split(' ')[0]} opacity-80`} style={{ width: `${tier?.prozent || 0}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
