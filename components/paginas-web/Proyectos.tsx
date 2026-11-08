'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion, MotionConfig, type Variants } from 'framer-motion'
import { ArrowUpRight, Clock, Globe, Layers, ShieldCheck, Tag, TrendingUp } from 'lucide-react'
import { Boton } from './Boton'

const proyectos = [
  {
    nombre: 'La Puerta de Michoacán',
    giro: 'Restaurante boutique',
    dominio: 'lapuertademichoacan.com',
    href: 'https://lapuertademichoacan.com',
    img: '/paginas-web/casos/lapuerta.webp',
    alt: 'Página web de La Puerta de Michoacán hecha por Delta Analytics',
  },
  {
    nombre: 'TLA Adventures',
    giro: 'Renta de cuatrimotos',
    dominio: 'tlaadventures.com',
    href: 'https://tlaadventures.com',
    img: '/paginas-web/casos/tla.webp',
    alt: 'Página web de TLA Adventures hecha por Delta Analytics',
  },
  {
    nombre: 'La Herencia Tours',
    giro: 'Tours off road',
    dominio: 'laherenciatours.com',
    href: 'https://www.laherenciatours.com/',
    img: '/paginas-web/casos/herencia.webp',
    alt: 'Página web de La Herencia Tours hecha por Delta Analytics',
  },
]

const beneficios = [
  { titulo: 'Más clientes', texto: 'Convierte visitas en oportunidades.', Icono: TrendingUp },
  { titulo: 'Más credibilidad', texto: 'Proyecta una imagen profesional y confiable.', Icono: ShieldCheck },
  { titulo: 'A la medida', texto: 'Diseñada para los objetivos de tu negocio.', Icono: Layers },
]

const datos = [
  { valor: '5 días hábiles', texto: 'de entrega', Icono: Clock },
  { valor: 'Desde $8,700 MXN', texto: 'IVA incluido', Icono: Tag },
  { valor: 'Dominio 1er año', texto: 'incluido', Icono: Globe },
]

const lista: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const subir: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const visible = { once: true, amount: 0.25 } as const

export function Proyectos() {
  const [activo, setActivo] = useState(2)
  const actual = proyectos[activo]

  return (
    <MotionConfig reducedMotion="user">
      <section id="proyectos" className="relative overflow-hidden border-t border-[var(--line)] bg-base">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_45%,rgba(255,128,0,0.16),transparent_55%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-14 pt-16 lg:px-[72px] lg:pb-16 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-12">
            {/* Izquierda */}
            <motion.div variants={lista} initial="hidden" whileInView="visible" viewport={visible}>
              <motion.div variants={subir} className="mb-5 flex items-center gap-3">
                <span className="h-[4px] w-[50px] bg-accent" aria-hidden="true" />
                <span className="font-mono text-[0.8rem] font-medium uppercase tracking-[0.18em] text-white">
                  Proyectos reales
                </span>
              </motion.div>

              <motion.h2
                variants={subir}
                className="mb-5 font-display text-[32px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[42px] lg:text-[48px]"
              >
                Páginas reales <br className="hidden lg:block" />
                de <span className="text-accent">negocios reales.</span>
              </motion.h2>

              <motion.p variants={subir} className="mb-8 max-w-[470px] text-[1.15rem] leading-[1.5] text-muted">
                Creamos páginas web a la medida que no solo se ven bien, sino que generan clientes, confianza y crecimiento.
              </motion.p>

              <motion.ul variants={lista} className="mb-9 flex flex-col gap-4">
                {beneficios.map(({ titulo, texto, Icono }) => (
                  <motion.li key={titulo} variants={subir} className="flex items-center gap-4">
                    <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-surface">
                      <Icono size={24} className="text-accent" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-display text-[1.05rem] font-semibold text-white">{titulo}</p>
                      <p className="text-[0.95rem] leading-snug text-muted">{texto}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div variants={subir}>
                <Boton href="#cotiza">Cotizar mi página</Boton>
              </motion.div>
            </motion.div>

            {/* Derecha: ventana + selector */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={visible}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="overflow-hidden rounded-xl border border-white/10 bg-surface shadow-[0_40px_90px_-30px_rgba(255,128,0,0.35)]"
              >
                <div className="flex items-center gap-2 border-b border-white/10 bg-[#1a1d21] px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" aria-hidden="true" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" aria-hidden="true" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" aria-hidden="true" />
                  <span className="ml-3 truncate rounded-md bg-base px-3 py-1 font-mono text-[0.72rem] text-dim">
                    {actual.dominio}
                  </span>
                </div>
                <a
                  href={actual.href}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Ver el sitio de ${actual.nombre} en vivo (se abre en una pestaña nueva)`}
                  className="group relative block aspect-[16/10] bg-black"
                >
                  {proyectos.map((p, i) => (
                    <Image
                      key={p.nombre}
                      src={p.img}
                      alt={p.alt}
                      width={1200}
                      height={750}
                      loading="lazy"
                      unoptimized
                      className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${i === activo ? 'opacity-100' : 'opacity-0'}`}
                    />
                  ))}
                  <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-[0.9rem] font-semibold text-[#14161A] shadow-lg transition-transform group-hover:-translate-y-0.5">
                    Ver sitio en vivo <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </a>
              </motion.div>

              <motion.div
                variants={lista}
                initial="hidden"
                whileInView="visible"
                viewport={visible}
                className="mt-4 grid gap-3 md:grid-cols-3"
              >
                {proyectos.map((p, i) => {
                  const esActivo = i === activo
                  return (
                    <motion.a
                      key={p.nombre}
                      variants={subir}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.99 }}
                      href={p.href}
                      target="_blank"
                      rel="noopener"
                      aria-label={`Ver el sitio de ${p.nombre} en vivo (se abre en una pestaña nueva)`}
                      onMouseEnter={() => setActivo(i)}
                      onFocus={() => setActivo(i)}
                      className={`group flex min-h-[84px] items-center justify-between gap-3 rounded-2xl border bg-surface p-4 transition-colors ${esActivo ? 'border-accent' : 'border-white/10 hover:border-white/30'}`}
                    >
                      <span className="min-w-0">
                        <span className="block font-display text-[1rem] font-bold leading-tight text-white">{p.nombre}</span>
                        <span className="mt-0.5 block text-[0.88rem] text-muted">{p.giro}</span>
                      </span>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${esActivo ? 'border-accent bg-accent text-[#14161A]' : 'border-white/25 text-white group-hover:border-accent group-hover:text-accent'}`}
                        aria-hidden="true"
                      >
                        <ArrowUpRight size={16} />
                      </span>
                    </motion.a>
                  )
                })}
              </motion.div>
            </div>
          </div>

          {/* Datos */}
          <motion.dl
            variants={lista}
            initial="hidden"
            whileInView="visible"
            viewport={visible}
            className="mt-14 grid gap-6 rounded-2xl border border-white/10 bg-surface px-6 py-6 sm:grid-cols-3 lg:mt-16 lg:px-10"
          >
            {datos.map(({ valor, texto, Icono }, i) => (
              <motion.div
                key={valor}
                variants={subir}
                className={`flex items-center gap-4 ${i > 0 ? 'sm:border-l sm:border-white/10 sm:pl-6' : ''}`}
              >
                <Icono size={32} className="shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <dt className="font-display text-[1.4rem] font-bold leading-none text-white">{valor}</dt>
                  <dd className="mt-1 text-[0.9rem] text-muted">{texto}</dd>
                </div>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </section>
    </MotionConfig>
  )
}
