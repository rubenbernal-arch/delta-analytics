'use client'

import { useI18n } from '@/lib/i18n'

export function About() {
  const { t } = useI18n()
  return (
    <section
      id="quienes"
      className="border-t border-[var(--line)]"
      style={{ background: 'linear-gradient(180deg, #070A14, #0F1429 140%)' }}
    >
      <div className="section-inner">
        <p className="eyebrow">{t.about.eyebrow}</p>
        <h2
          className="font-display font-semibold leading-[1.15] tracking-tight mb-10"
          style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', maxWidth: 800, letterSpacing: '-0.01em' }}
        >
          {t.about.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-12 items-start">
          <p className="text-muted text-[1.15rem] max-w-[540px]">
            {t.about.body}
          </p>

          <div className="flex flex-col gap-[1.6rem]">
            {[
              ...t.about.stats,
            ].map(({ num, label }) => (
              <div key={label} className="flex flex-col border-l-2 border-accent pl-5">
                <span className="font-mono text-[1.8rem] font-medium text-accent-2">{num}</span>
                <span className="text-muted text-[0.85rem]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
