'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedCounterProps {
  end: number
  start?: number
  duration?: number
  prefix?: string
  suffix?: string
  separator?: string
  className?: string
  onComplete?: () => void
}

export default function AnimatedCounter({
  end,
  start = 0,
  duration = 2000,
  prefix = '',
  suffix = '',
  separator = ',',
  className = '',
  onComplete
}: AnimatedCounterProps) {
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const currentRef = counterRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const startValue = start
    const endValue = end

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease out cubic)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutCubic)
      
      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(endValue)
        onComplete?.()
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, start, end, duration, onComplete])

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  }

  return (
    <span
      ref={counterRef}
      className={className}
    >
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  )
}