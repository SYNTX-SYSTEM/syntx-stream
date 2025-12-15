'use client'

import { useState, useEffect } from 'react'
import { Activity, Clock, AlertTriangle, CheckCircle, Zap, TrendingUp } from 'lucide-react'

interface QueueData {
  status: string
  timestamp: string
  system_health: string
  queue: { incoming: number; processing: number; processed: number; errors: number }
  recent_completed: { filename: string; score: number; wrapper: string; completed_at: string; rating: string }[]
  performance: { jobs_per_hour: number }
  insights?: string[]
}

export function LiveQueueMonitor() {
  const [data, setData] = useState<QueueData | null>(null)
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)
  const [scanLine, setScanLine] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://dev.syntx-system.com/monitoring/live-queue')
        setData(await res.json())
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const pulseInterval = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 400) }, 2000)
    return () => clearInterval(pulseInterval)
  }, [])

  useEffect(() => {
    const scanInterval = setInterval(() => setScanLine(prev => (prev + 1) % 100), 30)
    return () => clearInterval(scanInterval)
  }, [])

  const getHealthStatus = (health: string) => {
    if (health?.includes('HEALTHY')) return { color: 'cyan', label: 'HEALTHY' }
    if (health?.includes('LOW')) return { color: 'yellow', label: 'LOW QUEUE' }
    return { color: 'red', label: 'CRITICAL' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="relative w-20 h-20 border-2 border-cyan-500/30 rounded-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="w-8 h-8 text-cyan-500 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  const status = getHealthStatus(data?.system_health || '')
  const total = (data?.queue?.incoming || 0) + (data?.queue?.processed || 0)

  return (
    <div className="relative bg-black/80 rounded-2xl border border-cyan-500/30 overflow-hidden">
      {/* Scan Line */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" style={{ top: `${scanLine}%` }} />
      
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-500/50" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-500/50" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-500/50" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-500/50" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 bg-black border-2 border-cyan-500/50 rounded-xl ${pulse ? 'shadow-lg shadow-cyan-500/30' : ''} transition-all`}>
              <Activity className={`w-8 h-8 text-cyan-400 ${pulse ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-cyan-400 tracking-wider">LIVE QUEUE MONITOR</h2>
              <p className="text-gray-600 text-xs tracking-widest font-mono">REAL-TIME PROCESSING STREAM</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`px-4 py-2 bg-black/50 border rounded-lg ${status.color === 'cyan' ? 'border-cyan-500/50' : status.color === 'yellow' ? 'border-yellow-500/50' : 'border-red-500/50'}`}>
              <span className={`font-mono font-bold ${status.color === 'cyan' ? 'text-cyan-400' : status.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'}`}>
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {/* Queue Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <QueueStat icon={<Zap />} label="INCOMING" value={data?.queue?.incoming || 0} total={total} color="cyan" pulse={pulse} />
          <QueueStat icon={<Activity />} label="PROCESSING" value={data?.queue?.processing || 0} total={total} color="blue" pulse={pulse} active />
          <QueueStat icon={<CheckCircle />} label="PROCESSED" value={data?.queue?.processed || 0} total={total} color="green" pulse={pulse} />
          <QueueStat icon={<AlertTriangle />} label="ERRORS" value={data?.queue?.errors || 0} total={total} color="red" pulse={pulse} />
        </div>

        {/* Performance Bar */}
        <div className="bg-black/50 border border-cyan-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-xs font-mono">PROCESSING RATE</span>
            <span className="text-cyan-400 font-mono font-bold">{data?.performance?.jobs_per_hour || 0} jobs/hr</span>
          </div>
          <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-1000 ${pulse ? 'opacity-100' : 'opacity-70'}`} 
                 style={{ width: `${Math.min((data?.performance?.jobs_per_hour || 0) / 100 * 100, 100)}%` }} />
          </div>
        </div>

        {/* Insights */}
        {data?.insights && data.insights.length > 0 && (
          <div className="bg-black/50 border border-cyan-500/20 rounded-xl p-4 mb-6">
            <div className="text-gray-500 text-xs font-mono mb-3">// LIVE INSIGHTS</div>
            <div className="space-y-2">
              {data.insights.map((insight, i) => (
                <div key={i} className="text-cyan-400/80 text-sm font-mono pl-3 border-l-2 border-cyan-500/30">{insight}</div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Completed */}
        {data?.recent_completed && data.recent_completed.length > 0 && (
          <div className="bg-black/50 border border-green-500/20 rounded-xl p-4">
            <div className="text-gray-500 text-xs font-mono mb-3">// RECENT COMPLETED [{data.recent_completed.length}]</div>
            <div className="space-y-2">
              {data.recent_completed.slice(0, 5).map((job, i) => (
                <div key={i} className={`flex items-center justify-between p-3 bg-black/50 border border-gray-800 rounded-lg hover:border-cyan-500/30 transition-all ${pulse && i === 0 ? 'border-cyan-500/50' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{job.rating}</span>
                    <div>
                      <div className="text-gray-300 text-sm font-mono">{job.filename.split('__')[1]?.replace('topic_', '') || 'unknown'}</div>
                      <div className="text-gray-600 text-xs font-mono">{job.wrapper} • {job.completed_at}</div>
                    </div>
                  </div>
                  <div className={`text-xl font-mono font-bold ${job.score >= 80 ? 'text-green-400' : job.score >= 50 ? 'text-yellow-400' : job.score > 0 ? 'text-orange-400' : 'text-red-400'}`}>
                    {job.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function QueueStat({ icon, label, value, total, color, pulse, active = false }: any) {
  const percentage = total > 0 ? (value / total) * 100 : 0
  const colors: Record<string, { border: string, text: string, bg: string }> = {
    cyan: { border: 'border-cyan-500/30', text: 'text-cyan-400', bg: 'bg-cyan-500' },
    blue: { border: 'border-blue-500/30', text: 'text-blue-400', bg: 'bg-blue-500' },
    green: { border: 'border-green-500/30', text: 'text-green-400', bg: 'bg-green-500' },
    red: { border: 'border-red-500/30', text: 'text-red-400', bg: 'bg-red-500' }
  }
  const c = colors[color]

  return (
    <div className={`relative bg-black/60 border ${c.border} rounded-xl p-4 ${pulse ? 'shadow-lg shadow-cyan-500/10' : ''} transition-all`}>
      <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${c.bg} ${active && pulse ? 'animate-ping' : ''}`} />
      
      <div className="flex items-center space-x-2 mb-2">
        <div className={`${c.text} opacity-60`}>{icon}</div>
        <span className="text-gray-600 text-xs font-mono">{label}</span>
      </div>
      
      <div className={`text-3xl font-bold font-mono ${c.text} mb-3`}>{value.toLocaleString()}</div>
      
      <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
        <div className={`h-full ${c.bg} transition-all duration-500`} style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>
      <div className="text-right text-xs text-gray-700 font-mono mt-1">{percentage.toFixed(1)}%</div>
    </div>
  )
}
