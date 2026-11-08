'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { motion, useInView } from 'framer-motion'

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 })
    return () => lenis.destroy()
  }, [])
  return null
}

/* La entrada se detecta en la mascara (siempre visible), no en el texto que sube:
   si se observara el texto, quedaria recortado por la mascara y nunca arrancaria. */
export function Revelar({ children, retraso = 0 }: { children: ReactNode; retraso?: number }) {
  const mascara = useRef<HTMLSpanElement>(null)
  const dentro = useInView(mascara, { once: true, amount: 0.3 })
  return (
    <span ref={mascara} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
      <motion.span
        className="block"
        initial={{ y: '110%' }}
        animate={{ y: dentro ? 0 : '110%' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: retraso }}
      >
        {children}
      </motion.span>
    </span>
  )
}
