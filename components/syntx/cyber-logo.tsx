// components/syntx/cyber-logo.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Zap, Cpu, Binary } from 'lucide-react'

export function CyberLogo() {
  const [pulse, setPulse] = useState(0)
  const [glitch, setGlitch] = useState(false)

  // Puls-Effekt
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => (p + 1) % 100)
      
      // Random Glitch Effekt
      if (Math.random() > 0.8) {
        setGlitch(true)
        setTimeout(() => setGlitch(false), 100)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const scale = 1 + (pulse / 100) * 0.3
  const glowOpacity = 0.5 + (pulse / 100) * 0.5

  return (
    <div className="relative flex items-center space-x-4">
      {/* LOGO CONTAINER MIT EXTREMEN EFFEKTEN */}
      <div className="relative">
        {/* BACKGROUND GLOW */}
        <div 
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 blur-xl transition-all duration-300"
          style={{
            opacity: glowOpacity,
            transform: `scale(${scale})`,
          }}
        />
        
        {/* GLITCH OVERLAY */}
        {glitch && (
          <>
            <div className="absolute inset-0 bg-red-500 mix-blend-overlay opacity-20 animate-pulse" />
            <div 
              className="absolute inset-0 bg-cyan-500 mix-blend-overlay opacity-30"
              style={{
                transform: 'translateX(2px)',
                clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'
              }}
            />
          </>
        )}
        
        {/* MAIN LOGO */}
        <div 
          className="relative w-16 h-16 rounded-2xl border-2 border-cyan-400/50 bg-black/80 backdrop-blur-sm overflow-hidden transition-all duration-300"
          style={{
            transform: `scale(${1 + (pulse / 100) * 0.1})`,
            boxShadow: `
              0 0 20px rgba(0, 243, 255, 0.3),
              0 0 40px rgba(255, 0, 255, 0.2),
              inset 0 0 20px rgba(0, 243, 255, 0.1)
            `
          }}
        >
          {/* SCANLINES */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent 50%, to-cyan-500/10 50%) bg-[length:100%_4px] opacity-30" />
          
          {/* PULSING GRID */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10"
            style={{
              opacity: 0.3 + (pulse / 100) * 0.4
            }}
          />
          
          {/* LOGO IMAGE */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src="/Logo1.png"
              alt="SYNTX"
              width={48}
              height={48}
              className={`transition-all duration-200 ${
                glitch ? 'brightness-150 contrast-150' : 'brightness-125 contrast-125'
              }`}
              style={{
                filter: `hue-rotate(${pulse * 3.6}deg) drop-shadow(0 0 10px rgba(0, 243, 255, 0.5))`
              }}
            />
          </div>
          
          {/* CORNER ACCENTS */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-purple-400" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-blue-400" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-green-400" />
          
          {/* PULSING RING */}
          <div 
            className="absolute inset-0 rounded-2xl border-2 border-transparent"
            style={{
              background: `conic-gradient(from ${pulse * 3.6}deg, #00f3ff, #ff00ff, #00ff88, #00f3ff)`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              opacity: 0.8
            }}
          />
        </div>
        
        {/* FLOATING PARTICLES */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              top: `${Math.sin(pulse * 0.1 + i) * 10 + 50}%`,
              left: `${Math.cos(pulse * 0.1 + i) * 10 + 50}%`,
              animationDelay: `${i * 0.5}s`,
              boxShadow: '0 0 10px #00f3ff'
            }}
          />
        ))}
      </div>

      {/* TEXT MIT CYBER EFFEKT */}
      <div className="relative">
        <div className="relative">
          {/* GLITCH TEXT SHADOWS */}
          {glitch && (
            <>
              <div 
                className="absolute -top-1 -left-1 text-4xl font-black bg-gradient-to-r from-red-500 to-cyan-500 bg-clip-text text-transparent opacity-60"
                style={{ transform: 'translate(2px, 1px)' }}
              >
                SYNTX
              </div>
              <div 
                className="absolute -top-1 -right-1 text-4xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent opacity-40"
                style={{ transform: 'translate(-1px, 2px)' }}
              >
                SYNTX
              </div>
            </>
          )}
          
          {/* MAIN TEXT */}
          <h1 
            className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent transition-all duration-300 relative z-10"
            style={{
              textShadow: `
                0 0 20px rgba(0, 243, 255, 0.5),
                0 0 40px rgba(255, 0, 255, 0.3)
              `,
              transform: glitch ? 'translateX(1px)' : 'translateX(0)'
            }}
          >
            SYNTX
          </h1>
        </div>
        
        {/* SUBTITLE */}
        <div className="flex items-center space-x-2 mt-1">
          <div className="flex items-center space-x-1">
            <Cpu className="w-3 h-3 text-cyan-400 animate-pulse" />
            <Binary className="w-3 h-3 text-purple-400 animate-pulse" />
            <Zap className="w-3 h-3 text-blue-400 animate-pulse" />
          </div>
          <p 
            className="text-sm font-mono text-gray-400 transition-all duration-300"
            style={{
              opacity: 0.7 + (pulse / 100) * 0.3,
              textShadow: glitch ? '0 0 10px #00f3ff' : 'none'
            }}
          >
            FIELD_RESONANCE_SYSTEM
          </p>
        </div>
      </div>

      {/* CONNECTION LINES */}
      <div className="absolute -inset-4 pointer-events-none">
        {/* ANIMATED CONNECTION CIRCLES */}
        <div 
          className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-cyan-400/30 rounded-full animate-spin"
          style={{
            animationDuration: '8s',
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-40 h-40 border-2 border-purple-400/20 rounded-full animate-spin"
          style={{
            animationDuration: '12s',
            animationDirection: 'reverse',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
    </div>
  )
}