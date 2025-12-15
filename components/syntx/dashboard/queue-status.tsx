'use client'

import { useState, useEffect } from 'react'
import { Layers } from 'lucide-react'

interface QueueStatus {
  status: string
  processed_today: number
  queue_depth: number
}

export function QueueStatusCard() {
  const [data, setData] = useState<QueueStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://dev.syntx-system.com/strom/queue/status')
        setData(await res.json())
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 500) }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="flex items-center justify-center p-8"><Layers className="w-8 h-8 text-blue-500 animate-pulse" /></div>

  const isReady = data?.status === 'QUEUE_READY'

  return (
    <div className="relative bg-black/80 rounded-2xl border border-blue-500/30 overflow-hidden">
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500/50" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500/50" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500/50" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500/50" />

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-blue-500/20 rounded-lg ${pulse ? 'animate-pulse' : ''}`}>
              <Layers className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-400">QUEUE STATUS</h3>
              <p className="text-gray-600 text-xs font-mono">// STROM</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-lg border ${isReady ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-red-500/50 bg-red-500/10 text-red-400'} font-mono font-bold`}>
            {data?.status}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`bg-black/50 border border-blue-500/20 rounded-xl p-4 text-center ${pulse ? 'scale-[1.02]' : ''} transition-transform`}>
            <div className="text-4xl font-black text-cyan-400 font-mono">{data?.processed_today || 0}</div>
            <div className="text-gray-600 text-xs font-mono mt-1">PROCESSED TODAY</div>
          </div>
          <div className="bg-black/50 border border-blue-500/20 rounded-xl p-4 text-center">
            <div className={`text-4xl font-black font-mono ${(data?.queue_depth || 0) > 0 ? 'text-yellow-400' : 'text-green-400'}`}>{data?.queue_depth || 0}</div>
            <div className="text-gray-600 text-xs font-mono mt-1">QUEUE DEPTH</div>
          </div>
        </div>
      </div>
    </div>
  )
}
