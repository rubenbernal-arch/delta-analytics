'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { SpotlightCard } from '@/components/ui/spotlight'

export function Security() {
  const { t } = useI18n()
  const s = t.security

  return (
    <section id="seguridad" className="border-b border-[var(--line)]">
      <div className="section-inner">
        <div className="max-w-[620px] mb-12">
          <p className="eyebrow">{s.eyebrow}</p>
          <h2
            className="font-display font-semibold leading-[1.12] tracking-tight mb-4"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', letterSpacing: '-0.015em' }}
          >
            {s.title}<br />{s.title2}
          </h2>
          <p className="text-muted text-[1.05rem] leading-relaxed">{s.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {[s.offensive, s.defensive].map((card) => (
            <motion.div
              key={card.tag}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
            >
              <SpotlightCard color="rgba(255,128,0,0.06)" className="rounded-2xl h-full">
                <div className="h-full flex flex-col gap-4 bg-surface border border-[var(--line-strong)] rounded-2xl p-8">
                  <span className="font-mono text-[0.7rem] tracking-widest uppercase text-accent">{card.tag}</span>
                  <h3 className="font-display font-bold text-foreground" style={{ fontSize: '1.3rem', letterSpacing: '-0.01em' }}>
                    {card.title}
                  </h3>
                  <p className="text-muted text-[0.93rem] leading-relaxed">{card.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[0.68rem] tracking-wide px-2.5 py-1 rounded-full border border-[var(--line-strong)] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-[var(--line)] mb-8"
          style={{ background: 'var(--line)' }}
        >
          {s.credibility.map(({ label, body }) => (
            <div key={label} className="bg-surface p-8">
              <p className="eyebrow">{label}</p>
              <p className="text-foreground text-[0.98rem] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <p className="text-muted text-[0.93rem] leading-relaxed max-w-[640px] mb-14">
          {s.deliverables}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
          {s.process.map((step) => (
            <div key={step.num} className="flex flex-col gap-2 border-t-2 border-accent pt-4">
              <span className="font-mono text-[0.75rem] text-accent">{step.num}</span>
              <h4 className="font-display font-semibold text-foreground" style={{ fontSize: '1rem' }}>
                {step.title}
              </h4>
              <p className="text-muted text-[0.88rem] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <a
          href="#contacto"
          className="inline-flex items-center gap-2 font-semibold text-[0.95rem] px-7 py-[0.9rem] rounded-full bg-accent text-[#14161A] hover:shadow-[0_8px_30px_-6px_rgba(255,128,0,0.4)] hover:-translate-y-0.5 transition-all duration-200"
        >
          {s.cta}
        </a>
      </div>
    </section>
  )
}
