// app/page.tsx - SYNTX COMPLETE SYSTEM DASHBOARD
'use client'

import { useState, useEffect } from 'react'
import { FieldDataGrid } from '@/components/syntx/field-datagrid'
import { QueueDashboard } from '@/components/syntx/queue-dashboard'
import { 
  Activity, Zap, TrendingUp, Database, 
  Network, BarChart3, Filter, Settings,
  Play, Pause, RefreshCw, Download,
  Heart, Brain, Waves, GitBranch, Search, Server
} from 'lucide-react'
import { SYNTXVisuals } from '@/components/syntx/syntx-visuals'
import { SYNTXNetwork } from '@/components/syntx/syntx-network'
import { CyberLogo } from '@/components/syntx/cyber-logo'
import { AuthGate } from '@/components/syntx/syntx-auth-gate'
import { HealthHeartbeat, LiveQueueMonitor } from '@/components/syntx/pulse'
import { SyntxVsNormal } from '@/components/syntx/evolution'
import { ScorePredictor, MissingFieldsAnalysis, KeywordCombinations } from '@/components/syntx/intelligence'
import { QueueResonance, DriftMonitor, TopicDistribution } from '@/components/syntx/resonanz'
import { ScoreDistribution, TrendsChart, WrapperComparison, CostTracker, PerformanceMetrics, SuccessRate, CompleteDashboardView, TopicsDeepAnalytics, SuccessByWrapper, GenerationProgress, PromptsTableView, FeldPrompts } from '@/components/syntx/analytics'
import { QueueStatusCard } from '@/components/syntx/dashboard'
import { PromptExplorer } from '@/components/syntx/explorer'
import { MatrixRain, ParticleField, CursorTrail, GlitchText } from '@/components/syntx/effects'

const SYNTX_MODES = ['TRUE_RAW', 'CYBERDARK', 'SIGMA', 'FIELD_HYGIENE'] as const

interface Field {
  id: string
  topic: string
  content: string
  style: string
  quality_score: number
  timestamp: string
  cost_field: number
}

