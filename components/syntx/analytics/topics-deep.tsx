'use client'

import { useState, useEffect } from 'react'
import { Hash, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface TopicData {
  count: number
  avg_score: number
  perfect_count: number
  min_score: number
  max_score: number
}

export function TopicsDeepAnalytics() {
  const [data, setData] = useState<{ topics: Record<string, TopicData> } | null>(null)
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  useEffect(() => {
    fetch('https://dev.syntx-system.com/analytics/topics')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 400) }, 2500)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="flex items-center justify-center p-12"><Hash className="w-10 h-10 text-purple-500 animate-pulse" /></div>

  const topics = Object.entries(data?.topics || {}).sort((a, b) => b[1].avg_score - a[1].avg_score)
  const maxCount = Math.max(...topics.map(([_, t]) => t.count))

  const COLORS: Record<string, string> = {
    gesellschaft: 'from-cyan-500 to-blue-500',
    bildung: 'from-purple-500 to-pink-500',
    kritisch: 'from-red-500 to-orange-500',
    grenzwertig: 'from-yellow-500 to-amber-500',
    technologie: 'from-blue-500 to-indigo-500',
    harmlos: 'from-green-500 to-emerald-500',
    kontrovers: 'from-orange-500 to-red-500'
  }

  return (
    <div className="relative bg-black/80 rounded-2xl border border-purple-500/30 overflow-hidden">
      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent animate-pulse" />
      </div>

      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-500/50" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-purple-500/50" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-purple-500/50" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-500/50" />

      <div className="relative p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-3 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl ${pulse ? 'animate-bounce' : ''}`}>
            <Hash className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              TOPICS DEEP ANALYTICS
            </h3>
            <p className="text-gray-600 text-xs font-mono">// {topics.length} CATEGORIES</p>
          </div>
        </div>

        <div className="space-y-3">
          {topics.map(([topic, stats], i) => {
            const widthPercent = (stats.count / maxCount) * 100
            const gradient = COLORS[topic] || 'from-gray-500 to-gray-600'
            const isSelected = selectedTopic === topic
            
            return (
              <div 
                key={topic} 
                className={`relative p-4 bg-black/50 rounded-xl border transition-all cursor-pointer ${isSelected ? 'border-purple-500/80 scale-[1.02]' : 'border-gray-800 hover:border-purple-500/50'}`}
                onClick={() => setSelectedTopic(isSelected ? null : topic)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-mono font-bold">{topic.toUpperCase()}</span>
                  <div className="flex items-center space-x-3">
                    <span className={`text-2xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${pulse && i === 0 ? 'scale-110' : ''} transition-transform`}>
                      {stats.avg_score.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="h-2 bg-gray-900 rounded-full overflow-hidden mb-2">
                  <div className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`} 
                    style={{ width: `${widthPercent}%` }} />
                </div>
                
                {/* Stats row */}
                <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                  <span>{stats.count} prompts</span>
                  <span>min: {stats.min_score} | max: {stats.max_score}</span>
                  <span className="text-green-400">{stats.perfect_count} perfect</span>
                </div>

                {/* Expanded details */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-4 gap-3 animate-in slide-in-from-top-2">
                    <div className="text-center p-2 bg-black/30 rounded-lg">
                      <div className="text-lg font-bold text-cyan-400">{stats.count}</div>
                      <div className="text-[10px] text-gray-600">COUNT</div>
                    </div>
                    <div className="text-center p-2 bg-black/30 rounded-lg">
                      <div className="text-lg font-bold text-green-400">{stats.min_score}</div>
                      <div className="text-[10px] text-gray-600">MIN</div>
                    </div>
                    <div className="text-center p-2 bg-black/30 rounded-lg">
                      <div className="text-lg font-bold text-yellow-400">{stats.max_score}</div>
                      <div className="text-[10px] text-gray-600">MAX</div>
                    </div>
                    <div className="text-center p-2 bg-black/30 rounded-lg">
                      <div className="text-lg font-bold text-purple-400">{stats.perfect_count}</div>
                      <div className="text-[10px] text-gray-600">PERFECT</div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
