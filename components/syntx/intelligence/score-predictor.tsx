'use client'

import { useState } from 'react'
import { Brain, Send, Loader2 } from 'lucide-react'

export function ScorePredictor() {
  const [prompt, setPrompt] = useState('')
  const [topic, setTopic] = useState('technologie')
  const [style, setStyle] = useState('akademisch')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [pulse, setPulse] = useState(false)

  const topics = ['technologie', 'gesellschaft', 'harmlos', 'grenzwertig', 'kritisch', 'kontrovers', 'bildung']
  const styles = ['akademisch', 'casual', 'technisch', 'kreativ']

  const predict = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const res = await fetch('https://dev.syntx-system.com/prompts/advanced/predict-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_text: prompt, topic, style })
      })
      const data = await res.json()
      setResult(data)
      setPulse(true)
      setTimeout(() => setPulse(false), 1000)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="relative bg-black/80 rounded-2xl border border-orange-500/30 overflow-hidden">
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-orange-500/50" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-orange-500/50" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-orange-500/50" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-orange-500/50" />

      <div className="relative p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Brain className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-orange-400">SCORE PREDICTOR</h3>
            <p className="text-gray-600 text-xs font-mono">// AI-POWERED PREDICTION</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-gray-500 text-xs font-mono mb-1 block">TOPIC</label>
            <select value={topic} onChange={e => setTopic(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-cyan-400 font-mono text-sm focus:border-orange-500/50 focus:outline-none">
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-gray-500 text-xs font-mono mb-1 block">STYLE</label>
            <select value={style} onChange={e => setStyle(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-cyan-400 font-mono text-sm focus:border-orange-500/50 focus:outline-none">
              {styles.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt text..."
          className="w-full h-24 bg-black/50 border border-gray-700 rounded-xl p-4 text-gray-300 font-mono text-sm resize-none focus:border-orange-500/50 focus:outline-none mb-4"
        />
        
        <button onClick={predict} disabled={loading || !prompt.trim()} className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 disabled:from-gray-600 disabled:to-gray-600 rounded-xl text-white font-bold transition-all">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          <span>{loading ? 'PREDICTING...' : 'PREDICT'}</span>
        </button>

        {result && !result.detail && (
          <div className={`mt-6 bg-black/50 border border-orange-500/30 rounded-xl p-6 text-center ${pulse ? 'shadow-xl shadow-orange-500/20' : ''}`}>
            <div className="text-gray-500 text-xs font-mono mb-2">PREDICTED SCORE</div>
            <div className={`text-6xl font-black font-mono ${getScoreColor(result.predicted_score || 0)}`}>
              {result.predicted_score || '?'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
