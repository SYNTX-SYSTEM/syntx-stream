// components/syntx/syntx-network.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { Network, Zap, Cpu, Binary, Satellite, Radar } from 'lucide-react'

interface Field {
  id: string
  topic: string
  content: string
  style: string
  quality_score: number
  timestamp: string
  cost_field: number
}

interface NetworkNode {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  field: Field
  connections: string[]
  pulse: number
}

export function SYNTXNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<NetworkNode[]>([])
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null)
  const [pulse, setPulse] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fields, setFields] = useState<Field[]>([])

  // Lade Felder-Daten vom API-Endpoint
  useEffect(() => {
    const loadFields = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const fieldsRes = await fetch('https://dev.syntx-system.com/feld/prompts?limit=40')
        if (!fieldsRes.ok) {
          throw new Error(`Failed to load fields: ${fieldsRes.status}`)
        }
        const fieldsData = await fieldsRes.json()
        setFields(fieldsData.prompts || [])
      } catch (error) {
        console.error('Failed to load network data:', error)
        setError('Failed to load network data from server')
      }
      setIsLoading(false)
    }

    loadFields()
  }, [])

  // Cyberdark Farbpalette
  const COLORS = {
    primary: '#00f3ff',
    secondary: '#ff00ff', 
    accent: '#00ff88',
    background: '#0a0a0f',
    grid: '#1a1a2f',
    node: {
      high: '#00ff88',
      medium: '#ff00ff',
      low: '#00f3ff',
      critical: '#ff0044'
    }
  }

  // Puls-Effekt
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => (p + 1) % 100)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Nodes initialisieren
  useEffect(() => {
    if (fields.length === 0) return

    const newNodes: NetworkNode[] = fields.map((field, index) => {
      const angle = (index / fields.length) * Math.PI * 2
      const distance = 150 + Math.random() * 200
      return {
        id: field.id,
        x: Math.cos(angle) * distance + 400,
        y: Math.sin(angle) * distance + 300,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        field,
        connections: [],
        pulse: Math.random() * 100
      }
    })

    // Verbindungen erstellen basierend auf Kategorien und Quality
    newNodes.forEach(node => {
      node.connections = newNodes
        .filter(other => 
          other.id !== node.id && 
          getCategory(other.field.topic) === getCategory(node.field.topic) &&
          Math.random() > 0.7
        )
        .map(other => other.id)
    })

    setNodes(newNodes)
  }, [fields])

  // Animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const render = () => {
      // Clear mit Cyberdark Gradient
      const gradient = ctx.createRadialGradient(400, 300, 50, 400, 300, 500)
      gradient.addColorStop(0, '#0a0a0f')
      gradient.addColorStop(1, '#000000')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Grid zeichnen
      drawGrid(ctx)

      // Nodes aktualisieren
      const updatedNodes = nodes.map(node => {
        // Physik
        let newX = node.x + node.vx
        let newY = node.y + node.vy

        // Boundary check
        if (newX < 50 || newX > 750) node.vx *= -1
        if (newY < 50 || newY > 550) node.vy *= -1

        // Puls
        const newPulse = (node.pulse + 1) % 100

        return {
          ...node,
          x: newX,
          y: newY,
          pulse: newPulse
        }
      })

      setNodes(updatedNodes)

      // Verbindungen zeichnen
      updatedNodes.forEach(node => {
        node.connections.forEach(connectionId => {
          const target = updatedNodes.find(n => n.id === connectionId)
          if (target) {
            drawConnection(ctx, node, target)
          }
        })
      })

      // Nodes zeichnen
      updatedNodes.forEach(node => {
        drawNode(ctx, node, node === selectedNode)
      })

      // Puls-Effekt zeichnen
      drawPulseEffect(ctx, pulse)

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [nodes, pulse, selectedNode])

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = COLORS.grid
    ctx.lineWidth = 0.5
    ctx.setLineDash([5, 5])

    // Vertical lines
    for (let x = 0; x < 800; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, 600)
      ctx.stroke()
    }

    // Horizontal lines
    for (let y = 0; y < 600; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(800, y)
      ctx.stroke()
    }

    ctx.setLineDash([])
  }

  const drawConnection = (ctx: CanvasRenderingContext2D, from: NetworkNode, to: NetworkNode) => {
    const distance = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2)
    const alpha = Math.max(0, 1 - distance / 300)

    const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y)
    gradient.addColorStop(0, COLORS.primary + '80')
    gradient.addColorStop(1, COLORS.secondary + '80')

    ctx.strokeStyle = gradient
    ctx.lineWidth = 1
    ctx.globalAlpha = alpha

    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()

    ctx.globalAlpha = 1
  }

  const drawNode = (ctx: CanvasRenderingContext2D, node: NetworkNode, isSelected: boolean) => {
    const pulseScale = 1 + Math.sin((node.pulse / 100) * Math.PI * 2) * 0.2
    
    // Puls Ring
    if (isSelected) {
      ctx.strokeStyle = COLORS.accent
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(node.x, node.y, 20 * pulseScale, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Node Farbe basierend auf Quality
    let color = COLORS.node.medium
    if (node.field.quality_score >= 8) color = COLORS.node.high
    if (node.field.quality_score <= 5) color = COLORS.node.low
    if (node.field.quality_score <= 3) color = COLORS.node.critical

    // Node Kreis
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(node.x, node.y, 8, 0, Math.PI * 2)
    ctx.fill()

    // Glow Effekt
    const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 15)
    gradient.addColorStop(0, color + '80')
    gradient.addColorStop(1, color + '00')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(node.x, node.y, 15, 0, Math.PI * 2)
    ctx.fill()

    // Label
    if (isSelected) {
      ctx.fillStyle = '#ffffff'
      ctx.font = '12px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(node.field.topic, node.x, node.y - 25)
      
      ctx.fillStyle = COLORS.accent
      ctx.font = '10px monospace'
      ctx.fillText(`Q:${node.field.quality_score} | ${getCategory(node.field.topic)}`, node.x, node.y - 35)
    }
  }

  const drawPulseEffect = (ctx: CanvasRenderingContext2D, pulse: number) => {
    const scale = 1 + (pulse / 100) * 0.5
    const alpha = 0.3 * (1 - pulse / 100)

    ctx.strokeStyle = COLORS.primary
    ctx.lineWidth = 2
    ctx.globalAlpha = alpha
    
    ctx.beginPath()
    ctx.arc(400, 300, 200 * scale, 0, Math.PI * 2)
    ctx.stroke()

    ctx.globalAlpha = 1
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2)
      return distance < 15
    })

    setSelectedNode(clickedNode || null)
  }

  // Kategorie Funktion (wie in page.tsx)
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Network Error</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* NETWORK HEADER */}
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
          SYNTX NETWORK MATRIX
        </h2>
        <p className="text-gray-400 text-lg">
          Real-time field resonance network with {nodes.length} active nodes and {nodes.reduce((acc, node) => acc + node.connections.length, 0)} connections
        </p>
      </div>

      {/* CONTROL PANEL */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 rounded-xl p-4 border border-cyan-500/30">
          <div className="flex items-center space-x-3">
            <Satellite className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-white font-bold">{nodes.length}</div>
              <div className="text-gray-400 text-sm">Active Nodes</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center space-x-3">
            <Radar className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-white font-bold">
                {nodes.reduce((acc, node) => acc + node.connections.length, 0)}
              </div>
              <div className="text-gray-400 text-sm">Connections</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 rounded-xl p-4 border border-green-500/30">
          <div className="flex items-center space-x-3">
            <Cpu className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-white font-bold">
                {Math.round(pulse)}%
              </div>
              <div className="text-gray-400 text-sm">Resonance</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 rounded-xl p-4 border border-blue-500/30">
          <div className="flex items-center space-x-3">
            <Binary className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-white font-bold">
                {selectedNode ? 'LOCKED' : 'SCANNING'}
              </div>
              <div className="text-gray-400 text-sm">Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* NETWORK CANVAS */}
      <div className="relative bg-black rounded-2xl border border-cyan-500/30 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-[600px] cursor-crosshair"
          onClick={handleCanvasClick}
        />
        
        {/* OVERLAY INFO */}
        {selectedNode && (
          <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/50 max-w-md">
            <h3 className="text-cyan-400 font-bold text-lg mb-2">{selectedNode.field.topic}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Quality:</span>
                <span className="text-green-400 font-mono">Q{selectedNode.field.quality_score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Style:</span>
                <span className="text-purple-400 font-mono capitalize">{selectedNode.field.style}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Category:</span>
                <span className="text-blue-400 font-mono">{getCategory(selectedNode.field.topic)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Connections:</span>
                <span className="text-cyan-400 font-mono">{selectedNode.connections.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cost:</span>
                <span className="text-yellow-400 font-mono">{selectedNode.field.cost_field.toFixed(4)}</span>
              </div>
            </div>
          </div>
        )}

        {/* LEGEND */}
        <div className="absolute bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 border border-purple-500/50">
          <h4 className="text-purple-400 font-bold mb-2">Node Quality</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-300">High (8-10)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-gray-300">Medium (6-7)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
              <span className="text-gray-300">Low (4-5)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-300">Critical (0-3)</span>
            </div>
          </div>
        </div>
      </div>

      {/* NODE STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 rounded-xl p-4 border border-cyan-500/30">
          <h4 className="text-cyan-400 font-bold mb-2">Top Connected Nodes</h4>
          {nodes
            .sort((a, b) => b.connections.length - a.connections.length)
            .slice(0, 3)
            .map(node => (
              <div key={node.id} className="flex justify-between items-center py-1">
                <span className="text-gray-300 text-sm truncate">{node.field.topic}</span>
                <span className="text-cyan-400 font-mono text-sm">{node.connections.length}</span>
              </div>
            ))
          }
        </div>

        <div className="bg-gray-900/50 rounded-xl p-4 border border-purple-500/30">
          <h4 className="text-purple-400 font-bold mb-2">Quality Distribution</h4>
          {[10, 9, 8, 7, 6, 5].map(score => {
            const count = nodes.filter(n => Math.floor(n.field.quality_score) === score).length
            return (
              <div key={score} className="flex items-center space-x-2 py-1">
                <span className="text-gray-400 text-sm w-6">Q{score}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-purple-500 transition-all duration-500"
                    style={{ width: `${(count / nodes.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-gray-300 text-sm w-8">{count}</span>
              </div>
            )
          })}
        </div>

        <div className="bg-gray-900/50 rounded-xl p-4 border border-green-500/30">
          <h4 className="text-green-400 font-bold mb-2">Network Health</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Connections:</span>
              <span className="text-green-400">
                {(nodes.reduce((acc, node) => acc + node.connections.length, 0) / nodes.length).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Isolated Nodes:</span>
              <span className="text-yellow-400">
                {nodes.filter(n => n.connections.length === 0).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Network Density:</span>
              <span className="text-cyan-400">
                {((nodes.reduce((acc, node) => acc + node.connections.length, 0) / (nodes.length * (nodes.length - 1))) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}