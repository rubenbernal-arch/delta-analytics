'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import {
  motion,
  MotionConfig,
  useMotionValue,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from 'framer-motion'
import { Boton } from './Boton'
import { Revelar } from './Movimiento'
import { serif } from './fuentes'

const DURACION = 5500
const WHATSAPP = 'https://wa.me/523330163038?text=Hola%2C%20quiero%20cotizar%20una%20p%C3%A1gina%20web%20para%20mi%20negocio'
const CHAFLAN = 'polygon(0 0, calc(100% - 44px) 0, 100% 44px, 100% 100%, 44px 100%, 0 calc(100% - 44px))'

const GRANO = encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='.6'/></svg>",
)

const proyectos = [
  {
    nombre: 'TradeIQ Pro',
    giro: 'Plataforma de señales de trading',
    funcion: 'Plataforma web hecha por Delta Analytics',
    dominio: 'tradeiqpro.com',
    href: 'https://www.tradeiqpro.com',
    img: '/paginas-web/casos/tradeiq.webp',
    movil: '/paginas-web/casos/tradeiq-mobile.webp',
    alt: 'TradeIQ Pro, plataforma de señales de trading hecha por Delta Analytics',
  },
  {
    nombre: 'Shubati',
    giro: 'Facturación por WhatsApp',
    funcion: 'Sitio de un servicio de facturación CFDI 4.0',
    dominio: 'shubati.mx',
    href: 'https://shubati.mx',
    img: '/paginas-web/casos/shubati.webp',
    movil: '/paginas-web/casos/shubati-mobile.webp',
    alt: 'Sitio de Shubati, facturación por WhatsApp, hecho por Delta Analytics',
  },
  {
    nombre: 'Delta Analytics',
    giro: 'Software, automatización e IA',
    funcion: 'Nuestro propio sitio corporativo',
    dominio: 'deltaanalytics.com.mx',
    href: 'https://www.deltaanalytics.com.mx',
    img: '/paginas-web/casos/delta.webp',
    movil: '/paginas-web/casos/delta-mobile.webp',
    alt: 'Sitio corporativo de Delta Analytics',
  },
  {
    nombre: 'TLA Adventures',
    giro: 'Renta de cuatrimotos',
    funcion: 'Elige ruta y vehículo, y reserva en línea',
    dominio: 'tlaadventures.com',
    href: 'https://tlaadventures.com',
    img: '/paginas-web/casos/tla.webp',
    movil: '/paginas-web/casos/tla-mobile.webp',
    alt: 'Página web de TLA Adventures hecha por Delta Analytics',
  },
  {
    nombre: 'La Puerta de Michoacán',
    giro: 'Restaurante boutique',
    funcion: 'Menú, galería y reservación de mesa',
    dominio: 'lapuertademichoacan.com',
    href: 'https://lapuertademichoacan.com',
    img: '/paginas-web/casos/lapuerta.webp',
    movil: '/paginas-web/casos/lapuerta-mobile.webp',
    alt: 'Página web de La Puerta de Michoacán hecha por Delta Analytics',
  },
  {
    nombre: 'La Herencia Tours',
    giro: 'Tours off road',
    funcion: 'Reserva por WhatsApp o llamada en un toque',
    dominio: 'laherenciatours.com',
    href: 'https://www.laherenciatours.com/',
    img: '/paginas-web/casos/herencia.webp',
    movil: '/paginas-web/casos/herencia-mobile.webp',
    alt: 'Página web de La Herencia Tours hecha por Delta Analytics',
  },
]

const N = proyectos.length

const subir: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}
const lista: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const visible = { once: true, amount: 0.2 } as const

function horaGDL() {
  return new Date().toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Mexico_City',
  })
}

function useEscritorio() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia('(min-width: 1024px)')
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    () => window.matchMedia('(min-width: 1024px)').matches,
    () => false,
  )
}

function Relleno({ progreso, i }: { progreso: MotionValue<number>; i: number }) {
  const escala = useTransform(progreso, [i / N, (i + 1) / N], [0, 1])
  return <motion.span style={{ scaleX: escala, originX: 0 }} className="absolute inset-x-0 -top-px h-[2px] bg-accent" />
}

