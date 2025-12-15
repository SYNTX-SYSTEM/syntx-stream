'use client'

import { useState, useEffect } from 'react'

interface GlitchTextProps {
  text: string
  className?: string
}

export function GlitchText({ text, className = '' }: GlitchTextProps) {
  const [glitchText, setGlitchText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`αβγδεζ∑∂∇∞'
    
    const triggerGlitch = () => {
      setIsGlitching(true)
      let iterations = 0
      const maxIterations = 10
      
      const interval = setInterval(() => {
        setGlitchText(
          text.split('').map((char, i) => {
            if (i < iterations) return text[i]
            return glitchChars[Math.floor(Math.random() * glitchChars.length)]
          }).join('')
        )
        
        iterations++
        if (iterations > maxIterations) {
          clearInterval(interval)
          setGlitchText(text)
          setIsGlitching(false)
        }
      }, 50)
    }

    const randomInterval = setInterval(() => {
      if (Math.random() > 0.7) triggerGlitch()
    }, 3000)

    return () => clearInterval(randomInterval)
  }, [text])

  return (
    <span className={`relative inline-block ${className}`}>
      <span className={`relative z-10 ${isGlitching ? 'animate-pulse' : ''}`}>
        {glitchText}
      </span>
      {isGlitching && (
        <>
          <span className="absolute inset-0 text-cyan-400 opacity-70 animate-pulse" style={{ transform: 'translate(-2px, -1px)' }}>
            {glitchText}
          </span>
          <span className="absolute inset-0 text-red-400 opacity-70 animate-pulse" style={{ transform: 'translate(2px, 1px)' }}>
            {glitchText}
          </span>
        </>
      )}
    </span>
  )
}
