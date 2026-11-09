import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

type Props = {
  href: string
  children: ReactNode
  variante?: 'primario' | 'cristal'
  externo?: boolean
  flecha?: boolean
  tamano?: 'normal' | 'mini' | 'barra'
  bloque?: boolean
  ariaLabel?: string
}

export function Boton({ href, children, variante = 'primario', externo = false, flecha = true, tamano = 'normal', bloque = false, ariaLabel }: Props) {
  const clases = ['btn86', variante === 'primario' ? 'btn86-p' : 'btn86-s', tamano === 'mini' ? 'btn86-mini' : tamano === 'barra' ? 'btn86-barra' : '', bloque ? 'btn86-full' : '']
    .filter(Boolean)
    .join(' ')
  return (
    <a href={href} aria-label={ariaLabel} className={clases} {...(externo ? { target: '_blank', rel: 'noopener' } : {})}>
      <span>{children}</span>
      {flecha && <ArrowRight className="h-[1.1em] w-[1.1em] shrink-0" aria-hidden="true" />}
    </a>
  )
}
