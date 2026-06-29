'use client'

import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'

const inputClass = `
  w-full bg-[#0F1429] border border-[var(--line-strong)] rounded-xl
  px-4 py-[0.85rem] text-foreground text-[0.95rem] placeholder:text-dim
  focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(91,141,255,0.12)]
  transition-all duration-200
`

export function Contact() {
  const { t } = useI18n()
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus('done')
        form.reset()
      } else {
        throw new Error()
      }
    } catch {
      const subject = encodeURIComponent(`Proyecto de ${data.name || 'cliente'}`)
      const body = encodeURIComponent(`Nombre: ${data.name}\nCorreo: ${data.email}\nEmpresa: ${data.company || '-'}\n\n${data.message}`)
      window.open(`mailto:contacto@deltaanalytics.io?subject=${subject}&body=${body}`)
      setStatus('done')
      form.reset()
    }
  }

  return (
    <section id="contacto" className="relative border-t border-[var(--line)] overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(91,141,255,0.10), transparent 65%)' }}
        aria-hidden
      />
      <div className="section-inner relative z-10">
        <p className="eyebrow">{t.contact.eyebrow}</p>
        <h2
          className="font-display font-semibold leading-[1.12] tracking-tight mb-4"
          style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', maxWidth: 700, letterSpacing: '-0.015em' }}
        >
          {t.contact.title}
        </h2>
        <p className="text-muted max-w-[480px] mb-14 text-[1.05rem] leading-relaxed">
          {t.contact.subtitle}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16">
          <motion.form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-[0.80rem] text-muted font-mono tracking-wide">
                  {t.contact.name} <span className="text-warm">*</span>
                </label>
                <input id="name" name="name" type="text" required {...{placeholder: t.contact.namePlaceholder}} autoComplete="name" className={inputClass} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[0.80rem] text-muted font-mono tracking-wide">
                  {t.contact.email} <span className="text-warm">*</span>
                </label>
                <input id="email" name="email" type="email" required {...{placeholder: t.contact.emailPlaceholder}} autoComplete="email" className={inputClass} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="company" className="text-[0.80rem] text-muted font-mono tracking-wide">
                {t.contact.company} <span className="text-dim">{t.contact.companyOptional}</span>
              </label>
              <input id="company" name="company" type="text" {...{placeholder: t.contact.companyPlaceholder}} autoComplete="organization" className={inputClass} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-[0.80rem] text-muted font-mono tracking-wide">
                {t.contact.message} <span className="text-warm">*</span>
              </label>
              <textarea id="message" name="message" required rows={5} {...{placeholder: t.contact.messagePlaceholder}} className={`${inputClass} resize-none min-h-[130px]`} />
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || status === 'done'}
              className="mt-1 w-full inline-flex items-center justify-center gap-2 font-semibold text-[0.95rem] px-7 py-[0.9rem] rounded-full text-white bg-gradient-to-br from-accent to-[#4373E8] hover:shadow-[0_8px_30px_-6px_rgba(91,141,255,0.6)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
            >
              {status === 'loading' && (<>{t.contact.sending} <span className="inline-block w-[14px] h-[14px] border-2 border-white/40 border-t-white rounded-full animate-spin" /></>)}
              {status === 'done' && t.contact.sent}
              {status === 'idle' && t.contact.send}
            </button>

            {status === 'done' && (
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-[0.85rem] text-accent-2" role="status">
                {t.contact.thanks}
              </motion.p>
            )}
          </motion.form>

          <motion.div
            className="flex flex-col gap-10 pt-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[0.70rem] tracking-widest text-dim uppercase">{t.contact.email}</span>
              <a href="mailto:contacto@deltaanalytics.io" className="text-[1rem] hover:text-accent-2 transition-colors">
                contacto@deltaanalytics.io
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[0.70rem] tracking-widest text-dim uppercase">{t.contact.locationLabel}</span>
              <span className="text-[1rem] text-muted">{t.contact.location}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[0.70rem] tracking-widest text-dim uppercase">Síguenos</span>
              <div className="flex gap-5">
                <a href="https://instagram.com/deltaanalytics" target="_blank" rel="noopener" className="text-[1rem] hover:text-accent-2 transition-colors">Instagram</a>
                <a href="https://linkedin.com/company/deltaanalytics" target="_blank" rel="noopener" className="text-[1rem] hover:text-accent-2 transition-colors">LinkedIn</a>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[0.70rem] tracking-widest text-dim uppercase">Productos</span>
              <a href="https://tradeiqpro.com" target="_blank" rel="noopener" className="text-[0.95rem] hover:text-accent-2 transition-colors">TradeIQ Pro ↗</a>
              <a href="https://odontobot-demo.vercel.app" target="_blank" rel="noopener" className="text-[0.95rem] hover:text-accent-2 transition-colors">OdontoBot demo ↗</a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
