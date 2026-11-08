'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  href: string
  children: ReactNode
  variante?: 'primario' | 'contorno'
  externo?: boolean
  flecha?: boolean
  ariaLabel?: string
}

export function Boton({ href, children, variante = 'primario', externo = false, flecha = true, ariaLabel }: Props) {
  const base =
    'group inline-flex h-[52px] items-center justify-center gap-2 rounded-full px-10 text-[1.05rem] font-semibold transition-shadow'
  const estilos =
    variante === 'primario'
      ? 'bg-accent text-[#14161A] hover:shadow-[0_12px_32px_-8px_rgba(255,128,0,0.6)]'
      : 'border border-white/80 text-white hover:bg-white/10'

  return (
    <motion.a
      href={href}
      {...(externo ? { target: '_blank', rel: 'noopener' } : {})}
      aria-label={ariaLabel}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`${base} ${estilos}`}
    >
      {children}
      {flecha && (
        <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </motion.a>
  )
}
