'use client'

import { useI18n } from '@/lib/i18n'

const ICONS = [
  // Automatización — gear
  <svg key="gear" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FF8000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.13.36.35.68.63.94.28.26.62.44 1 .5.11.02.23.03.35.03H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>,
  // Software a medida — layers
  <svg key="layers" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FF8000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 2 7l10 5 10-5-10-5Z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>,
  // Analítica e IA — bar chart
  <svg key="bars" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FF8000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 20V10M12 20V4M6 20v-6" />
  </svg>,
]

export function Features() {
  const { t } = useI18n()
  return (
    <section id="soluciones" className="border-b border-[var(--line)]">
      <div className="section-inner grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-14 items-start">
        <div>
          <p className="eyebrow">{t.features.eyebrow}</p>
          <h2
            className="font-display font-semibold leading-[1.12] tracking-tight"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', letterSpacing: '-0.015em' }}
          >
            {t.features.title}<br />{t.features.title2}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {t.features.items.map((f, i) => (
            <div key={f.title} className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl border border-[var(--line-strong)] flex items-center justify-center">
                {ICONS[i]}
              </div>
              <h3 className="font-display font-semibold text-foreground" style={{ fontSize: '1.05rem' }}>
                {f.title}
              </h3>
              <p className="text-muted text-[0.9rem] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
