'use client'

import { useState, useEffect } from 'react'
import { Heart, Cpu, Database, Zap, Activity, Wifi } from 'lucide-react'

interface HealthData {
  status: string
  api_version: string
  timestamp: string
  queue_accessible: boolean
  modules: string[]
}

interface StromHealth {
  status: string
  timestamp: string
}

interface SystemResonanz {
  status: string
  system_zustand: string
  resonanz_felder: {
    queue: { incoming: number; processed: number; resonanz: string }
    qualität: { durchschnitt: number; resonanz: string }
    evolution: { generationen: number; resonanz: string }
  }
}

export function HealthHeartbeat() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [strom, setStrom] = useState<StromHealth | null>(null)
  const [resonanz, setResonanz] = useState<SystemResonanz | null>(null)
  const [pulse, setPulse] = useState(false)
  const [loading, setLoading] = useState(true)
  const [scanLine, setScanLine] = useState(0)

  const fetchAll = async () => {
    try {
      const [healthRes, stromRes, resonanzRes] = await Promise.all([
        fetch('https://dev.syntx-system.com/health'),
        fetch('https://dev.syntx-system.com/strom/health'),
        fetch('https://dev.syntx-system.com/resonanz/system')
      ])
      setHealth(await healthRes.json())
      setStrom(await stromRes.json())
      setResonanz(await resonanzRes.json())
    } catch (err) {
      console.error('Health fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 500)
    }, 2000)
    return () => clearInterval(pulseInterval)
  }, [])

  // Scan line animation
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100)
    }, 30)
    return () => clearInterval(scanInterval)
  }, [])

  const isHealthy = (status: string) => 
    status?.includes('GESUND') || status?.includes('ONLINE') || status?.includes('KOHÄRENT') || status?.includes('AKTIV')

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="relative">
          <div className="w-24 h-24 border-2 border-cyan-500/30 rounded-lg animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-t-2 border-cyan-500 rounded-full animate-spin" />
          </div>
          <div className="absolute inset-0 bg-cyan-500/20 rounded-lg blur-xl animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* MAIN CYBER HEARTBEAT PANEL */}
      <div className="relative bg-black/80 rounded-2xl border border-cyan-500/30 overflow-hidden">
        {/* Scan Line Effect */}
        <div 
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"
          style={{ top: `${scanLine}%` }}
        />
        
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50" />

        {/* Glow Effect */}
        <div className={`absolute inset-0 bg-cyan-500/5 transition-opacity duration-500 ${pulse ? 'opacity-100' : 'opacity-0'}`} />

        <div className="relative p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              {/* Animated Heart Icon */}
              <div className="relative">
                <div className={`p-4 bg-black border-2 border-cyan-500/50 rounded-xl transition-all duration-300 ${pulse ? 'border-cyan-400 shadow-lg shadow-cyan-500/50' : ''}`}>
                  <Heart className={`w-10 h-10 text-cyan-400 transition-all ${pulse ? 'scale-110 fill-cyan-500' : 'scale-100'}`} />
                </div>
                <div className={`absolute -inset-1 bg-cyan-500/30 rounded-xl blur-md transition-opacity ${pulse ? 'opacity-100' : 'opacity-0'}`} />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-cyan-400 tracking-wider">SYNTX HEARTBEAT</h2>
                <p className="text-gray-500 text-sm tracking-widest">SYSTEM PULSE MONITOR</p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg`}>
                <div className={`w-2 h-2 rounded-full ${isHealthy(health?.status || '') ? 'bg-cyan-400 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-cyan-400 text-sm font-mono">LIVE</span>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold font-mono ${isHealthy(health?.status || '') ? 'text-cyan-400' : 'text-red-400'}`}>
                  {health?.status?.replace('SYSTEM_', '')}
                </div>
                <div className="text-gray-600 text-xs font-mono">v{health?.api_version}</div>
              </div>
            </div>
          </div>

          {/* ECG Line */}
          <div className="h-16 mb-8 relative overflow-hidden">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path
                d={`M0,32 L${pulse ? '100,32 120,10 140,54 160,32 180,32 200,20 220,44 240,32' : '100,32 L500,32'} L1000,32`}
                fill="none"
                stroke="url(#ecgGradient)"
                strokeWidth="2"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
          </div>

          {/* Three Status Cards */}
          <div className="grid grid-cols-3 gap-4">
            {/* CORE HEALTH */}
            <CyberCard
              icon={<Cpu className="w-6 h-6" />}
              title="CORE HEALTH"
              value={health?.status?.replace('SYSTEM_', '') || 'UNKNOWN'}
              isHealthy={isHealthy(health?.status || '')}
              pulse={pulse}
              extra={
                <div className="mt-3 flex flex-wrap gap-1">
                  {health?.modules?.slice(0, 4).map(mod => (
                    <span key={mod} className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded text-cyan-500/70 text-xs font-mono">
                      {mod}
                    </span>
                  ))}
                </div>
              }
            />

            {/* STROM INFRA */}
            <CyberCard
              icon={<Zap className="w-6 h-6" />}
              title="STROM INFRA"
              value={strom?.status?.replace('STROM_', '') || 'UNKNOWN'}
              isHealthy={isHealthy(strom?.status || '')}
              pulse={pulse}
              extra={
                <div className="mt-3">
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r from-cyan-500 to-cyan-400 ${pulse ? 'w-full' : 'w-4/5'} transition-all duration-500`} />
                  </div>
                  <div className="text-gray-600 text-xs mt-1 font-mono">
                    {strom?.timestamp ? new Date(strom.timestamp).toLocaleTimeString() : '--:--:--'}
                  </div>
                </div>
              }
            />

            {/* RESONANZ */}
            <CyberCard
              icon={<Activity className="w-6 h-6" />}
              title="RESONANZ"
              value={resonanz?.system_zustand || 'UNKNOWN'}
              isHealthy={isHealthy(resonanz?.system_zustand || '')}
              pulse={pulse}
              extra={
                resonanz?.resonanz_felder && (
                  <div className="mt-3 space-y-1">
                    {[
                      { key: 'Queue', val: resonanz.resonanz_felder.queue?.resonanz },
                      { key: 'Qualität', val: resonanz.resonanz_felder.qualität?.resonanz },
                      { key: 'Evolution', val: resonanz.resonanz_felder.evolution?.resonanz }
                    ].map(({ key, val }) => (
                      <div key={key} className="flex justify-between text-xs font-mono">
                        <span className="text-gray-600">{key}</span>
                        <span className={isHealthy(val || '') ? 'text-cyan-400' : 'text-red-400'}>{val}</span>
                      </div>
                    ))}
                  </div>
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function CyberCard({ icon, title, value, isHealthy, pulse, extra }: any) {
  return (
    <div className={`relative bg-black/60 border rounded-xl p-4 transition-all duration-300 ${
      isHealthy ? 'border-cyan-500/30 hover:border-cyan-500/60' : 'border-red-500/30 hover:border-red-500/60'
    } ${pulse ? (isHealthy ? 'shadow-lg shadow-cyan-500/20' : 'shadow-lg shadow-red-500/20') : ''}`}>
      {/* Corner Dots */}
      <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${isHealthy ? 'bg-cyan-500' : 'bg-red-500'} ${pulse ? 'animate-ping' : ''}`} />
      
      <div className="flex items-center space-x-3 mb-3">
        <div className={`p-2 rounded-lg ${isHealthy ? 'bg-cyan-500/10 text-cyan-400' : 'bg-red-500/10 text-red-400'}`}>
          {icon}
        </div>
        <span className="text-gray-400 text-xs font-mono tracking-wider">{title}</span>
      </div>
      
      <div className={`text-xl font-bold font-mono ${isHealthy ? 'text-cyan-400' : 'text-red-400'}`}>
        {value}
      </div>
      
      {extra}
    </div>
  )
}
