'use client'

import { useI18n } from '@/lib/i18n'

export function CtaBand() {
  const { t } = useI18n()
  return (
    <section
      className="border-b border-[var(--line)]"
      style={{ background: 'linear-gradient(120deg, #FF8000, #C25A00)' }}
    >
      <div className="max-w-[1140px] mx-auto px-8 py-16 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div>
          <h2
            className="font-display font-bold leading-tight tracking-tight mb-2"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', color: '#14161A', letterSpacing: '-0.015em' }}
          >
            {t.ctaBand.title}
          </h2>
          <p className="max-w-[480px]" style={{ color: '#14161Acc' }}>
            {t.ctaBand.subtitle}
          </p>
        </div>
        <a
          href="#contacto"
          className="inline-flex items-center justify-center gap-2 font-semibold text-[0.95rem] px-7 py-[0.9rem] rounded-full text-white shrink-0 hover:-translate-y-0.5 transition-transform duration-200"
          style={{ background: '#14161A' }}
        >
          {t.ctaBand.button}
        </a>
      </div>
    </section>
  )
}
