'use client'

import { useState, useEffect } from 'react'
import { Award, Zap } from 'lucide-react'

interface WrapperSuccess {
  total_jobs: number
  success_rate: number
  avg_score: number
}

export function SuccessByWrapper() {
  const [data, setData] = useState<{ wrappers: Record<string, WrapperSuccess> } | null>(null)
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)
  const [glowIndex, setGlowIndex] = useState(0)

  useEffect(() => {
    fetch('https://dev.syntx-system.com/analytics/success-rate/by-wrapper')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const pulseInterval = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 300) }, 2000)
    const glowInterval = setInterval(() => setGlowIndex(i => (i + 1) % 4), 1500)
    return () => { clearInterval(pulseInterval); clearInterval(glowInterval) }
  }, [])

  if (loading) return <div className="flex items-center justify-center p-12"><Award className="w-10 h-10 text-yellow-500 animate-pulse" /></div>

  const wrappers = Object.entries(data?.wrappers || {}).sort((a, b) => b[1].avg_score - a[1].avg_score)
  
  const WRAPPER_STYLES: Record<string, { gradient: string; border: string; glow: string }> = {
    human: { gradient: 'from-yellow-400 to-orange-500', border: 'border-yellow-500/50', glow: 'shadow-yellow-500/50' },
    syntex_system: { gradient: 'from-blue-400 to-cyan-500', border: 'border-blue-500/50', glow: 'shadow-blue-500/50' },
    sigma: { gradient: 'from-purple-400 to-pink-500', border: 'border-purple-500/50', glow: 'shadow-purple-500/50' },
    deepsweep: { gradient: 'from-cyan-400 to-teal-500', border: 'border-cyan-500/50', glow: 'shadow-cyan-500/50' }
  }

  return (
    <div className="relative bg-black/80 rounded-2xl border border-yellow-500/30 overflow-hidden">
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-500/50" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-500/50" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-500/50" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-500/50" />

      <div className="relative p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-3 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-xl ${pulse ? 'rotate-12 scale-110' : ''} transition-all`}>
            <Award className="w-7 h-7 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              SUCCESS BY WRAPPER
            </h3>
            <p className="text-gray-600 text-xs font-mono">// PERFORMANCE RANKING</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wrappers.map(([name, stats], i) => {
            const style = WRAPPER_STYLES[name] || WRAPPER_STYLES.sigma
            const isGlowing = glowIndex === i
            
            return (
              <div 
                key={name} 
                className={`relative p-5 bg-black/50 rounded-xl border ${style.border} transition-all duration-500 ${isGlowing ? `shadow-lg ${style.glow} scale-[1.02]` : ''}`}
              >
                {/* Rank badge */}
                <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${style.gradient} flex items-center justify-center text-white font-black text-sm ${pulse ? 'scale-125' : ''} transition-transform`}>
                  #{i + 1}
                </div>

                <div className="mb-4">
                  <div className={`text-2xl font-black bg-gradient-to-r ${style.gradient} bg-clip-text text-transparent`}>
                    {name.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className={`text-3xl font-black text-white ${isGlowing ? 'animate-pulse' : ''}`}>{stats.avg_score.toFixed(1)}</div>
                    <div className="text-[10px] font-mono text-gray-500">AVG SCORE</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-300">{stats.total_jobs}</div>
                    <div className="text-[10px] font-mono text-gray-500">JOBS</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${stats.success_rate > 0 ? 'text-green-400' : 'text-red-400'}`}>{stats.success_rate}%</div>
                    <div className="text-[10px] font-mono text-gray-500">SUCCESS</div>
                  </div>
                </div>

                {/* Animated bar */}
                <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${style.gradient} rounded-full transition-all duration-1000`} 
                    style={{ width: `${(stats.avg_score / 100) * 100}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
