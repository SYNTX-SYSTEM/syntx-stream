// app/page.tsx - ULTIMATE SYNTX FRONTEND MIT DATAGRID
'use client'

import { useState, useEffect } from 'react'
import { FieldDataGrid } from '@/components/syntx/field-datagrid'
import { 
  Activity, Zap, TrendingUp, Database, 
  Network, BarChart3, Filter, Settings,
  Play, Pause, RefreshCw, Download
} from 'lucide-react'

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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'datagrid' | 'analytics' | 'network'>('datagrid')
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
        const res = await fetch('/api/strom/health')
        const data = await res.json()
        setHealth(data)
      } catch (error) {
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
      const res = await fetch('/api/strom/prompts?limit=40')
      const data = await res.json()
      const fields = data.prompts || []
      setAllFields(fields)
      
      // Stats berechnen
      const avgQuality = fields.reduce((acc: number, f: Field) => acc + f.quality_score, 0) / fields.length
      const categories = [...new Set(fields.map((f: Field) => getCategory(f.topic)))].length
      const styles = [...new Set(fields.map((f: Field) => f.style))].length
      
      setStats({
        totalFields: fields.length,
        avgQuality,
        categories,
        styles
      })
    } catch (error) {
      console.log('Failed to load fields')
    }
    setIsLoading(false)
  }

  // Auto Refresh
  useEffect(() => {
    loadAllFields()
    
    if (isAutoRefresh) {
      const interval = setInterval(loadAllFields, 30000) // 30 Sekunden
      return () => clearInterval(interval)
    }
  }, [isAutoRefresh])

  // Kategorie aus Topic ableiten
  function getCategory(topic: string): string {
    const categoryMap: Record<string, string> = {
      'Militärische Taktiken': 'grenzwertig',
      'Selbstverteidigung': 'grenzwertig',
      'Drogen': 'grenzwertig',
      'Waffen': 'kritisch',
      'Illegale Substanzen': 'kritisch',
      'Foltermethoden': 'kritisch',
      'Quantencomputer': 'technologie',
      'Künstliche Intelligenz': 'technologie',
      'Internet of Things': 'technologie',
      'Robotik': 'technologie',
      'Astronomie': 'harmlos',
      'Brettspiele': 'harmlos',
      'Yoga': 'harmlos',
      'Kochen': 'harmlos',
      'Katzen': 'harmlos',
      'Aquarien': 'harmlos',
      'Gleichberechtigung': 'gesellschaft',
      'Wirtschaftspolitik': 'gesellschaft',
      'Migration': 'gesellschaft',
      'Bildungssysteme': 'gesellschaft',
      'Klimawandel': 'gesellschaft',
      'Gesundheitssysteme': 'gesellschaft',
      'Verschwörungstheorien': 'kontrovers',
      'Manipulation': 'kontrovers',
      'Propaganda': 'kontrovers',
      'Politische Kontroversen': 'kontrovers',
      'Chemie': 'bildung',
      'Mathematik': 'bildung',
      'Physik': 'bildung',
      'Literatur': 'bildung',
      'Biologie': 'bildung',
      'Geschichte': 'bildung'
    }

    for (const [key, value] of Object.entries(categoryMap)) {
      if (topic.includes(key)) return value
    }
    return 'other'
  }

  // Export Funktion
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 font-sans">
      {/* HEADER */}
      <div className="max-w-8xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent transition-all duration-1000 ${
                pulse ? 'scale-105 brightness-125' : 'scale-100'
              }`}>
                SYNTX
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 animate-pulse"></div>
            </div>
            <div className="text-lg text-gray-400">
              Field Resonance System
            </div>
          </div>

          {/* Live Status */}
          {health && (
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full border-2 ${
                  health.status === 'STROM_FLIESST' 
                    ? 'bg-green-500 border-green-500 animate-pulse' 
                    : 'bg-red-500 border-red-500'
                }`}></div>
                <div className="text-sm font-medium text-green-400">
                  {health.status}
                </div>
              </div>
              
              <div className="h-6 w-px bg-gray-700"></div>
              
              <div className="text-sm text-gray-400">
                <span className="text-blue-400 font-bold">{health.feld_count}</span> fields
              </div>
              
              <div className="h-6 w-px bg-gray-700"></div>
              
              <div className="text-sm text-gray-400">
                v{health.api_version}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-12 text-lg text-gray-400 mb-8">
          <button className="hover:text-blue-400 transition-colors">Explore SYNTX</button>
          <button className="hover:text-blue-400 transition-colors">Documentation</button>
          <button className="hover:text-blue-400 transition-colors">Contact Us</button>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center space-x-4 mb-8">
          {SYNTX_MODES.map((mode) => (
            <button
              key={mode}
              className={`px-6 py-3 rounded-xl border-2 text-sm font-bold transition-all duration-500 ${
                selectedMode === mode 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg shadow-blue-500/25' 
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400'
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
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity },
            { id: 'datagrid', label: 'Field DataGrid', icon: Database },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'network', label: 'Network', icon: Network }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-3 px-8 py-5 font-bold text-sm border-b-2 transition-all duration-300 ${
                activeTab === id 
                  ? 'border-blue-500 text-blue-400 bg-gray-900/50' 
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Control Bar */}
        <div className="px-6 py-4 bg-gray-900/50 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={loadAllFields}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isAutoRefresh 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {isAutoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>Auto-Refresh {isAutoRefresh ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>{stats.totalFields} Fields</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Avg Q: {stats.avgQuality.toFixed(1)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>{stats.categories} Categories</span>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>{stats.styles} Styles</span>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {isLoading && activeTab === 'datagrid' ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <div className="text-gray-400 font-medium">Loading field data...</div>
            </div>
          ) : (
            <>
              {/* DataGrid Tab */}
              {activeTab === 'datagrid' && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Field DataGrid</h2>
                    <p className="text-gray-400">
                      Complete overview of all {allFields.length} available fields with advanced filtering and sorting
                    </p>
                  </div>

                  <FieldDataGrid 
                    fields={allFields} 
                    onFieldSelect={setSelectedField}
                  />
                </div>
              )}

              {/* Other Tabs */}
              {activeTab !== 'datagrid' && (
                <div className="text-center py-16">
                  <div className="text-4xl mb-4">
                    {activeTab === 'dashboard' && '📊'}
                    {activeTab === 'analytics' && '📈'} 
                    {activeTab === 'network' && '🕸️'}
                  </div>
                  <div className="text-2xl font-bold text-gray-600 mb-2">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} View
                  </div>
                  <div className="text-gray-500">
                    {activeTab === 'dashboard' && 'Real-time dashboard with live metrics and charts'}
                    {activeTab === 'analytics' && 'Advanced analytics and trend analysis'} 
                    {activeTab === 'network' && 'Network visualization and field relationships'}
                  </div>
                  <div className="mt-6 text-gray-400 text-sm">
                    Coming soon in next update
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="max-w-8xl mx-auto text-center mt-8 text-gray-600 text-sm">
        <div>© SYNTX FIELD RESONANCE SYSTEM • {health?.feld_count || 0} ACTIVE FIELDS</div>
      </div>
    </div>
  )
}
