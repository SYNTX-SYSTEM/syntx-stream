// app/page.tsx - MIT PROXY FIX
'use client'

import { useState, useEffect } from 'react'

const SYNTX_MODES = ['TRUE_RAW', 'CYBERDARK', 'SIGMA', 'FIELD_HYGIENE'] as const

export default function SYNTXOS() {
  const [selectedMode, setSelectedMode] = useState<typeof SYNTX_MODES[number]>('TRUE_RAW')
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [health, setHealth] = useState<any>(null)

  // Health Check über Proxy
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/strom/health')
        const data = await res.json()
        setHealth(data)
      } catch (error) {
        setHealth({status: 'ERROR', feld_count: 0})
      }
    }
    checkHealth()
  }, [])

  const handleSend = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/strom/prompts?limit=1')
      const data = await res.json()
      
      if (data.prompts && data.prompts.length > 0) {
        const field = data.prompts[0]
        setResponse(`SYNTX ${selectedMode}: ${field.content.substring(0, 100)}...`)
      } else {
        setResponse(`SYNTX ${selectedMode}: No fields available`)
      }
    } catch (error) {
      setResponse(`SYNTX ${selectedMode}: API Error - check console`)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans">
      <div className="text-center mb-12">
        <div className="text-6xl font-light mb-4">SYNTX</div>
        <div className="text-2xl font-light mb-8">SYNTX isn't AI.<br/>It's the resonance that governs it</div>
        
        {health && (
          <div className="mb-6">
            <span className={`px-3 py-1 rounded-full text-white ${
              health.status === 'STROM_FLIESST' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {health.status || 'LOADING...'}
            </span>
            <span className="ml-4 text-gray-600">{health.feld_count || 0} Felder</span>
          </div>
        )}

        <div className="flex justify-center space-x-8 text-lg">
          <button className="hover:underline">Explore SYNTX</button>
          <button className="hover:underline">Contact Us</button>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        {SYNTX_MODES.map((mode) => (
          <button
            key={mode}
            className={`px-6 py-2 rounded-full border ${
              selectedMode === mode 
                ? 'bg-black text-white border-black' 
                : 'border-black text-black'
            }`}
            onClick={() => setSelectedMode(mode)}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto mb-6">
        <textarea
          placeholder="Enter resonance pattern..."
          className="w-full min-h-[120px] p-4 border-2 border-gray-300 rounded-lg focus:border-black resize-none"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="text-center mb-8">
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 disabled:bg-gray-400"
        >
          {isLoading ? 'Calibrating...' : 'Calibrate Resonance'}
        </button>
      </div>

      {response && (
        <div className="max-w-2xl mx-auto p-6 border-2 border-blue-300 rounded-lg bg-blue-50">
          <h3 className="text-blue-600 font-bold mb-2">Resonance Output</h3>
          <p className="text-gray-700">{response}</p>
        </div>
      )}

      <div className="text-center mt-12 text-gray-500">
        <div>© SYNTX</div>
      </div>
    </div>
  )
}
