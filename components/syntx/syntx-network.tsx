// components/syntx/syntx-network.tsx
'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Network, Zap, Cpu, Radar } from 'lucide-react'

interface Prompt {
  id: string
  topic: string
  style: string
  score: number
  wrapper: string
}

interface NetworkNode {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  prompt: Prompt
  connections: string[]
  pulse: number
}

export function SYNTXNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<NetworkNode[]>([])
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null)
  const [pulse, setPulse] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [prompts, setPrompts] = useState<Prompt[]>([])

  // Lade Prompts vom funktionierenden Endpoint
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('https://dev.syntx-system.com/prompts/complete-export')
        const data = await res.json()
        // Map exports to Prompt format - first 50 for performance
        const limited = (data.exports || []).slice(0, 50).map((e: any) => ({
          id: e.id || Math.random().toString(),
          topic: e.gpt_metadata?.quality_assessment?.quality_rating || 'unknown',
          style: e.gpt_metadata?.quality_assessment?.quality_rating || 'unknown',
          score: e.quality?.total_score || 0,
          wrapper: 'syntx'
        }))
        setPrompts(limited)
      } catch (error) {
        console.error('Failed to load:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Erstelle Nodes aus Prompts
  useEffect(() => {
    if (prompts.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const width = canvas.width
    const height = canvas.height

    const newNodes: NetworkNode[] = prompts.map((prompt, i) => {
      const angle = (i / prompts.length) * Math.PI * 2
      const radius = Math.min(width, height) * 0.35
      return {
        id: prompt.id,
        x: width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 50,
        y: height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 50,
        vx: 0,
        vy: 0,
        prompt,
        connections: [],
        pulse: Math.random()
      }
    })

    // Verbinde ähnliche Topics
    newNodes.forEach((node, i) => {
      newNodes.forEach((other, j) => {
        if (i !== j && node.prompt.topic === other.prompt.topic) {
          node.connections.push(other.id)
        }
      })
    })

    setNodes(newNodes)
  }, [prompts])

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || nodes.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      nodes.forEach(node => {
        node.connections.forEach(connId => {
          const target = nodes.find(n => n.id === connId)
          if (target) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0, 255, 255, 0.15)`
            ctx.lineWidth = 0.5
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(target.x, target.y)
            ctx.stroke()
          }
        })
      })

      // Draw nodes
      nodes.forEach(node => {
        const score = node.prompt.score
        const color = score >= 80 ? '#0f0' : score >= 50 ? '#ff0' : score > 0 ? '#f80' : '#f00'
        const size = 4 + (score / 20)

        ctx.beginPath()
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()

        // Glow
        ctx.shadowBlur = 10
        ctx.shadowColor = color
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animationId)
  }, [nodes])

  // Pulse animation
  useEffect(() => {
    const interval = setInterval(() => setPulse(p => (p + 1) % 100), 50)
    return () => clearInterval(interval)
  }, [])

  const TOPIC_COLORS: Record<string, string> = {
    technologie: '#3b82f6', harmlos: '#22c55e', bildung: '#a855f7',
    gesellschaft: '#06b6d4', kontrovers: '#f97316', grenzwertig: '#eab308', kritisch: '#ef4444'
  }

  const topNodes = nodes
    .sort((a, b) => b.prompt.score - a.prompt.score)
    .slice(0, 5)

  const qualityBuckets = [
    { label: 'Q10', range: [90, 100], count: nodes.filter(n => n.prompt.score >= 90).length },
    { label: 'Q9', range: [80, 89], count: nodes.filter(n => n.prompt.score >= 80 && n.prompt.score < 90).length },
    { label: 'Q8', range: [70, 79], count: nodes.filter(n => n.prompt.score >= 70 && n.prompt.score < 80).length },
    { label: 'Q7', range: [60, 69], count: nodes.filter(n => n.prompt.score >= 60 && n.prompt.score < 70).length },
    { label: 'Q6', range: [50, 59], count: nodes.filter(n => n.prompt.score >= 50 && n.prompt.score < 60).length },
    { label: 'Q5', range: [0, 49], count: nodes.filter(n => n.prompt.score < 50).length },
  ]

  const avgConnections = nodes.length > 0 
    ? (nodes.reduce((sum, n) => sum + n.connections.length, 0) / nodes.length).toFixed(1)
    : '0'

  const isolatedNodes = nodes.filter(n => n.connections.length === 0).length
  const totalConnections = nodes.reduce((sum, n) => sum + n.connections.length, 0) / 2

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          SYNTX NETWORK MATRIX
        </h2>
        <p className="text-gray-500 mt-1">Real-time field resonance network with {nodes.length} active nodes and {Math.floor(totalConnections)} connections</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-black/60 rounded-xl p-4 border border-cyan-500/30">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Network className="w-5 h-5" />
            <span className="text-2xl font-bold">{nodes.length}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Active Nodes</div>
        </div>
        <div className="bg-black/60 rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center space-x-2 text-purple-400">
            <Zap className="w-5 h-5" />
            <span className="text-2xl font-bold">{Math.floor(totalConnections)}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Connections</div>
        </div>
        <div className="bg-black/60 rounded-xl p-4 border border-green-500/30">
          <div className="flex items-center space-x-2 text-green-400">
            <Cpu className="w-5 h-5" />
            <span className="text-2xl font-bold">{nodes.length > 0 ? Math.round((nodes.reduce((s,n) => s + n.prompt.score, 0) / nodes.length)) : 0}%</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Resonance</div>
        </div>
        <div className="bg-black/60 rounded-xl p-4 border border-yellow-500/30">
          <div className="flex items-center space-x-2 text-yellow-400">
            <Radar className="w-5 h-5" />
            <span className="text-2xl font-bold">{isLoading ? 'SCANNING' : 'ONLINE'}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Status</div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative bg-black/80 rounded-2xl border border-purple-500/30 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={1200}
          height={400}
          className="w-full h-[400px]"
        />
        
        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-black/80 rounded-lg p-3 border border-gray-700">
          <div className="text-xs font-mono text-gray-400 mb-2">Node Quality</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-gray-400">High (8-10)</span></div>
            <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-yellow-500" /><span className="text-gray-400">Medium (5-7)</span></div>
            <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-orange-500" /><span className="text-gray-400">Low (1-5)</span></div>
            <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-gray-400">Critical (0-1)</span></div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-black/60 rounded-xl p-4 border border-cyan-500/30">
          <h4 className="text-cyan-400 font-bold mb-3">Top Connected Nodes</h4>
          <div className="space-y-2">
            {topNodes.map((node, i) => (
              <div key={node.id} className="flex justify-between text-sm">
                <span className="text-gray-400">{node.prompt.topic}</span>
                <span className="text-cyan-400 font-mono">{node.prompt.score}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-black/60 rounded-xl p-4 border border-purple-500/30">
          <h4 className="text-purple-400 font-bold mb-3">Quality Distribution</h4>
          <div className="space-y-2">
            {qualityBuckets.map(bucket => (
              <div key={bucket.label} className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 w-8">{bucket.label}</span>
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                    style={{ width: `${nodes.length > 0 ? (bucket.count / nodes.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-6">{bucket.count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-black/60 rounded-xl p-4 border border-red-500/30">
          <h4 className="text-red-400 font-bold mb-3">Network Health</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Connections:</span>
              <span className="text-cyan-400 font-mono">{avgConnections}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Isolated Nodes:</span>
              <span className="text-yellow-400 font-mono">{isolatedNodes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Network Density:</span>
              <span className="text-green-400 font-mono">
                {nodes.length > 1 ? ((totalConnections / (nodes.length * (nodes.length - 1) / 2)) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
