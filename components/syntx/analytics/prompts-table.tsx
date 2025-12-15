'use client'

import { useState, useEffect } from 'react'
import { Table } from 'lucide-react'

export function PromptsTableView() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [limit, setLimit] = useState(20)

  useEffect(() => {
    fetch(`https://dev.syntx-system.com/prompts/table-view?limit=${limit}`)
      .then(res => res.json())
      .then(json => setData(json.table || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [limit])

  const TOPIC_COLORS: Record<string, string> = {
    technologie: 'text-blue-400', harmlos: 'text-green-400', bildung: 'text-purple-400',
    gesellschaft: 'text-cyan-400', kontrovers: 'text-orange-400', grenzwertig: 'text-yellow-400', kritisch: 'text-red-400'
  }

  return (
    <div className="relative bg-black/80 rounded-2xl border border-blue-500/30 overflow-hidden p-6">
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500/50" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500/50" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500/50" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/50" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 rounded-xl">
            <Table className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">PROMPTS TABLE</h3>
            <p className="text-gray-600 text-xs font-mono">// RAW DATA VIEW</p>
          </div>
        </div>
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-gray-300">
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12"><Table className="w-8 h-8 text-blue-500 animate-pulse" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-800 text-xs font-mono text-gray-500">
              <th className="px-3 py-2 text-left">TOPIC</th>
              <th className="px-3 py-2 text-left">WRAPPER</th>
              <th className="px-3 py-2 text-left">SCORE</th>
              <th className="px-3 py-2 text-left">TIME</th>
            </tr></thead>
            <tbody>
              {data.map((row: any, i) => (
                <tr key={row.id || i} className={`border-b border-gray-800/50 ${i % 2 === 0 ? 'bg-black/20' : ''}`}>
                  <td className={`px-3 py-2 font-mono ${TOPIC_COLORS[row.topic] || 'text-gray-400'}`}>{row.topic}</td>
                  <td className="px-3 py-2 text-purple-400 font-mono">{row.wrapper}</td>
                  <td className={`px-3 py-2 font-mono font-bold ${row.score >= 80 ? 'text-green-400' : row.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{row.score}</td>
                  <td className="px-3 py-2 text-gray-500 font-mono">{(row.duration_ms / 1000).toFixed(1)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
