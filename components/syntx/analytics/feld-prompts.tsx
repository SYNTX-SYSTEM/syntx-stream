'use client'

import { useState, useEffect } from 'react'
import { FileStack, Ghost } from 'lucide-react'

export function FeldPrompts() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    fetch('https://dev.syntx-system.com/feld/prompts')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 500) }, 2000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="flex items-center justify-center p-12"><FileStack className="w-10 h-10 text-pink-500 animate-pulse" /></div>

  const isEmpty = (data?.total_prompts || 0) === 0

  return (
    <div className="relative bg-black/80 rounded-2xl border border-pink-500/30 overflow-hidden p-6">
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-pink-500/50" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-pink-500/50" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-pink-500/50" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-pink-500/50" />

      <div className="flex items-center space-x-3 mb-6">
        <div className={`p-3 bg-gradient-to-br from-pink-500/30 to-rose-500/30 rounded-xl ${pulse ? 'scale-110' : ''} transition-transform`}>
          <FileStack className="w-7 h-7 text-pink-400" />
        </div>
        <div>
          <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">FELD PROMPTS</h3>
          <p className="text-gray-600 text-xs font-mono">// /feld/prompts</p>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Ghost className={`w-20 h-20 text-pink-400/50 ${pulse ? 'scale-110 animate-bounce' : ''} transition-transform`} />
          <div className="text-2xl font-bold text-pink-400 mt-4">KEINE FELD-PROMPTS</div>
          <div className="text-gray-500 font-mono text-sm mt-2">Endpoint ist aktuell leer</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-black/50 rounded-xl border border-pink-500/30 text-center">
            <div className="text-5xl font-black text-pink-400">{data?.total_prompts}</div>
            <div className="text-sm font-mono text-gray-500 mt-2">TOTAL</div>
          </div>
          <div className="p-6 bg-black/50 rounded-xl border border-pink-500/30 text-center">
            <div className="text-5xl font-black text-rose-400">{data?.unique_prompts}</div>
            <div className="text-sm font-mono text-gray-500 mt-2">UNIQUE</div>
          </div>
        </div>
      )}
    </div>
  )
}
