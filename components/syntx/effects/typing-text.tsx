'use client'

import { useState, useEffect } from 'react'

interface TypingTextProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function TypingText({ text, speed = 50, className = '', onComplete }: TypingTextProps) {
  const [displayed, setDisplayed] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let i = 0
    setDisplayed('')
    setIsComplete(false)

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
        setIsComplete(true)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <span className={className}>
      {displayed}
      {!isComplete && <span className="animate-pulse">▌</span>}
    </span>
  )
}
