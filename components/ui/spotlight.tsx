'use client'

/**
 * Spotlight — a radial gradient that follows the mouse, creating a
 * "lens" / spotlight effect on dark surfaces.
 *
 * Wrap any dark card/section with <SpotlightCard> to activate.
 * The highlight color defaults to the brand accent blue.
 */

import { useRef, useState, useCallback, type ReactNode, type MouseEvent } from 'react'

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  /** Accent color for the spotlight (defaults to accent blue) */
  color?: string
  /** Spotlight radius in px (default 480) */
  radius?: number
}

export function SpotlightCard({
  children,
  className = '',
  color = 'rgba(91,141,255,0.13)',
  radius = 480,
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const [pos, setPos]   = useState({ x: 0, y: 0 })
  const [show, setShow] = useState(false)

  const handleMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setShow(true)
  }, [])

  return (
    <div
      ref={divRef}
      onMouseMove={handleMove}
      onMouseLeave={() => setShow(false)}
      className={`relative overflow-hidden ${className}`}
    >
      {/* spotlight gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: show ? 1 : 0,
          background: `radial-gradient(${radius}px circle at ${pos.x}px ${pos.y}px, ${color}, transparent 65%)`,
        }}
      />
      {children}
    </div>
  )
}
