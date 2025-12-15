'use client'

import { useEffect, useState } from 'react'

interface Point {
  x: number
  y: number
  id: number
}

export function CursorTrail() {
  const [trail, setTrail] = useState<Point[]>([])

  useEffect(() => {
    let id = 0
    const handleMouse = (e: MouseEvent) => {
      id++
      setTrail(prev => [...prev.slice(-20), { x: e.clientX, y: e.clientY, id }])
    }

    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {trail.map((point, i) => (
        <div
          key={point.id}
          className="absolute rounded-full"
          style={{
            left: point.x - 4,
            top: point.y - 4,
            width: 8 + i * 0.5,
            height: 8 + i * 0.5,
            background: `radial-gradient(circle, rgba(0,255,255,${0.1 + i * 0.03}) 0%, transparent 70%)`,
            transform: `scale(${0.5 + i * 0.05})`,
            boxShadow: `0 0 ${10 + i * 2}px rgba(0,255,255,${0.2 + i * 0.02})`
          }}
        />
      ))}
      {trail.length > 0 && (
        <div
          className="absolute w-6 h-6 -translate-x-3 -translate-y-3"
          style={{
            left: trail[trail.length - 1]?.x,
            top: trail[trail.length - 1]?.y,
            background: 'radial-gradient(circle, rgba(255,0,255,0.8) 0%, rgba(0,255,255,0.4) 50%, transparent 70%)',
            boxShadow: '0 0 20px #0ff, 0 0 40px #f0f',
            borderRadius: '50%'
          }}
        />
      )}
    </div>
  )
}
