'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ChevronDown, ChevronUp, Clock, DollarSign, Zap, X,
  CheckCircle, XCircle, FileText, MessageSquare, Sparkles, Copy, Check
} from 'lucide-react'

interface PromptExport {
  id: string
  timestamp: string
  prompt: { text: string; topic: string; style: string; category: string; language: string }
  response: { text: string; wrapper: string; duration_ms: number }
  quality: { 
    total_score: number
    fields_fulfilled: string[]
    fields_missing: string[]
    field_breakdown: Record<string, boolean>
    completion_rate: string
  }
  gpt_metadata: {
    quality_assessment: { total_score: number; quality_rating: string; stats: { length: number; words: number } }
    cost: { total_cost: number; input_tokens: number; output_tokens: number }
  }
}

interface Pagination {
  page: number
  page_size: number
  total_items: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

const FIELD_LABELS: Record<string, string> = {
  drift: 'DRIFT', hintergrund_muster: 'HINTERGRUND', druckfaktoren: 'DRUCK',
  tiefe: 'TIEFE', wirkung: 'WIRKUNG', klartext: 'KLARTEXT'
}

const TOPIC_COLORS: Record<string, string> = {
  technologie: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  harmlos: 'bg-green-500/20 text-green-400 border-green-500/50',
  bildung: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  gesellschaft: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
  kontrovers: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  grenzwertig: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  kritisch: 'bg-red-500/20 text-red-400 border-red-500/50'
}

const WRAPPER_COLORS: Record<string, string> = {
  sigma: 'text-purple-400', human: 'text-yellow-400', 
  deepsweep: 'text-cyan-400', syntex_system: 'text-blue-400'
}

export function PromptExplorer() {
  const [data, setData] = useState<PromptExport[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [fullscreenPrompt, setFullscreenPrompt] = useState<PromptExport | null>(null)
  
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [topicFilter, setTopicFilter] = useState<string>('')
  const [wrapperFilter, setWrapperFilter] = useState<string>('')
  const [minScore, setMinScore] = useState(0)
  const [sortField, setSortField] = useState<string>('timestamp')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      let url = `https://dev.syntx-system.com/prompts/complete-export?page=${page}&page_size=${pageSize}&min_score=${minScore}`
      if (topicFilter) url += `&topic=${topicFilter}`
      if (wrapperFilter) url += `&wrapper=${wrapperFilter}`
      
      const res = await fetch(url)
      const json = await res.json()
      
      let exports = json.exports || []
      exports.sort((a: PromptExport, b: PromptExport) => {
        let valA, valB
        switch (sortField) {
          case 'score': valA = a.quality.total_score; valB = b.quality.total_score; break
          case 'duration': valA = a.response.duration_ms; valB = b.response.duration_ms; break
          case 'cost': valA = a.gpt_metadata?.cost?.total_cost || 0; valB = b.gpt_metadata?.cost?.total_cost || 0; break
          default: valA = new Date(a.timestamp).getTime(); valB = new Date(b.timestamp).getTime()
        }
        return sortDir === 'asc' ? valA - valB : valB - valA
      })
      
      setData(exports)
      setPagination(json.pagination)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [page, pageSize, topicFilter, wrapperFilter, minScore, sortField, sortDir])

  useEffect(() => { fetchData() }, [fetchData])

  const goToPage = (p: number) => {
    if (p >= 1 && p <= (pagination?.total_pages || 1)) setPage(p)
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl animate-pulse">
            <Sparkles className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              PROMPT EXPLORER
            </h2>
            <p className="text-gray-500 text-sm font-mono">
              {pagination?.total_items || 0} PROMPTS • PAGE {page}/{pagination?.total_pages || 1}
            </p>
          </div>
        </div>
        <div className="text-xs font-mono text-gray-600">
          💡 Click row to expand • Click again for fullscreen
        </div>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <select value={topicFilter} onChange={(e) => { setTopicFilter(e.target.value); setPage(1) }}
          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-gray-300 focus:border-cyan-500 focus:outline-none">
          <option value="">ALL TOPICS</option>
          {['technologie', 'harmlos', 'bildung', 'gesellschaft', 'kontrovers', 'grenzwertig', 'kritisch'].map(t => (
            <option key={t} value={t}>{t.toUpperCase()}</option>
          ))}
        </select>

        <select value={wrapperFilter} onChange={(e) => { setWrapperFilter(e.target.value); setPage(1) }}
          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-gray-300 focus:border-cyan-500 focus:outline-none">
          <option value="">ALL WRAPPERS</option>
          {['sigma', 'human', 'deepsweep', 'syntex_system'].map(w => (
            <option key={w} value={w}>{w.toUpperCase()}</option>
          ))}
        </select>

        <select value={minScore} onChange={(e) => { setMinScore(Number(e.target.value)); setPage(1) }}
          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-gray-300 focus:border-cyan-500 focus:outline-none">
          <option value={0}>MIN SCORE: 0</option>
          <option value={50}>MIN SCORE: 50</option>
          <option value={70}>MIN SCORE: 70</option>
          <option value={80}>MIN SCORE: 80</option>
          <option value={90}>MIN SCORE: 90</option>
        </select>

        <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-gray-300 focus:border-cyan-500 focus:outline-none">
          <option value={5}>5 / PAGE</option>
          <option value={10}>10 / PAGE</option>
          <option value={20}>20 / PAGE</option>
        </select>

        <button onClick={fetchData}
          className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg px-4 py-2 text-sm font-bold text-white transition-all flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/25">
          <Search className="w-4 h-4" />
          <span>SEARCH</span>
        </button>
      </div>

      {/* TABLE */}
      <div className="relative bg-black/80 rounded-2xl border border-cyan-500/30 overflow-hidden">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50" />

        {loading ? (
          <div className="flex items-center justify-center p-16">
            <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="divide-y divide-gray-800/50">
            {/* HEADER */}
            <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-900/50 text-xs font-mono text-gray-500">
              <div className="col-span-1"></div>
              <div className="col-span-2">TOPIC / STYLE</div>
              <div className="col-span-2">WRAPPER</div>
              <div className="col-span-1 cursor-pointer hover:text-cyan-400" onClick={() => { setSortField('score'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc') }}>SCORE ↕</div>
              <div className="col-span-2">FIELDS</div>
              <div className="col-span-1">TIME</div>
              <div className="col-span-1">COST</div>
              <div className="col-span-2">DATE</div>
            </div>

            {/* ROWS */}
            {data.map((item, i) => (
              <PromptRow 
                key={item.id} 
                item={item} 
                isExpanded={expandedId === item.id}
                onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                onFullscreen={() => setFullscreenPrompt(item)}
                isEven={i % 2 === 0}
              />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 bg-gray-900/30">
          <div className="text-sm font-mono text-gray-500">
            Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, pagination?.total_items || 0)} of {pagination?.total_items || 0}
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => goToPage(1)} disabled={!pagination?.has_prev} className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 rounded-lg"><ChevronsLeft className="w-4 h-4 text-gray-400" /></button>
            <button onClick={() => goToPage(page - 1)} disabled={!pagination?.has_prev} className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 rounded-lg"><ChevronLeft className="w-4 h-4 text-gray-400" /></button>
            
            {Array.from({ length: Math.min(5, pagination?.total_pages || 1) }, (_, i) => {
              const startPage = Math.max(1, Math.min(page - 2, (pagination?.total_pages || 1) - 4))
              const p = startPage + i
              if (p > (pagination?.total_pages || 1)) return null
              return (
                <button key={p} onClick={() => goToPage(p)}
                  className={`w-10 h-10 rounded-lg font-mono font-bold transition-colors ${p === page ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {p}
                </button>
              )
            })}

            <button onClick={() => goToPage(page + 1)} disabled={!pagination?.has_next} className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 rounded-lg"><ChevronRight className="w-4 h-4 text-gray-400" /></button>
            <button onClick={() => goToPage(pagination?.total_pages || 1)} disabled={!pagination?.has_next} className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 rounded-lg"><ChevronsRight className="w-4 h-4 text-gray-400" /></button>
          </div>
        </div>
      </div>

      {/* FULLSCREEN MODAL */}
      {fullscreenPrompt && (
        <FullscreenPromptView prompt={fullscreenPrompt} onClose={() => setFullscreenPrompt(null)} />
      )}
    </div>
  )
}

function PromptRow({ item, isExpanded, onToggle, onFullscreen, isEven }: { 
  item: PromptExport; isExpanded: boolean; onToggle: () => void; onFullscreen: () => void; isEven: boolean 
}) {
  return (
    <div className={`${isEven ? 'bg-black/20' : ''} ${isExpanded ? 'bg-cyan-500/5' : ''}`}>
      {/* Main Row */}
      <div 
        className="grid grid-cols-12 gap-2 px-4 py-3 items-center cursor-pointer hover:bg-cyan-500/10 transition-colors"
        onClick={onToggle}
      >
        <div className="col-span-1">
          {isExpanded ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
        </div>
        <div className="col-span-2">
          <span className={`px-2 py-1 rounded text-xs font-mono border ${TOPIC_COLORS[item.prompt.topic] || 'bg-gray-500/20 text-gray-400 border-gray-500/50'}`}>
            {item.prompt.topic}
          </span>
          <div className="text-gray-600 text-xs mt-1">{item.prompt.style}</div>
        </div>
        <div className="col-span-2">
          <span className={`font-mono text-sm font-bold ${WRAPPER_COLORS[item.response.wrapper] || 'text-gray-400'}`}>
            {item.response.wrapper}
          </span>
        </div>
        <div className="col-span-1">
          <span className={`font-mono text-xl font-black ${item.quality.total_score >= 80 ? 'text-green-400' : item.quality.total_score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
            {item.quality.total_score}
          </span>
        </div>
        <div className="col-span-2 flex space-x-1">
          {Object.entries(item.quality.field_breakdown).map(([field, fulfilled]) => (
            <div key={field} className={`w-3 h-6 rounded ${fulfilled ? 'bg-green-500' : 'bg-red-500/30'}`} title={FIELD_LABELS[field]} />
          ))}
        </div>
        <div className="col-span-1 font-mono text-sm text-gray-400">
          {(item.response.duration_ms / 1000).toFixed(1)}s
        </div>
        <div className="col-span-1 font-mono text-sm text-green-400">
          ${item.gpt_metadata?.cost?.total_cost?.toFixed(4) || '0.00'}
        </div>
        <div className="col-span-2 font-mono text-xs text-gray-500">
          {new Date(item.timestamp).toLocaleDateString('de-DE')}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Field Breakdown Bar */}
          <div className="flex items-center space-x-2 p-3 bg-black/50 rounded-xl border border-gray-800">
            <span className="text-xs font-mono text-gray-500">FIELDS:</span>
            {Object.entries(item.quality.field_breakdown).map(([field, fulfilled]) => (
              <div key={field} className={`flex items-center space-x-1 px-2 py-1 rounded ${fulfilled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/10 text-red-400/50'}`}>
                {fulfilled ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                <span className="text-xs font-mono">{FIELD_LABELS[field]}</span>
              </div>
            ))}
            <span className="text-xs font-mono text-cyan-400 ml-auto">{item.quality.completion_rate}</span>
          </div>

          {/* Prompt & Response Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* PROMPT */}
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/30 overflow-hidden">
              <div className="px-4 py-2 bg-blue-500/20 border-b border-blue-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 font-mono font-bold text-sm">PROMPT</span>
                </div>
                <CopyButton text={item.prompt.text} />
              </div>
              <div className="p-4 max-h-64 overflow-y-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {item.prompt.text || '(empty)'}
                </pre>
              </div>
            </div>

            {/* RESPONSE */}
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl border border-purple-500/30 overflow-hidden">
              <div className="px-4 py-2 bg-purple-500/20 border-b border-purple-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 font-mono font-bold text-sm">RESPONSE</span>
                </div>
                <CopyButton text={item.response.text} />
              </div>
              <div className="p-4 max-h-64 overflow-y-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {item.response.text || '(empty)'}
                </pre>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex justify-end">
            <button 
              onClick={(e) => { e.stopPropagation(); onFullscreen() }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg text-white font-bold text-sm flex items-center space-x-2 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>FULLSCREEN VIEW</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  
  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button onClick={copy} className="p-1.5 bg-black/30 hover:bg-black/50 rounded transition-colors">
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
    </button>
  )
}

function FullscreenPromptView({ prompt, onClose }: { prompt: PromptExport; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen p-4 md:p-8" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 mb-6 bg-gray-900/90 backdrop-blur rounded-2xl border border-cyan-500/30">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl">
              <FileText className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">FULLSCREEN PROMPT VIEW</h2>
              <div className="flex items-center space-x-3 text-sm">
                <span className={`px-2 py-0.5 rounded ${TOPIC_COLORS[prompt.prompt.topic]}`}>{prompt.prompt.topic}</span>
                <span className={`font-mono font-bold ${WRAPPER_COLORS[prompt.response.wrapper]}`}>{prompt.response.wrapper}</span>
                <span className={`font-mono font-bold ${prompt.quality.total_score >= 80 ? 'text-green-400' : prompt.quality.total_score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  Score: {prompt.quality.total_score}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-xl transition-colors">
            <X className="w-6 h-6 text-red-400" />
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          {[
            { label: 'TOPIC', value: prompt.prompt.topic, color: 'text-blue-400' },
            { label: 'STYLE', value: prompt.prompt.style, color: 'text-purple-400' },
            { label: 'WRAPPER', value: prompt.response.wrapper, color: 'text-cyan-400' },
            { label: 'SCORE', value: prompt.quality.total_score, color: prompt.quality.total_score >= 80 ? 'text-green-400' : 'text-yellow-400' },
            { label: 'DURATION', value: `${(prompt.response.duration_ms / 1000).toFixed(1)}s`, color: 'text-orange-400' },
            { label: 'COST', value: `$${prompt.gpt_metadata?.cost?.total_cost?.toFixed(4)}`, color: 'text-green-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <div className="text-xs font-mono text-gray-500 mb-1">{label}</div>
              <div className={`font-bold text-lg ${color}`}>{value}</div>
            </div>
          ))}
        </div>

        {/* Field Breakdown */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
          <h3 className="text-sm font-mono text-gray-500 mb-3">SYNTX FIELD BREAKDOWN • {prompt.quality.completion_rate}</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {Object.entries(prompt.quality.field_breakdown).map(([field, fulfilled]) => (
              <div key={field} className={`p-4 rounded-xl border text-center ${fulfilled ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/5 border-red-500/30'}`}>
                {fulfilled ? <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" /> : <XCircle className="w-8 h-8 text-red-400/50 mx-auto mb-2" />}
                <div className={`text-sm font-mono font-bold ${fulfilled ? 'text-green-400' : 'text-red-400/50'}`}>{FIELD_LABELS[field]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Prompt */}
        <div className="mb-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl border border-blue-500/30 overflow-hidden">
          <div className="px-6 py-4 bg-blue-500/20 border-b border-blue-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6 text-blue-400" />
              <span className="text-blue-400 font-mono font-bold text-lg">COMPLETE PROMPT</span>
              <span className="text-gray-500 text-sm font-mono">{prompt.gpt_metadata?.quality_assessment?.stats?.words || 0} words</span>
            </div>
            <CopyButton text={prompt.prompt.text} />
          </div>
          <div className="p-6">
            <pre className="text-base text-gray-200 whitespace-pre-wrap font-mono leading-relaxed">
              {prompt.prompt.text || '(empty prompt)'}
            </pre>
          </div>
        </div>

        {/* Full Response */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl border border-purple-500/30 overflow-hidden">
          <div className="px-6 py-4 bg-purple-500/20 border-b border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-purple-400" />
              <span className="text-purple-400 font-mono font-bold text-lg">COMPLETE RESPONSE</span>
              <span className="text-gray-500 text-sm font-mono">{prompt.gpt_metadata?.quality_assessment?.stats?.length || 0} chars</span>
            </div>
            <CopyButton text={prompt.response.text} />
          </div>
          <div className="p-6">
            <pre className="text-base text-gray-200 whitespace-pre-wrap font-mono leading-relaxed">
              {prompt.response.text || '(empty response)'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