export function Proyectos() {
  const [activo, setActivo] = useState(0)
  const [pausado, setPausado] = useState(false)
  const [hora, setHora] = useState('')
  const reducido = useReducedMotion()
  const escritorio = useEscritorio()
  const actual = proyectos[activo]
  const zona = useRef<HTMLDivElement>(null)

  // Solo la primera captura se monta de inicio; el resto se monta cuando la seccion se acerca
  // a la pantalla (o al llegar a ese proyecto), para no descargar 12 imagenes al cargar la pagina.
  const cerca = useInView(zona, { once: true, margin: '600px 0px' })
  const montar = (i: number) => cerca || i === 0 || i === activo

  // Scroll fijo: el progreso de la zona alta decide el proyecto activo (solo escritorio)
  const { scrollYProgress } = useScroll({ target: zona, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!escritorio) return
    setActivo(Math.min(N - 1, Math.max(0, Math.floor(v * N))))
  })

  useEffect(() => {
    const tick = () => setHora(horaGDL())
    const t0 = setTimeout(tick, 0)
    const id = setInterval(tick, 30000)
    return () => {
      clearTimeout(t0)
      clearInterval(id)
    }
  }, [])

  // Cambio automatico solo en celular o tableta
  useEffect(() => {
    if (escritorio || pausado || reducido) return
    const id = setTimeout(() => setActivo((a) => (a + 1) % N), DURACION)
    return () => clearTimeout(id)
  }, [activo, pausado, reducido, escritorio])

  function irA(i: number) {
    if (escritorio && zona.current) {
      const r = zona.current.getBoundingClientRect()
      const total = zona.current.offsetHeight - window.innerHeight
      window.scrollTo({ top: window.scrollY + r.top + total * ((i + 0.5) / N), behavior: 'smooth' })
    } else {
      setActivo(i)
    }
  }

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 120, damping: 20 })
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [3, -3]), { stiffness: 120, damping: 20 })
  const movilX = useSpring(useTransform(x, [-0.5, 0.5], [14, -14]), { stiffness: 120, damping: 20 })

  function mover(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }
  function soltar() {
    x.set(0)
    y.set(0)
  }

  return (
    <MotionConfig reducedMotion="user">
      <section id="proyectos" className="relative overflow-x-clip border-t border-[var(--line)] bg-base">
        <svg
          className="pointer-events-none absolute -right-[12%] top-[6%] w-[min(900px,80vw)] opacity-[0.09]"
          viewBox="0 0 100 90"
          fill="none"
          aria-hidden="true"
        >
          <polygon points="50,3 97,87 3,87" stroke="#fff" strokeWidth="0.35" />
          <polygon points="50,18 84,80 16,80" stroke="#fff" strokeWidth="0.25" />
          <polygon points="50,33 71,73 29,73" stroke="#FF8000" strokeWidth="0.3" />
        </svg>
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_55%,rgba(255,128,0,0.14),transparent_55%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml;utf8,${GRANO}")` }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-16 pt-10 lg:px-[72px] lg:pb-24 lg:pt-12">
          <div className="flex items-center justify-between font-mono text-[0.72rem] uppercase tracking-[0.16em] text-white/70">
            <span className="flex items-center gap-2">
              <span className="text-accent" aria-hidden="true">▲</span> Proyectos reales
            </span>
            <span className="hidden sm:inline">GDL {hora || '--:--'}</span>
            <span>{String(N).padStart(2, '0')} proyectos en línea</span>
          </div>

          <div className="mb-12 mt-10 lg:mb-10 lg:mt-14">
            <h2 className="font-display text-[clamp(44px,9.5vw,140px)] font-extrabold uppercase leading-[0.88] tracking-[-0.03em] text-white">
              <Revelar>Lo que ya hemos</Revelar>
            </h2>
            <p className={`${serif.className} mt-2 text-[clamp(34px,6.2vw,92px)] italic leading-[1] text-white/90`}>
              <Revelar retraso={0.15}>construido.</Revelar>
            </p>
          </div>

          {/* Zona alta: en escritorio la ventana queda fija mientras se recorre */}
          <div ref={zona} className="lg:h-[var(--alto)]" style={{ '--alto': `${N * 80}vh` } as React.CSSProperties}>
            <div
              className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center"
              onMouseEnter={() => setPausado(true)}
              onMouseLeave={() => setPausado(false)}
              onFocusCapture={() => setPausado(true)}
              onBlurCapture={() => setPausado(false)}
            >
              <div className="grid w-full grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.3fr)] lg:gap-14">
                <motion.div
                  variants={lista}
                  initial="hidden"
                  whileInView="visible"
                  viewport={visible}
                  className="order-2 min-w-0 lg:order-1"
                >
                  {proyectos.map((p, i) => {
                    const esActivo = i === activo
                    return (
                      <motion.button
                        key={p.nombre}
                        type="button"
                        variants={subir}
                        aria-pressed={esActivo}
                        onClick={() => irA(i)}
                        className="group block min-h-[44px] w-full py-3 text-left"
                      >
                        <span className="grid grid-cols-[2.4rem_1fr] items-baseline">
                          <span className="font-mono text-[0.75rem] tracking-[0.16em] text-accent">0{i + 1}</span>
                          <span
                            className={`font-display text-[clamp(24px,2.7vw,40px)] font-extrabold uppercase leading-[0.95] tracking-tight transition-colors ${esActivo ? 'text-white' : 'text-white/30 group-hover:text-white/70'}`}
                          >
                            {p.nombre}
                          </span>
                          <span />
                          <span className={`mt-2 font-mono text-[0.72rem] uppercase leading-snug tracking-[0.14em] text-muted ${esActivo ? 'block' : 'hidden'}`}>
                            {p.giro} · {p.funcion}
                          </span>
                        </span>
                        <span className="relative mt-3 block h-px bg-white/15">
                          {escritorio ? (
                            <Relleno progreso={scrollYProgress} i={i} />
                          ) : (
                            esActivo && (
                              <motion.span
                                key={`${activo}-${pausado}`}
                                initial={{ scaleX: pausado || reducido ? 1 : 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: pausado || reducido ? 0 : DURACION / 1000, ease: 'linear' }}
                                style={{ originX: 0 }}
                                className="absolute inset-x-0 -top-px h-[2px] bg-accent"
                              />
                            )
                          )}
                        </span>
                      </motion.button>
                    )
                  })}
                  <p className="mt-6 hidden font-mono text-[0.72rem] uppercase tracking-[0.16em] text-dim lg:block">
                    Sigue bajando ↓ 0{activo + 1}/0{N}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={visible}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  onMouseMove={mover}
                  onMouseLeave={soltar}
                  className="relative order-1 min-w-0 pb-8 lg:order-2"
                >
                  <div className="pointer-events-none absolute inset-6 rounded-3xl bg-accent/25 blur-3xl" aria-hidden="true" />
                  <motion.div style={{ rotateX, rotateY, transformPerspective: 1400 }} className="relative">
                    <div style={{ clipPath: CHAFLAN }} className="bg-white/25 p-px">
                      <div style={{ clipPath: CHAFLAN }} className="bg-surface">
                        <div className="flex items-center gap-2 border-b border-white/10 bg-[#1a1d21] px-4 py-3">
                          <span className="h-2.5 w-2.5 rounded-full bg-white/20" aria-hidden="true" />
                          <span className="h-2.5 w-2.5 rounded-full bg-white/20" aria-hidden="true" />
                          <span className="h-2.5 w-2.5 rounded-full bg-white/20" aria-hidden="true" />
                          <span className="ml-3 truncate rounded-md bg-base px-3 py-1 font-mono text-[0.72rem] text-dim">
                            {actual.dominio}
                          </span>
                          <div className="ml-auto shrink-0 pr-8">
                            <Boton
                              href={actual.href}
                              externo
                              tamano="mini"
                              ariaLabel={`Ver el sitio de ${actual.nombre} en vivo (se abre en una pestaña nueva)`}
                            >
                              Ver sitio en vivo
                            </Boton>
                          </div>
                        </div>
                        <div className="relative aspect-[16/10] bg-black">
                          {proyectos.map((p, i) =>
                            montar(i) ? (
                              <Image
                                key={p.nombre}
                                src={p.img}
                                alt={p.alt}
                                width={1200}
                                height={750}
                                loading="lazy"
                                sizes="(min-width: 1024px) 60vw, 100vw"
                                className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ${i === activo ? 'opacity-100' : 'opacity-0'}`}
                              />
                            ) : null,
                          )}
                          <a href={actual.href} target="_blank" rel="noopener" tabIndex={-1} aria-hidden="true" className="absolute inset-0" />
                        </div>
                      </div>
                    </div>

                    <motion.div
                      style={{ x: movilX }}
                      className="absolute -bottom-6 -right-2 w-[22%] min-w-[92px] max-w-[200px] rounded-[1.7rem] border-[5px] border-[#2b2e34] bg-black shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85)] lg:-right-10"
                    >
                      <div className="relative aspect-[9/19] overflow-hidden rounded-[1.25rem]">
                        {proyectos.map((p, i) =>
                          montar(i) ? (
                            <Image
                              key={p.nombre}
                              src={p.movil}
                              alt=""
                              width={390}
                              height={820}
                              loading="lazy"
                              sizes="(min-width: 1024px) 200px, 22vw"
                              className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ${i === activo ? 'opacity-100' : 'opacity-0'}`}
                            />
                          ) : null,
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={visible}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mt-16 border-t border-white/15 pt-10 lg:mt-20 lg:pt-14"
          >
            <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className={`${serif.className} text-balance text-[clamp(32px,4.6vw,68px)] italic leading-[1.02] text-white`}>
                  ¿Quieres una así para tu negocio?
                </p>
                <p className="mt-5 font-mono text-[0.75rem] uppercase tracking-[0.16em] text-muted">
                  <span className="text-accent" aria-hidden="true">▲</span> 5 días hábiles{' '}
                  <span className="text-accent" aria-hidden="true">▲</span> Desde $8,700 MXN IVA incluido{' '}
                  <span className="text-accent" aria-hidden="true">▲</span> Dominio 1er año incluido
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
                <Boton href="#cotiza">Solicitar diagnóstico gratuito</Boton>
                <Boton href={WHATSAPP} externo variante="cristal" flecha={false}>
                  Hablar por WhatsApp
                </Boton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  )
}
