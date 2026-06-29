'use client'

import { motion } from 'framer-motion'
import { SpotlightCard } from '@/components/ui/spotlight'

const products = [
  {
    id: 'tradeiq',
    tag: 'FINTECH · IA',
    name: 'TradeIQ Pro',
    desc: 'Plataforma de análisis de trading potenciada por IA. Señales estructuradas con entry, stop-loss y take-profit, scoring de confianza en múltiples temporalidades y chat con IA para validar setups en tiempo real.',
    link: 'https://tradeiqpro.com',
    linkLabel: 'tradeiqpro.com',
    accent: 'rgba(91,141,255,0.20)',
    accentColor: '#5B8DFF',
    tags: ['Forex', 'Crypto', 'Acciones', 'Futuros'],
  },
  {
    id: 'odonto',
    tag: 'SALUD · GESTIÓN',
    name: 'OdontoBot',
    desc: 'Automatización completa para clínicas dentales: agente de voz para citas, WhatsApp inteligente para seguimiento de pacientes y CRM sencillo para que el consultorio funcione sin fricción.',
    link: 'https://odontobot-demo.vercel.app',
    linkLabel: 'Ver demo →',
    accent: 'rgba(124,245,212,0.18)',
    accentColor: '#7CF5D4',
    tags: ['Clínicas dentales', 'WhatsApp', 'Voz IA', 'CRM'],
  },
  {
    id: 'atum',
    tag: 'OPERACIONES · IA',
    name: 'ATUM',
    desc: 'Sistema operativo de inteligencia para empresas. Dashboards de analítica, inteligencia de mercado, Google Analytics integrado y automatización de decisiones operativas en tiempo real.',
    link: null,
    linkLabel: null,
    accent: 'rgba(255,107,91,0.16)',
    accentColor: '#FF6B5B',
    tags: ['Analytics', 'Market Intel', 'Dashboards', 'Automatización'],
  },
  {
    id: 'sales',
    tag: 'VENTAS · OUTBOUND',
    name: 'Delta Sales Agent',
    desc: 'Pipeline de ventas autónomo. Scraping de leads, agente de voz outbound, seguimiento por WhatsApp y CRM integrado — todo conectado para cerrar clientes sin intervención manual.',
    link: null,
    linkLabel: null,
    accent: 'rgba(91,141,255,0.12)',
    accentColor: '#5B8DFF',
    tags: ['Lead gen', 'Voz IA', 'WhatsApp', 'CRM'],
  },
]

export function Products() {
  return (
    <section id="productos" className="border-t border-[var(--line)]">
      <div className="section-inner">
        <p className="eyebrow">Lo que construimos</p>
        <h2
          className="font-display font-semibold leading-[1.12] tracking-tight mb-4"
          style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', maxWidth: 700, letterSpacing: '-0.015em' }}
        >
          Cuatro productos.<br />Un mismo enfoque.
        </h2>
        <p className="text-muted text-[1.05rem] mb-12 max-w-[500px]">
          Cada uno resuelve un problema real. Ninguno es una maqueta.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {products.map((p, i) => {
            const Wrapper = p.link ? 'a' : 'div'
            const wrapperProps = p.link
              ? { href: p.link, target: '_blank', rel: 'noopener noreferrer' }
              : {}

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <SpotlightCard color={p.accent} className="rounded-2xl h-full">
                  {/* @ts-expect-error dynamic tag */}
                  <Wrapper
                    {...wrapperProps}
                    className="relative flex flex-col h-full bg-surface border border-[var(--line-strong)] rounded-2xl p-8 overflow-hidden hover:-translate-y-1 transition-all duration-200"
                  >
                    <div
                      className="absolute top-0 right-0 w-[55%] h-[65%] pointer-events-none"
                      style={{ background: `radial-gradient(ellipse at top right, ${p.accent}, transparent 65%)` }}
                    />

                    <div className="flex justify-between items-center mb-5 relative z-10">
                      <span className="font-mono text-[0.70rem] tracking-widest text-muted">{p.tag}</span>
                      {p.link && <span style={{ color: p.accentColor }} className="text-[1rem]">↗</span>}
                    </div>

                    <h3
                      className="font-display font-bold mb-3 relative z-10 leading-tight"
                      style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)', letterSpacing: '-0.02em' }}
                    >
                      {p.name}
                    </h3>

                    <p className="text-muted text-[0.93rem] leading-relaxed flex-1 relative z-10">
                      {p.desc}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-5 relative z-10">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[0.68rem] tracking-wide px-2.5 py-1 rounded-full border"
                          style={{ color: p.accentColor, borderColor: `${p.accentColor}30`, background: `${p.accentColor}08` }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {p.linkLabel && (
                      <span className="mt-5 font-mono text-[0.82rem] relative z-10" style={{ color: p.accentColor }}>
                        {p.linkLabel}
                      </span>
                    )}
                    {!p.link && (
                      <span className="mt-5 font-mono text-[0.72rem] text-dim relative z-10">
                        Disponible para clientes
                      </span>
                    )}
                  </Wrapper>
                </SpotlightCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
