'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Zap } from 'lucide-react'

interface Combination {
  combination: string
  avg_score: number
  sample_count: number
  power_rating: string
}

export function KeywordCombinations() {
  const [data, setData] = useState<{ top_combinations: Combination[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    fetch('https://dev.syntx-system.com/prompts/advanced/keyword-combinations')
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
        <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="relative bg-black/80 rounded-2xl border border-purple-500/30 overflow-hidden">
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-500/50" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-purple-500/50" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-purple-500/50" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-500/50" />

      <div className="relative p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-purple-400">POWER COMBINATIONS</h3>
            <p className="text-gray-600 text-xs font-mono">// TOP KEYWORD PAIRS</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {data?.top_combinations?.slice(0, 8).map((combo, i) => (
            <div key={combo.combination} className={`p-4 bg-black/50 border border-purple-500/20 rounded-xl hover:border-purple-500/50 transition-all ${pulse && i === 0 ? 'border-purple-500/50 shadow-lg shadow-purple-500/20' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{combo.power_rating}</span>
                <span className="text-purple-400 font-mono font-bold text-xl">{combo.avg_score}</span>
              </div>
              <div className="text-cyan-400 font-mono text-sm mb-1">{combo.combination}</div>
              <div className="text-gray-600 text-xs font-mono">samples: {combo.sample_count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
