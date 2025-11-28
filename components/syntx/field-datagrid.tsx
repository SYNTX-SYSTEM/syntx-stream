// components/syntx/field-datagrid.tsx - ULTIMATE DATAGRID
'use client'

import { useState, useMemo } from 'react'
import { 
  ArrowUpDown, Filter, Search, Download, 
  BarChart3, LineChart, PieChart, Calendar,
  Zap, Star, Clock, Tag
} from 'lucide-react'

interface Field {
  id: string
  topic: string
  content: string
  style: string
  quality_score: number
  timestamp: string
  cost_field: number
  category?: string
}

interface FieldDataGridProps {
  fields: Field[]
  onFieldSelect?: (field: Field) => void
}

export function FieldDataGrid({ fields, onFieldSelect }: FieldDataGridProps) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Field; direction: 'asc' | 'desc' }>({ 
    key: 'timestamp', 
    direction: 'desc' 
  })
  const [filter, setFilter] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStyle, setSelectedStyle] = useState('all')
  const [qualityRange, setQualityRange] = useState<[number, number]>([0, 10])
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'chart'>('table')
  const [selectedField, setSelectedField] = useState<Field | null>(null)

  // Verfügbare Kategorien und Styles
  const categories = useMemo(() => 
    [...new Set(fields.map(f => getCategory(f.topic)))].filter(Boolean),
    [fields]
  )

  const styles = useMemo(() => 
    [...new Set(fields.map(f => f.style))],
    [fields]
  )

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
      'Aquarien': 'harmlos'
    }

    for (const [key, value] of Object.entries(categoryMap)) {
      if (topic.includes(key)) return value
    }
    return 'other'
  }

  // Gefilterte und sortierte Daten
  const processedFields = useMemo(() => {
    let filtered = fields.filter(field => {
      const matchesSearch = field.topic.toLowerCase().includes(filter.toLowerCase()) ||
                           field.content.toLowerCase().includes(filter.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || getCategory(field.topic) === selectedCategory
      const matchesStyle = selectedStyle === 'all' || field.style === selectedStyle
      const matchesQuality = field.quality_score >= qualityRange[0] && field.quality_score <= qualityRange[1]
      
      return matchesSearch && matchesCategory && matchesStyle && matchesQuality
    })

    // Sortierung
    filtered.sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [fields, filter, selectedCategory, selectedStyle, qualityRange, sortConfig])

  // Sort-Funktion
  const handleSort = (key: keyof Field) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // Quality Color
  const getQualityColor = (score: number) => {
    if (score >= 8) return 'text-green-400 bg-green-400/20 border-green-400/30'
    if (score >= 6) return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30'
    return 'text-red-400 bg-red-400/20 border-red-400/30'
  }

  // Style Color
  const getStyleColor = (style: string) => {
    const colors = {
      akademisch: 'text-blue-400 bg-blue-400/20 border-blue-400/30',
      kreativ: 'text-purple-400 bg-purple-400/20 border-purple-400/30',
      technisch: 'text-cyan-400 bg-cyan-400/20 border-cyan-400/30',
      casual: 'text-orange-400 bg-orange-400/20 border-orange-400/30'
    }
    return colors[style as keyof typeof colors] || 'text-gray-400 bg-gray-400/20 border-gray-400/30'
  }

  // Chart Data für Mini-Charts
  const qualityDistribution = useMemo(() => {
    const distribution = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // 1-10
    processedFields.forEach(field => {
      if (field.quality_score >= 1 && field.quality_score <= 10) {
        distribution[field.quality_score - 1]++
      }
    })
    return distribution
  }, [processedFields])

  if (viewMode === 'chart') {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Quality Distribution Chart */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              Quality Distribution
            </h3>
            <div className="flex items-end justify-between h-32">
              {qualityDistribution.map((count, index) => (
                <div key={index} className="flex flex-col items-center flex-1 mx-1">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t transition-all duration-500 hover:from-blue-400 hover:to-blue-500"
                    style={{ height: `${(count / Math.max(...qualityDistribution)) * 80}%` }}
                  ></div>
                  <div className="text-xs text-gray-400 mt-1">{index + 1}</div>
                  <div className="text-xs text-blue-400 font-bold">{count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Style Distribution */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2 text-purple-400" />
              Style Distribution
            </h3>
            <div className="space-y-2">
              {styles.map(style => {
                const count = processedFields.filter(f => f.style === style).length
                const percentage = (count / processedFields.length) * 100
                return (
                  <div key={style} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300 capitalize">{style}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getStyleColor(style).split(' ')[0]}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400 w-8">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={() => setViewMode('table')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
          >
            Back to Table View
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 bg-gray-900 border-b border-gray-700 space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search fields..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Style Filter */}
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Styles</option>
            {styles.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        {/* Quality Range and View Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Quality Range */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Quality: {qualityRange[0]} - {qualityRange[1]}</span>
            <input
              type="range"
              min="0"
              max="10"
              value={qualityRange[0]}
              onChange={(e) => setQualityRange([parseInt(e.target.value), qualityRange[1]])}
              className="w-24"
            />
            <input
              type="range"
              min="0"
              max="10"
              value={qualityRange[1]}
              onChange={(e) => setQualityRange([qualityRange[0], parseInt(e.target.value)])}
              className="w-24"
            />
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'chart' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              <PieChart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 text-sm text-gray-400">
          <span>Showing {processedFields.length} of {fields.length} fields</span>
          <span>•</span>
          <span>Avg Quality: {(processedFields.reduce((acc, f) => acc + f.quality_score, 0) / processedFields.length).toFixed(1)}</span>
          <span>•</span>
          <span>Styles: {styles.length}</span>
          <span>•</span>
          <span>Categories: {categories.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              {[
                { key: 'topic', label: 'Topic', width: '25%' },
                { key: 'quality_score', label: 'Quality', width: '10%' },
                { key: 'style', label: 'Style', width: '12%' },
                { key: 'timestamp', label: 'Date', width: '15%' },
                { key: 'content', label: 'Preview', width: '38%' }
              ].map(({ key, label, width }) => (
                <th 
                  key={key}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:bg-gray-800 transition-colors"
                  style={{ width }}
                  onClick={() => handleSort(key as keyof Field)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{label}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {processedFields.map((field) => (
              <tr 
                key={field.id}
                className="hover:bg-gray-750 transition-colors cursor-pointer group"
                onClick={() => {
                  setSelectedField(field)
                  onFieldSelect?.(field)
                }}
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-white group-hover:text-blue-400 transition-colors">
                    {field.topic}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 capitalize">
                    {getCategory(field.topic)}
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full border text-xs font-bold ${getQualityColor(field.quality_score)}`}>
                    <Star className="w-3 h-3 mr-1" />
                    {field.quality_score}/10
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full border text-xs capitalize ${getStyleColor(field.style)}`}>
                    {field.style}
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm text-gray-300">
                    <Clock className="w-3 h-3 mr-1 text-gray-400" />
                    {new Date(field.timestamp).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(field.timestamp).toLocaleTimeString()}
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-300 line-clamp-2">
                    {field.content.substring(0, 120)}...
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Cost: {field.cost_field.toFixed(4)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Field Details Modal */}
      {selectedField && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedField.topic}</h2>
                  <div className="flex items-center space-x-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-bold ${getQualityColor(selectedField.quality_score)}`}>
                      <Star className="w-4 h-4 mr-1" />
                      Quality: {selectedField.quality_score}/10
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm capitalize ${getStyleColor(selectedField.style)}`}>
                      Style: {selectedField.style}
                    </div>
                    <div className="text-sm text-gray-400">
                      Category: {getCategory(selectedField.topic)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedField(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Field Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">ID:</span>
                      <span className="text-white font-mono">{selectedField.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Timestamp:</span>
                      <span className="text-white">{new Date(selectedField.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cost:</span>
                      <span className="text-white">{selectedField.cost_field.toFixed(6)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Content Preview</h3>
                  <div className="text-sm text-gray-300 bg-gray-900 rounded-lg p-3 max-h-32 overflow-y-auto">
                    {selectedField.content}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                  <Download className="w-4 h-4 mr-2 inline" />
                  Export
                </button>
                <button 
                  onClick={() => setSelectedField(null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
