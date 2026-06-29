'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'

export function Nav() {
  const { t, locale, setLocale } = useI18n()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const scrollTo = (id: string) => {
    setOpen(false)
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const links = [
    { href: '#quienes', label: t.nav.about },
    { href: '#mision', label: t.nav.mission },
    { href: '#productos', label: t.nav.products },
  ]

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-[100]
          transition-all duration-300
          ${scrolled ? 'bg-[rgba(7,10,20,0.85)] backdrop-blur-xl border-b border-[var(--line)]' : 'bg-transparent'}
        `}
      >
        <div className="max-w-[1140px] mx-auto px-8 py-[1.1rem] flex items-center justify-between">
          <Link href="#top" className="flex items-center gap-2 font-display font-semibold text-[1.05rem]">
            <span className="text-accent text-[1.3rem]">Δ</span>
            <span>Delta Analytics</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[0.92rem] text-muted" aria-label="Navegación principal">
            {links.map((l) => (
              <button key={l.href} onClick={() => scrollTo(l.href)}
                className="hover:text-foreground transition-colors cursor-pointer bg-transparent border-none">
                {l.label}
              </button>
            ))}
            <button onClick={() => scrollTo('#contacto')}
              className="text-foreground px-[1.1rem] py-[0.5rem] border border-[var(--line-strong)] rounded-full hover:border-accent hover:bg-accent/10 transition-all duration-200 cursor-pointer bg-transparent">
              {t.nav.contact}
            </button>
            <button
              onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
              className="font-mono text-[0.78rem] tracking-widest uppercase px-3 py-[0.4rem] rounded-full border border-[var(--line-strong)] text-muted hover:text-accent-2 hover:border-accent-2 transition-all duration-200 cursor-pointer bg-transparent"
            >
              {locale === 'es' ? 'EN' : 'ES'}
            </button>
          </nav>

          <button
            className="md:hidden flex flex-col justify-center gap-[5px] w-10 h-10 p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span className={`block h-[2px] bg-foreground rounded transition-transform duration-200 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block h-[2px] bg-foreground rounded transition-all duration-200 ${open ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-[2px] bg-foreground rounded transition-transform duration-200 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </header>

      <div
        role="dialog"
        aria-label="Menú de navegación"
        className={`md:hidden fixed inset-0 z-[99] bg-[rgba(7,10,20,0.97)] backdrop-blur-2xl flex flex-col items-center justify-center gap-8 transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {links.map((l) => (
          <button key={l.href} onClick={() => scrollTo(l.href)}
            className="font-display text-[1.6rem] font-semibold text-muted hover:text-foreground transition-colors bg-transparent border-none cursor-pointer">
            {l.label}
          </button>
        ))}
        <button onClick={() => scrollTo('#contacto')}
          className="font-display text-[1rem] font-semibold text-foreground px-6 py-3 border border-[var(--line-strong)] rounded-full mt-2 hover:border-accent transition-all bg-transparent cursor-pointer">
          {t.nav.contact}
        </button>
        <button
          onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
          className="font-mono text-[0.85rem] tracking-widest uppercase px-4 py-2 rounded-full border border-[var(--line-strong)] text-muted hover:text-accent-2 transition-all bg-transparent cursor-pointer"
        >
          {locale === 'es' ? 'EN' : 'ES'}
        </button>
      </div>
    </>
  )
}
