'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  href: string
  children: ReactNode
  variante?: 'primario' | 'cristal'
  externo?: boolean
  flecha?: boolean
  tamano?: 'normal' | 'mini'
  ariaLabel?: string
}

export const estilos = {
  primario:
    'border border-[rgba(255,215,160,0.8)] bg-[linear-gradient(135deg,rgba(255,196,120,0.96),rgba(255,128,0,0.88))] text-[#14161A] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-2px_6px_rgba(200,90,0,0.35),0_12px_34px_-10px_rgba(255,128,0,0.75)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-2px_6px_rgba(200,90,0,0.35),0_18px_46px_-8px_rgba(255,128,0,0.9)]',
  cristal:
    'border border-white/25 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_30px_-12px_rgba(0,0,0,0.6)] hover:border-white/50',
}

export const brillo = {
  primario: 'from-white/40',
  cristal: 'from-white/15',
}

export const tamanos = {
  normal: 'h-[52px] px-9 text-[1.05rem]',
  mini: 'h-9 px-4 text-[0.82rem]',
}

export function Boton({
  href,
  children,
  variante = 'primario',
  externo = false,
  flecha = true,
  tamano = 'normal',
  ariaLabel,
}: Props) {
  const mx = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 200, damping: 15 })

  return (
    <motion.a
      href={href}
      {...(externo ? { target: '_blank', rel: 'noopener' } : {})}
      aria-label={ariaLabel}
      style={{ x: sx }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - (r.left + r.width / 2)) * 0.18)
      }}
      onMouseLeave={() => mx.set(0)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`group relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-full font-semibold backdrop-blur-xl transition-shadow ${tamanos[tamano]} ${estilos[variante]}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b ${brillo[variante]} to-transparent`}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.4)_50%,transparent_70%)] transition-transform duration-700 group-hover:translate-x-full"
      />
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {flecha && (
          <ArrowRight size={tamano === 'mini' ? 14 : 18} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
        )}
      </span>
    </motion.a>
  )
}
