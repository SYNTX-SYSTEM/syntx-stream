'use client'

import { useState, useEffect } from 'react'
import { Coins } from 'lucide-react'

interface CostData {
  total_prompts: number
  total_cost_usd: number
  total_tokens: { input: number; output: number }
  avg_cost_per_prompt: number
}

export function CostTracker() {
  const [data, setData] = useState<CostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    fetch('https://dev.syntx-system.com/prompts/costs/total')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 500) }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="flex items-center justify-center p-12"><Coins className="w-10 h-10 text-green-500 animate-pulse" /></div>

  return (
    <div className="relative bg-black/80 rounded-2xl border border-emerald-500/30 overflow-hidden">
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-500/50" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-500/50" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-500/50" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-500/50" />

      <div className="relative p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-2 bg-emerald-500/20 rounded-lg ${pulse ? 'animate-pulse' : ''}`}>
            <Coins className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-emerald-400">COST TRACKER</h3>
            <p className="text-gray-600 text-xs font-mono">// API SPEND</p>
          </div>
        </div>

        <div className={`text-center mb-4 ${pulse ? 'scale-105' : ''} transition-transform`}>
          <div className="text-5xl font-black text-emerald-400 font-mono">${data?.total_cost_usd?.toFixed(2)}</div>
          <div className="text-gray-600 font-mono text-sm">TOTAL</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/50 border border-emerald-500/20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-cyan-400 font-mono">{data?.total_prompts}</div>
            <div className="text-gray-600 text-xs font-mono">PROMPTS</div>
          </div>
          <div className="bg-black/50 border border-emerald-500/20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-yellow-400 font-mono">${data?.avg_cost_per_prompt?.toFixed(4)}</div>
            <div className="text-gray-600 text-xs font-mono">AVG/PROMPT</div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 text-center">
          <div className="bg-black/30 rounded-lg p-2">
            <div className="text-sm font-mono text-gray-400">{((data?.total_tokens?.input || 0) / 1000).toFixed(1)}K</div>
            <div className="text-gray-600 text-xs font-mono">INPUT</div>
          </div>
          <div className="bg-black/30 rounded-lg p-2">
            <div className="text-sm font-mono text-gray-400">{((data?.total_tokens?.output || 0) / 1000).toFixed(1)}K</div>
            <div className="text-gray-600 text-xs font-mono">OUTPUT</div>
          </div>
        </div>
      </div>
    </div>
  )
}
