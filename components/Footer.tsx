'use client'

import { useI18n } from '@/lib/i18n'

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="max-w-[1140px] mx-auto px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-2 font-display font-semibold text-[1.05rem]">
            <span className="text-accent text-[1.3rem]">Δ</span>
            <span>Delta Analytics</span>
          </span>
          <span className="text-dim">|</span>
          <span className="text-muted text-[0.9rem]">{t.contact.location}</span>
        </div>

        <div className="flex items-center gap-8 flex-wrap">
          <nav className="flex items-center gap-6 text-[0.88rem] text-muted">
            <a href="#soluciones" className="hover:text-foreground transition-colors">{t.nav.solutions}</a>
            <a href="#productos" className="hover:text-foreground transition-colors">{t.nav.products}</a>
            <a href="#quienes" className="hover:text-foreground transition-colors">{t.nav.about}</a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/company/delta-analytics-mx" target="_blank" rel="noopener" className="text-muted hover:text-foreground transition-colors text-[0.88rem]">LinkedIn</a>
            <a href="https://www.instagram.com/deltaanalytics.mx/" target="_blank" rel="noopener" className="text-muted hover:text-foreground transition-colors text-[0.88rem]">Instagram</a>
          </div>
        </div>
      </div>
      <div className="max-w-[1140px] mx-auto px-8 pb-8 text-[0.8rem] text-dim font-mono">
        Δ Delta Analytics — 2026 · {t.footer.tagline}
      </div>
    </footer>
  )
}
