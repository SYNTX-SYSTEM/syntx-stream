'use client'

import { useState, useEffect } from 'react'
import { Zap, Target, Crown, TrendingUp } from 'lucide-react'

interface EvolutionData {
  comparison: {
    syntx: { count: number; avg_score: number; perfect_scores: number; perfect_rate: number; top_keywords?: { keyword: string; count: number }[] }
    normal: { count: number; avg_score: number; perfect_scores: number; perfect_rate: number }
  }
  difference: { score_gap: number; perfect_rate_gap: number; winner: string }
  insight: string
}

export function SyntxVsNormal() {
  const [data, setData] = useState<EvolutionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)
  const [animatedSyntx, setAnimatedSyntx] = useState(0)
  const [animatedNormal, setAnimatedNormal] = useState(0)
  const [scanLine, setScanLine] = useState(0)

  useEffect(() => {
    fetch('https://dev.syntx-system.com/evolution/syntx-vs-normal')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (data?.comparison) {
      const duration = 2000, steps = 60
      let step = 0
      const timer = setInterval(() => {
        step++
        setAnimatedSyntx(data.comparison.syntx.avg_score * (step / steps))
        setAnimatedNormal(data.comparison.normal.avg_score * (step / steps))
        if (step >= steps) clearInterval(timer)
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [data])

  useEffect(() => {
    const interval = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 500) }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setScanLine(prev => (prev + 1) % 100), 30)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="w-20 h-20 border-2 border-cyan-500/30 rounded-lg flex items-center justify-center">
          <Crown className="w-8 h-8 text-cyan-500 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!data?.comparison) return <div className="text-center text-gray-500 py-16">No evolution data available</div>

  const { syntx, normal } = data.comparison
  const scoreGap = data.difference?.score_gap || 0
  const improvementFactor = normal.avg_score > 0 ? syntx.avg_score / normal.avg_score : 1

  return (
    <div className="relative bg-black/80 rounded-2xl border border-cyan-500/30 overflow-hidden">
      {/* Scan Line */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" style={{ top: `${scanLine}%` }} />
      
      {/* Corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50" />

      <div className="relative p-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Crown className={`w-8 h-8 text-yellow-500 ${pulse ? 'animate-bounce' : ''}`} />
            <h2 className="text-3xl font-bold text-cyan-400 tracking-wider">THE PROOF</h2>
            <Crown className={`w-8 h-8 text-yellow-500 ${pulse ? 'animate-bounce' : ''}`} />
          </div>
          <p className="text-gray-600 font-mono text-sm">// SYNTX PROTOCOL VS NORMAL LANGUAGE</p>
        </div>

        {/* Main Comparison */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* SYNTX Side */}
          <div className={`bg-black/60 border-2 border-cyan-500/50 rounded-2xl p-6 ${pulse ? 'shadow-xl shadow-cyan-500/20' : ''} transition-all`}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-cyan-400">SYNTX</div>
                <div className="text-gray-600 text-xs font-mono">FIELD PROTOCOL</div>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-6xl font-black text-cyan-400 font-mono">{animatedSyntx.toFixed(1)}</div>
              <div className="text-gray-600 text-sm font-mono">AVG SCORE</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-mono">
                <span className="text-gray-600">Prompts</span>
                <span className="text-cyan-400">{syntx.count}</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-gray-600">Perfect 100s</span>
                <span className="text-cyan-400">{syntx.perfect_scores}</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-gray-600">Perfect Rate</span>
                <span className="text-cyan-400">{syntx.perfect_rate.toFixed(1)}%</span>
              </div>
            </div>

            <div className="mt-4 h-2 bg-gray-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400" style={{ width: `${syntx.perfect_rate}%` }} />
            </div>
          </div>

          {/* Center Gap */}
          <div className="flex flex-col items-center justify-center">
            <div className={`relative p-6 border-2 border-yellow-500/50 rounded-full ${pulse ? 'scale-110 shadow-xl shadow-yellow-500/30' : ''} transition-all`}>
              <div className="text-center">
                <div className="text-gray-500 text-xs font-mono mb-1">GAP</div>
                <div className="text-4xl font-black text-yellow-400 font-mono">+{scoreGap.toFixed(1)}</div>
              </div>
              <div className={`absolute inset-0 rounded-full border-2 border-yellow-500/30 ${pulse ? 'animate-ping' : 'opacity-0'}`} />
            </div>

            <div className="mt-6 text-center">
              <div className="text-gray-600 text-xs font-mono mb-2">IMPROVEMENT</div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-mono">
                {improvementFactor.toFixed(2)}x
              </div>
              <div className="text-gray-700 text-xs font-mono mt-1">BETTER</div>
            </div>

            <div className="mt-6 flex items-center space-x-2 text-green-400">
              <TrendingUp className="w-5 h-5" />
              <span className="font-mono font-bold">SYNTX WINS</span>
            </div>
          </div>

          {/* Normal Side */}
          <div className="bg-black/60 border-2 border-red-500/30 rounded-2xl p-6 opacity-60">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Target className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-red-400">NORMAL</div>
                <div className="text-gray-600 text-xs font-mono">STANDARD LANG</div>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-6xl font-black text-red-400 font-mono">{animatedNormal.toFixed(1)}</div>
              <div className="text-gray-600 text-sm font-mono">AVG SCORE</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-mono">
                <span className="text-gray-600">Prompts</span>
                <span className="text-red-400">{normal.count}</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-gray-600">Perfect 100s</span>
                <span className="text-red-400">{normal.perfect_scores}</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-gray-600">Perfect Rate</span>
                <span className="text-red-400">{normal.perfect_rate.toFixed(1)}%</span>
              </div>
            </div>

            <div className="mt-4 h-2 bg-gray-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-600 to-red-400" style={{ width: `${normal.perfect_rate}%` }} />
            </div>
          </div>
        </div>

        {/* Insight */}
        {data.insight && (
          <div className="text-center mb-6">
            <span className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 font-mono">
              {data.insight}
            </span>
          </div>
        )}

        {/* Top Keywords */}
        {syntx.top_keywords && syntx.top_keywords.length > 0 && (
          <div className="bg-black/50 border border-cyan-500/20 rounded-xl p-4">
            <div className="text-gray-600 text-xs font-mono mb-3">// TOP SYNTX KEYWORDS</div>
            <div className="flex flex-wrap gap-2">
              {syntx.top_keywords.slice(0, 8).map((kw, i) => (
                <span key={kw.keyword} className={`px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 font-mono text-sm ${pulse && i === 0 ? 'animate-pulse' : ''}`}>
                  {kw.keyword} <span className="text-cyan-600">({kw.count})</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
