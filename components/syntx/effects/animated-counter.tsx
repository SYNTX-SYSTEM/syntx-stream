'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}

export function AnimatedCounter({ 
  value, 
  duration = 2000, 
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const prevValue = useRef(0)

  useEffect(() => {
    const startValue = prevValue.current
    const endValue = value
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function - ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      const currentCount = startValue + (endValue - startValue) * easeOut
      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        prevValue.current = endValue
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  )
}
