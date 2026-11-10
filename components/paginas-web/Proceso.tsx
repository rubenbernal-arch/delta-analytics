'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Boton } from './Boton'
import { Revelar } from './Movimiento'
import { serif } from './fuentes'

const pasos = [
  { n: '01', dia: 'Día 1', t: 'Brief', d: 'Nos cuentas qué vendes, a quién y qué quieres lograr con tu página.' },
  { n: '02', dia: 'Día 2', t: 'Diseño', d: 'Armamos el diseño de tu página y te lo mostramos para que lo apruebes.' },
  { n: '03', dia: 'Días 3 y 4', t: 'Desarrollo', d: 'La construimos rápida y lista para verse bien en celular.' },
  { n: '04', dia: 'Día 5', t: 'Publicación', d: 'Sale en línea con tu dominio, el primer año va incluido.' },
]
const N = pasos.length

function Contador({ a, prefijo = '', sufijo = '' }: { a: number; prefijo?: string; sufijo?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const dentro = useInView(ref, { once: true, amount: 0.6 })
  const reducido = useReducedMotion()
  const [v, setV] = useState(0)

  useEffect(() => {
    if (!dentro || reducido) return
    const c = animate(0, a, { duration: 1.6, ease: 'easeOut', onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [dentro, reducido, a])

  const mostrar = reducido ? a : v
  return (
    <span ref={ref}>
      {prefijo}
      {mostrar.toLocaleString('es-MX')}
      {sufijo}
    </span>
  )
}

export function Proceso() {
  const zona = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: zona, offset: ['start 70%', 'end 60%'] })
  const [llego, setLlego] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setLlego(v <= 0 ? 0 : Math.min(N, Math.floor(v * (N - 1) + 0.001) + 1))
  })

  // Solo transform: animar left/width/top/height recalcula layout en cada frame de scroll.
  // Los contenedores del marcador miden lo mismo que la ruta, asi que su translate en % equivale al left/top original.
  const izq = useTransform(scrollYProgress, (v) => `${v * 75}%`)
  const arriba = useTransform(scrollYProgress, (v) => `${v * 100}%`)

  return (
    <section id="proceso" className="relative overflow-x-clip border-t border-[var(--line)] bg-base">
      <svg
        className="pointer-events-none absolute -left-[10%] top-[8%] w-[min(760px,70vw)] opacity-[0.07]"
        viewBox="0 0 100 90"
        fill="none"
        aria-hidden="true"
      >
        <polygon points="50,3 97,87 3,87" stroke="#fff" strokeWidth="0.35" />
        <polygon points="50,24 78,76 22,76" stroke="#FF8000" strokeWidth="0.3" />
      </svg>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 py-20 lg:px-[72px] lg:py-28">
        <div className="flex items-center justify-between font-mono text-[0.72rem] uppercase tracking-[0.16em] text-white/70">
          <span className="flex items-center gap-2">
            <span className="text-accent" aria-hidden="true">▲</span> Proceso
          </span>
          <span>4 etapas · 5 días hábiles</span>
        </div>

        <div className="mb-14 mt-10 lg:mb-20 lg:mt-14">
          <h2 className="font-display text-[clamp(44px,9.5vw,140px)] font-extrabold uppercase leading-[0.88] tracking-[-0.03em] text-white">
            <Revelar>De idea a</Revelar>
            <Revelar retraso={0.1}>página en línea</Revelar>
          </h2>
          <p className={`${serif.className} mt-2 text-[clamp(34px,6.2vw,92px)] italic leading-[1] text-white/90`}>
            <Revelar retraso={0.25}>sin vueltas.</Revelar>
          </p>
        </div>

        <div ref={zona} className="relative">
          {/* Ruta: vertical en celular, horizontal en escritorio */}
          <div className="absolute bottom-2 left-[6px] top-2 w-px bg-white/15 lg:hidden" aria-hidden="true">
            <motion.div style={{ scaleY: scrollYProgress, originY: 0 }} className="h-full w-px bg-accent" />
            <motion.div style={{ y: arriba }} className="absolute inset-0">
              <span className="absolute -left-[6px] top-0 -translate-y-1/2 text-[13px] leading-none text-accent">▲</span>
            </motion.div>
          </div>
          <div className="absolute left-0 right-0 top-[6px] hidden h-px bg-white/15 lg:block" aria-hidden="true">
            <motion.div style={{ scaleX: scrollYProgress, originX: 0 }} className="h-px w-[75%] bg-accent" />
            <motion.div style={{ x: izq }} className="absolute inset-0">
              <span className="absolute left-0 -top-[7px] text-[13px] leading-none text-accent">▲</span>
            </motion.div>
          </div>

          <ol className="grid gap-12 lg:grid-cols-4 lg:gap-0">
            {pasos.map((p, i) => {
              const activo = llego > i
              return (
                <li key={p.t} className="relative pl-10 transition-opacity duration-500 lg:pl-0 lg:pr-4 lg:pt-12" style={{ opacity: activo ? 1 : 0.35 }}>
                  <span className="font-mono text-[0.75rem] tracking-[0.16em] text-accent">{p.n} · {p.dia}</span>
                  <h3 className="mt-3 font-display text-[30px] lg:text-[clamp(20px,2.3vw,36px)] font-extrabold uppercase leading-[0.95] tracking-tight text-white">
                    {p.t}
                  </h3>
                  <p className="mt-4 max-w-[30ch] text-[0.98rem] leading-relaxed text-muted">{p.d}</p>
                </li>
              )
            })}
          </ol>
        </div>

        <dl className="mt-20 grid gap-10 border-t border-white/15 pt-10 sm:grid-cols-3 lg:mt-28 lg:pt-14">
          <div>
            <dt className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted">Días hábiles de entrega</dt>
            <dd className="mt-3 font-display text-[clamp(56px,8vw,120px)] font-extrabold leading-none tracking-tight text-white">
              <Contador a={5} />
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted">Desde, IVA incluido</dt>
            <dd className="mt-3 font-display text-[clamp(56px,8vw,120px)] font-extrabold leading-none tracking-tight text-white">
              <Contador a={8700} prefijo="$" />
              <span className="ml-2 font-mono text-[0.9rem] font-normal tracking-[0.16em] text-muted">MXN</span>
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted">Proyectos en línea</dt>
            <dd className="mt-3 font-display text-[clamp(56px,8vw,120px)] font-extrabold leading-none tracking-tight text-white">
              <Contador a={6} />
            </dd>
          </div>
        </dl>

        <div className="mt-14 flex flex-col gap-5 sm:flex-row sm:items-center">
          <Boton href="#cotiza">Solicitar diagnóstico gratuito</Boton>
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-dim">
            <span className="text-accent" aria-hidden="true">▲</span> 50% de anticipo para arrancar
          </p>
        </div>
      </div>
    </section>
  )
}