export default function SYNTXOS() {
  const [selectedMode, setSelectedMode] = useState<typeof SYNTX_MODES[number]>('CYBERDARK')
  const [activeTab, setActiveTab] = useState<string>('pulse')
  const [health, setHealth] = useState<any>(null)
  const [allFields, setAllFields] = useState<Field[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)
  const [pulse, setPulse] = useState(false)
  const [selectedField, setSelectedField] = useState<Field | null>(null)
  const [stats, setStats] = useState({
    totalFields: 0,
    avgQuality: 0,
    categories: 0,
    styles: 0
  })

  // Netz Puls
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 400)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Health Check
  useEffect(() => {
    const loadHealth = async () => {
      try {
        const res = await fetch('https://dev.syntx-system.com/strom/health')
        const data = await res.json()
        setHealth(data)
      } catch (error) {
        console.error('Health check failed:', error)
        setHealth({status: 'NETZ_BLOCKIERT', feld_count: 0})
      }
    }
    loadHealth()
    const interval = setInterval(loadHealth, 10000)
    return () => clearInterval(interval)
  }, [])

  // Load ALL Fields
  const loadAllFields = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('https://dev.syntx-system.com/feld/prompts?limit=40')
      const data = await res.json()
      const fields = data.prompts || []
      setAllFields(fields)
      
      const avgQuality = fields.length > 0 
        ? fields.reduce((acc: number, f: Field) => acc + f.quality_score, 0) / fields.length 
        : 0
      const categories = [...new Set(fields.map((f: Field) => getCategory(f.topic)))].length
      const styles = [...new Set(fields.map((f: Field) => f.style))].length
      
      setStats({ totalFields: fields.length, avgQuality, categories, styles })
    } catch (error) {
      console.error('Failed to load fields:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadAllFields()
    if (isAutoRefresh) {
      const interval = setInterval(loadAllFields, 30000)
      return () => clearInterval(interval)
    }
  }, [isAutoRefresh])

  function getCategory(topic: string): string {
    const categoryMap: Record<string, string> = {
      'Militärische Taktiken': 'grenzwertig', 'Selbstverteidigung': 'grenzwertig', 'Drogen': 'grenzwertig',
      'Waffen': 'kritisch', 'Illegale Substanzen': 'kritisch', 'Foltermethoden': 'kritisch',
      'Quantencomputer': 'technologie', 'Künstliche Intelligenz': 'technologie', 'Internet of Things': 'technologie', 'Robotik': 'technologie',
      'Astronomie': 'harmlos', 'Brettspiele': 'harmlos', 'Yoga': 'harmlos', 'Kochen': 'harmlos', 'Katzen': 'harmlos', 'Aquarien': 'harmlos',
      'Gleichberechtigung': 'gesellschaft', 'Wirtschaftspolitik': 'gesellschaft', 'Migration': 'gesellschaft',
      'Bildungssysteme': 'gesellschaft', 'Klimawandel': 'gesellschaft', 'Gesundheitssysteme': 'gesellschaft',
      'Verschwörungstheorien': 'kontrovers', 'Manipulation': 'kontrovers', 'Propaganda': 'kontrovers', 'Politische Kontroversen': 'kontrovers',
      'Chemie': 'bildung', 'Mathematik': 'bildung', 'Physik': 'bildung', 'Literatur': 'bildung', 'Biologie': 'bildung', 'Geschichte': 'bildung'
    }
    for (const [key, value] of Object.entries(categoryMap)) {
      if (topic.includes(key)) return value
    }
    return 'other'
  }

  const exportData = () => {
    const dataStr = JSON.stringify(allFields, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `syntx-fields-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // TAB DEFINITIONS - ERWEITERT
  const TABS = [
    { id: 'pulse', label: 'Pulse', icon: Heart, color: 'red' },
    { id: 'dashboard', label: 'Dashboard', icon: Activity, color: 'blue' },
    { id: 'datagrid', label: 'DataGrid', icon: Database, color: 'cyan' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'purple' },
    { id: 'evolution', label: 'Evolution', icon: GitBranch, color: 'green' },
    { id: 'intelligence', label: 'Intelligence', icon: Brain, color: 'orange' },
    { id: 'resonanz', label: 'Resonanz', icon: Waves, color: 'pink' },
    { id: 'network', label: 'Network', icon: Network, color: 'indigo' },
    { id: 'explorer', label: 'Explorer', icon: Search, color: 'cyan' },
    { id: 'system', label: 'System', icon: Server, color: 'emerald' }
  ]

  return (
    <AuthGate>
    {/* CYBER EFFECTS LAYER */}
    <MatrixRain />
    <ParticleField />
    <CursorTrail />
    <div className="scan-lines" />
    
    <div className="min-h-screen gradient-flow text-white p-4 font-sans">
      {/* HEADER */}
      <div className="max-w-8xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent transition-all duration-1000 neon-pulse ${pulse ? 'scale-105 brightness-125' : 'scale-100'}`}>
                <CyberLogo />
                <GlitchText text="SYNTX" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 animate-pulse"></div>
            </div>
            <div className="text-lg text-gray-400">Field Resonance System</div>
          </div>

          {health && (
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full border-2 ${health.status === 'STROM_ONLINE' || health.status === 'STROM_FLIESST' ? 'bg-green-500 border-green-500 animate-pulse' : 'bg-red-500 border-red-500'}`}></div>
                <div className="text-sm font-medium text-green-400">{health.status}</div>
              </div>
              <div className="h-6 w-px bg-gray-700"></div>
              <div className="text-sm text-gray-400"><span className="text-blue-400 font-bold">{health.feld_count || stats.totalFields}</span> fields</div>
            </div>
          )}
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center space-x-3 mb-6">
          {SYNTX_MODES.map((mode) => (
            <button
              key={mode}
              className={`px-5 py-2 rounded-lg border text-xs font-bold transition-all duration-300 ${
                selectedMode === mode 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg shadow-blue-500/25' 
                  : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400'
              }`}
              onClick={() => setSelectedMode(mode)}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN INTERFACE */}
      <div className="max-w-8xl mx-auto bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
        {/* Tab Navigation - ERWEITERT */}
        <div className="flex border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-6 py-4 font-bold text-sm border-b-2 transition-all duration-300 whitespace-nowrap ${
                activeTab === id 
                  ? `border-${color}-500 text-${color}-400 bg-gray-900/50` 
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${activeTab === id ? `text-${color}-400` : ''}`} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Control Bar */}
        <div className="px-6 py-3 bg-gray-900/50 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={loadAllFields} disabled={isLoading} className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg text-white text-sm transition-colors">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button onClick={() => setIsAutoRefresh(!isAutoRefresh)} className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${isAutoRefresh ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
              {isAutoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isAutoRefresh ? 'Auto ON' : 'Auto OFF'}</span>
            </button>
            <button onClick={exportData} className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 text-sm transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span><Database className="w-3 h-3 inline mr-1" />{stats.totalFields}</span>
            <span><TrendingUp className="w-3 h-3 inline mr-1" />Q: {stats.avgQuality.toFixed(1)}</span>
            <span><Filter className="w-3 h-3 inline mr-1" />{stats.categories} Cat</span>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* PULSE TAB - NEU */}
          {activeTab === 'pulse' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-2">SYNTX PULSE</h2>
                <p className="text-gray-400">System Heartbeat & Live Queue Monitor</p>
              </div>
              <HealthHeartbeat />
              <LiveQueueMonitor />
            </div>
          )}

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">SYNTX Live Dashboard</h2>
                <p className="text-gray-400">Real-time queue monitoring and system health</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <QueueStatusCard />
              </div>
              <QueueDashboard />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                  <div className="text-cyan-400 text-sm font-medium mb-2">Total Fields</div>
                  <div className="text-3xl font-bold text-white">{stats.totalFields}</div>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                  <div className="text-green-400 text-sm font-medium mb-2">Avg Quality</div>
                  <div className="text-3xl font-bold text-white">{stats.avgQuality.toFixed(1)}</div>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                  <div className="text-purple-400 text-sm font-medium mb-2">System Health</div>
                  <div className={`text-3xl font-bold ${health?.status?.includes('ONLINE') || health?.status?.includes('FLIESST') ? 'text-green-400' : 'text-red-400'}`}>
                    {health?.status || 'CHECKING'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DATAGRID Tab */}
          {activeTab === 'datagrid' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Field DataGrid</h2>
                <p className="text-gray-400">Complete overview of all {allFields.length} fields</p>
              </div>
              {isLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <div className="text-gray-400">Loading...</div>
                </div>
              ) : (
                <FieldDataGrid fields={allFields} onFieldSelect={setSelectedField} />
              )}
            </div>
          )}

          {/* ANALYTICS Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">SYNTX Analytics</h2>
                <p className="text-gray-400">Real-time field resonance visualization</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ScoreDistribution />
                <TrendsChart />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <WrapperComparison />
                <CostTracker />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <PerformanceMetrics />
                <SuccessRate />
              </div>
              <SYNTXVisuals />
            </div>
          )}

          {/* EVOLUTION Tab - PLACEHOLDER */}
          {activeTab === 'evolution' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">SYNTX EVOLUTION</h2>
                <p className="text-gray-400">SYNTX vs Normal - The Proof</p>
              </div>
              <SyntxVsNormal />
            </div>
          )}

          {/* INTELLIGENCE Tab - PLACEHOLDER */}
          {activeTab === 'intelligence' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-2">SYNTX INTELLIGENCE</h2>
                <p className="text-gray-400">Advanced Analytics & Predictions</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScorePredictor />
                <KeywordCombinations />
              </div>
              <MissingFieldsAnalysis />
            </div>
          )}

          {/* RESONANZ Tab - PLACEHOLDER */}
          {activeTab === 'resonanz' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">SYNTX RESONANZ</h2>
                <p className="text-gray-400">Field Analysis & Drift Monitor</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <QueueResonance />
                <TopicDistribution />
              </div>
              <DriftMonitor />
            </div>
          )}

          {/* NETWORK Tab */}
          {activeTab === 'network' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">SYNTX Network Matrix</h2>
                <p className="text-gray-400">Interactive field resonance visualization</p>
              </div>
              <SYNTXNetwork />
            </div>
          )}

          {/* EXPLORER Tab - THE ULTIMATE PROMPT BROWSER */}
          {activeTab === 'explorer' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">SYNTX EXPLORER</h2>
                <p className="text-gray-400">Complete Prompt & Response Database • 686 Entries</p>
              </div>
              <PromptExplorer />
            </div>
          )}

          {/* SYSTEM Tab - ALL REMAINING ENDPOINTS */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">SYNTX SYSTEM</h2>
                <p className="text-gray-400">Complete API Coverage • All Endpoints</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CompleteDashboardView />
                <SuccessByWrapper />
              </div>
              <TopicsDeepAnalytics />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GenerationProgress />
                <FeldPrompts />
              </div>
              <PromptsTableView />
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="max-w-8xl mx-auto text-center mt-6 text-gray-600 text-sm">
        <div>© SYNTX FIELD RESONANCE SYSTEM • {health?.feld_count || stats.totalFields} ACTIVE FIELDS</div>
      </div>
    </div>
    </AuthGate>
  )
}
