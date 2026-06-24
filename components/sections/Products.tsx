import { SpotlightCard } from '@/components/ui/spotlight'

const products = [
  {
    id:      'trade',
    tag:     'FINTECH · IA',
    name:    'TradeIQ Pro',
    desc:    'Plataforma de análisis de trading potenciada por IA. Lectura de mercado en tiempo real, indicadores técnicos e inteligencia de señales para tomar decisiones más rápido.',
    link:    'https://tradeiqpro.com',
    linkLabel: 'tradeiqpro.com',
    accent:  'rgba(91,141,255,0.18)',
  },
  {
    id:      'odonto',
    tag:     'SALUD · GESTIÓN',
    name:    'OdontoBot',
    desc:    'Asistente inteligente para clínicas dentales: organiza pacientes, agenda y procesos administrativos para que el consultorio funcione sin fricción.',
    link:    null,
    linkLabel: null,
    accent:  'rgba(124,245,212,0.16)',
  },
]

export function Products() {
  return (
    <section id="productos" className="border-t border-[var(--line)]">
      <div className="section-inner">
        <p className="eyebrow">Lo que construimos</p>
        <h2
          className="font-display font-semibold leading-[1.15] tracking-tight mb-10"
          style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', maxWidth: 800, letterSpacing: '-0.01em' }}
        >
          Dos productos. Un mismo enfoque.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((p) => {
            const Wrapper = p.link ? 'a' : 'div'
            const wrapperProps = p.link
              ? { href: p.link, target: '_blank', rel: 'noopener noreferrer' }
              : {}

            return (
              <SpotlightCard
                key={p.id}
                color={p.accent.replace(')', ', 0.25)').replace('rgba(', 'rgba(')}
                className="rounded-2xl"
              >
                {/* @ts-expect-error dynamic element */}
                <Wrapper
                  {...wrapperProps}
                  className="
                    relative flex flex-col bg-surface border border-[var(--line-strong)] rounded-2xl p-9
                    overflow-hidden cursor-pointer
                    hover:-translate-y-1 hover:border-accent
                    transition-all duration-200
                  "
                >
                  {/* Radial accent blob */}
                  <div
                    className="absolute top-[-40%] right-[-30%] w-[60%] h-[80%] pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${p.accent}, transparent 70%)`,
                    }}
                  />

                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <span className="font-mono text-[0.72rem] tracking-widest text-muted">{p.tag}</span>
                    {p.link && <span className="text-accent-2 text-[1.1rem]">↗</span>}
                  </div>

                  <h3 className="font-display text-[1.6rem] font-semibold mb-3 relative z-10">
                    {p.name}
                  </h3>
                  <p className="text-muted text-[0.95rem] flex-1 relative z-10">{p.desc}</p>

                  {p.linkLabel && (
                    <span className="mt-6 font-mono text-[0.85rem] text-accent-2 relative z-10">
                      {p.linkLabel}
                    </span>
                  )}
                </Wrapper>
              </SpotlightCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
