'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { DeltaChip } from '@/components/ui/delta-chip'

export function Hero() {
  const { t } = useI18n()
  const [line1, line2] = t.hero.title.split('\n')

  return (
    <section id="top" className="relative border-b border-[var(--line)] overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 85% 15%, rgba(255,128,0,0.16), transparent 65%)' }}
        aria-hidden
      />
      <div className="section-inner relative z-10 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-14 items-center pt-32 lg:pt-36">
        <div>
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {t.hero.eyebrow}
          </motion.p>
          <motion.h1
            className="font-display font-bold leading-[1.08] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="text-foreground">{line1}</span>
            <br />
            <span className="text-accent">{line2}</span>
          </motion.h1>
          <motion.p
            className="text-muted text-[1.1rem] max-w-[440px] mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22 }}
          >
            {t.hero.subtitle}
          </motion.p>
          <motion.div
            className="flex items-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.36 }}
          >
            <a href="#contacto" className="inline-flex items-center gap-2 font-semibold text-[0.95rem] px-7 py-[0.85rem] rounded-full text-white bg-gradient-to-br from-accent to-[#C25A00] hover:shadow-[0_8px_30px_-6px_rgba(255,128,0,0.5)] hover:-translate-y-0.5 transition-all duration-200">
              {t.hero.cta} →
            </a>
            <a href="#productos" className="inline-flex items-center gap-2 font-semibold text-[0.95rem] px-7 py-[0.85rem] rounded-full text-foreground border border-[var(--line-strong)] hover:border-accent-2 transition-all duration-200">
              {t.hero.cta2}
            </a>
          </motion.div>
        </div>

        <motion.div
          className="aspect-[3/4.4]"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
        >
          <DeltaChip />
        </motion.div>
      </div>
    </section>
  )
}
