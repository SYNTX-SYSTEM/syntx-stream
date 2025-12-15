'use client'

import { useState, useEffect } from 'react'
import { LayoutDashboard, Zap, Trophy, TrendingUp } from 'lucide-react'

export function CompleteDashboardView() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    fetch('https://dev.syntx-system.com/analytics/complete-dashboard')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 500) }, 2000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="flex items-center justify-center p-12"><LayoutDashboard className="w-10 h-10 text-cyan-500 animate-spin" /></div>

  const topics = Object.entries(data?.topics?.top_performers || {}).sort((a: any, b: any) => b[1].avg_score - a[1].avg_score)

  return (
    <div className="relative bg-black/80 rounded-2xl border border-cyan-500/30 overflow-hidden p-6">
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50" />

      <div className="flex items-center space-x-3 mb-6">
        <div className={`p-3 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-xl ${pulse ? 'animate-pulse scale-110' : ''} transition-all`}>
          <LayoutDashboard className="w-7 h-7 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">COMPLETE DASHBOARD</h3>
          <p className="text-gray-600 text-xs font-mono">// SYSTEM OVERVIEW</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-black/50 rounded-xl border border-cyan-500/30">
          <div className="text-gray-500 text-xs font-mono mb-1">TOTAL PROMPTS</div>
          <div className={`text-3xl font-black text-cyan-400 ${pulse ? 'scale-105' : ''} transition-transform`}>{data?.system_health?.total_prompts || 0}</div>
        </div>
        <div className="p-4 bg-black/50 rounded-xl border border-yellow-500/30">
          <div className="text-gray-500 text-xs font-mono mb-1">AVG SCORE</div>
          <div className="text-3xl font-black text-yellow-400">{data?.system_health?.avg_score?.toFixed(1) || 0}</div>
        </div>
        <div className="p-4 bg-black/50 rounded-xl border border-green-500/30">
          <div className="text-gray-500 text-xs font-mono mb-1">PERFECT</div>
          <div className="text-3xl font-black text-green-400">{data?.system_health?.perfect_scores || 0}</div>
        </div>
        <div className="p-4 bg-black/50 rounded-xl border border-purple-500/30">
          <div className="text-gray-500 text-xs font-mono mb-1">SUCCESS RATE</div>
          <div className="text-3xl font-black text-purple-400">{data?.system_health?.success_rate || 0}%</div>
        </div>
      </div>

      <h4 className="text-sm font-mono text-gray-500 mb-3">TOP TOPICS</h4>
      <div className="space-y-2">
        {topics.slice(0, 5).map(([topic, stats]: any) => (
          <div key={topic} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-800">
            <span className="text-gray-300 font-mono">{topic}</span>
            <span className="text-cyan-400 font-bold font-mono">{stats.avg_score.toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
