'use client'

import { useState, useEffect } from 'react'
import { PieChart } from 'lucide-react'

export function TopicDistribution() {
  const [data, setData] = useState<{ topic_counts: Record<string, number> } | null>(null)
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    fetch('https://dev.syntx-system.com/feld/topics')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 500) }, 3000)
    return () => clearInterval(interval)
  }, [])

  const colors: Record<string, string> = {
    harmlos: 'bg-green-500 border-green-500',
    bildung: 'bg-blue-500 border-blue-500',
    technologie: 'bg-cyan-500 border-cyan-500',
    gesellschaft: 'bg-purple-500 border-purple-500',
    kontrovers: 'bg-orange-500 border-orange-500',
    grenzwertig: 'bg-yellow-500 border-yellow-500',
    kritisch: 'bg-red-500 border-red-500',
    unknown: 'bg-gray-500 border-gray-500'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <PieChart className="w-10 h-10 text-purple-500 animate-pulse" />
      </div>
    )
  }

  const topics = Object.entries(data?.topic_counts || {}).sort((a, b) => b[1] - a[1])
  const total = topics.reduce((acc, [_, count]) => acc + count, 0)

  return (
    <div className="relative bg-black/80 rounded-2xl border border-purple-500/30 overflow-hidden">
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-500/50" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-purple-500/50" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-purple-500/50" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-500/50" />

      <div className="relative p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-2 bg-purple-500/20 rounded-lg ${pulse ? 'animate-pulse' : ''}`}>
            <PieChart className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-purple-400">TOPIC DISTRIBUTION</h3>
            <p className="text-gray-600 text-xs font-mono">// {total} TOTAL PROMPTS</p>
          </div>
        </div>

        <div className="space-y-3">
          {topics.map(([topic, count], i) => {
            const percentage = (count / total) * 100
            const color = colors[topic] || colors.unknown
            return (
              <div key={topic} className={`${pulse && i === 0 ? 'scale-[1.02]' : ''} transition-transform`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${color.split(' ')[0]}`} />
                    <span className="text-gray-300 font-mono text-sm">{topic}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-500 font-mono text-xs">{percentage.toFixed(1)}%</span>
                    <span className="text-cyan-400 font-mono font-bold">{count}</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                  <div className={`h-full ${color.split(' ')[0]} opacity-80`} style={{ width: `${percentage}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
