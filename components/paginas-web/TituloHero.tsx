import type { ReactNode } from 'react'
import { serif } from './fuentes'

function Linea({ children, retraso = 0 }: { children: ReactNode; retraso?: number }) {
  return (
    <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
      <span className="linea-hero block" style={{ animationDelay: `${retraso}s` }}>
        {children}
      </span>
    </span>
  )
}

export function TituloHero() {
  return (
    <h1 className="mb-5 font-display text-[32px] font-extrabold leading-[1.05] tracking-tight text-white sm:text-[42px] lg:text-[60px] lg:leading-[1.0]">
      <Linea>Consigue más clientes</Linea>
      <Linea retraso={0.1}>y haz crecer tu negocio</Linea>
      <span className={`${serif.className} mt-1 block text-[1.18em] font-normal italic leading-[1] tracking-normal`}>
        <Linea retraso={0.2}>con una página web</Linea>
        <Linea retraso={0.3}>profesional.</Linea>
      </span>
    </h1>
  )
}
