'use client'

import { useState, useEffect } from 'react'
import { Waves, Zap, CheckCircle, AlertTriangle } from 'lucide-react'

interface QueueResonanz {
  status: string
  resonanz_zustand: string
  felder: { incoming: number; processing: number; processed: number; error: number }
  gesamt: number
  flow_rate: number
}

export function QueueResonance() {
  const [data, setData] = useState<QueueResonanz | null>(null)
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)
  const [flowAnim, setFlowAnim] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://dev.syntx-system.com/resonanz/queue')
        setData(await res.json())
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 500) }, 2500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setFlowAnim(prev => (prev + 2) % 100), 50)
    return () => clearInterval(interval)
  }, [])

  const isKoharent = data?.resonanz_zustand === 'KOHÄRENT'

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Waves className="w-10 h-10 text-pink-500 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="relative bg-black/80 rounded-2xl border border-pink-500/30 overflow-hidden">
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-pink-500/50" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-pink-500/50" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-pink-500/50" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-pink-500/50" />

      {/* Flow Animation */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-pink-500 to-transparent" style={{ top: '30%', transform: `translateX(${flowAnim - 50}%)` }} />
        <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent" style={{ top: '60%', transform: `translateX(${50 - flowAnim}%)` }} />
      </div>

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-pink-500/20 rounded-lg ${pulse ? 'animate-pulse' : ''}`}>
              <Waves className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-pink-400">QUEUE RESONANCE</h3>
              <p className="text-gray-600 text-xs font-mono">// FLOW STATUS</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg border ${isKoharent ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
            <span className={`font-mono font-bold ${isKoharent ? 'text-green-400' : 'text-red-400'}`}>
              {data?.resonanz_zustand}
            </span>
          </div>
        </div>

        {/* Flow Rate Circle */}
        <div className="flex justify-center mb-6">
          <div className={`relative w-40 h-40 ${pulse ? 'scale-105' : 'scale-100'} transition-transform`}>
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" fill="none" stroke="#1f2937" strokeWidth="8" />
              <circle cx="80" cy="80" r="70" fill="none" stroke="url(#flowGradient)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${(data?.flow_rate || 0) * 4.4} 440`} />
              <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-black text-pink-400 font-mono">{data?.flow_rate?.toFixed(1)}%</div>
              <div className="text-gray-600 text-xs font-mono">FLOW RATE</div>
            </div>
          </div>
        </div>

        {/* Queue Stats */}
        <div className="grid grid-cols-4 gap-3">
          <StatBox label="INCOMING" value={data?.felder?.incoming || 0} color="cyan" />
          <StatBox label="PROCESSING" value={data?.felder?.processing || 0} color="blue" />
          <StatBox label="PROCESSED" value={data?.felder?.processed || 0} color="green" />
          <StatBox label="ERRORS" value={data?.felder?.error || 0} color="red" />
        </div>

        <div className="mt-4 text-center">
          <span className="text-gray-600 font-mono text-sm">TOTAL: </span>
          <span className="text-pink-400 font-mono font-bold text-lg">{data?.gesamt || 0}</span>
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    cyan: 'border-cyan-500/30 text-cyan-400',
    blue: 'border-blue-500/30 text-blue-400',
    green: 'border-green-500/30 text-green-400',
    red: 'border-red-500/30 text-red-400'
  }
  return (
    <div className={`bg-black/50 border ${colors[color].split(' ')[0]} rounded-lg p-3 text-center`}>
      <div className={`text-2xl font-bold font-mono ${colors[color].split(' ')[1]}`}>{value}</div>
      <div className="text-gray-600 text-xs font-mono">{label}</div>
    </div>
  )
}
