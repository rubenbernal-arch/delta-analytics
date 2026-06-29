'use client'

import { useI18n } from '@/lib/i18n'

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="max-w-[1140px] mx-auto px-8 py-8 flex justify-between items-center flex-wrap gap-3 text-[0.8rem] text-dim font-mono">
        <span>Δ Delta Analytics — 2026</span>
        <span>{t.footer.tagline}</span>
      </div>
    </footer>
  )
}
