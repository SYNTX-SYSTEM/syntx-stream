'use client'

import { useState, useEffect } from 'react'
import { Dna, AlertCircle, Loader } from 'lucide-react'

export function GenerationProgress() {
  const [data, setData] = useState<{ status: string; progress: any[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)
  const [dots, setDots] = useState('')

  useEffect(() => {
    fetch('https://dev.syntx-system.com/generation/progress')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const pulseInterval = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 500) }, 2000)
    const dotsInterval = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500)
    return () => { clearInterval(pulseInterval); clearInterval(dotsInterval) }
  }, [])

  if (loading) return <div className="flex items-center justify-center p-12"><Dna className="w-10 h-10 text-green-500 animate-spin" /></div>

  const hasProgress = data?.progress && data.progress.length > 0

  return (
    <div className="relative bg-black/80 rounded-2xl border border-green-500/30 overflow-hidden">
      {/* DNA helix animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-500/20 via-transparent to-transparent animate-pulse" />
      </div>

      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-500/50" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-500/50" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-500/50" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-500/50" />

      <div className="relative p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-3 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl ${pulse ? 'animate-spin' : ''}`}>
            <Dna className="w-7 h-7 text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              GENERATION PROGRESS
            </h3>
            <p className="text-gray-600 text-xs font-mono">// EVOLUTION ENGINE</p>
          </div>
        </div>

        {hasProgress ? (
          <div className="space-y-4">
            {data?.progress.map((item, i) => (
              <div key={i} className="p-4 bg-black/50 rounded-xl border border-green-500/30">
                <pre className="text-sm text-gray-300 font-mono">{JSON.stringify(item, null, 2)}</pre>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className={`p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full mb-4 ${pulse ? 'scale-110' : ''} transition-transform`}>
              <Loader className="w-12 h-12 text-green-400 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div className="text-xl font-bold text-green-400 mb-2">
              AWAITING EVOLUTION{dots}
            </div>
            <div className="text-gray-500 font-mono text-sm max-w-md">
              Generation engine is idle. Start a new evolution cycle to see progress data here.
            </div>
            <div className="mt-6 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
              <span className="text-green-400 font-mono text-sm">STATUS: {data?.status || 'KEINE_EVOLUTION_DATEN'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
