'use client'

import { useState, type FormEvent } from 'react'

const inputClass = `
  w-full bg-surface border border-[var(--line-strong)] rounded-lg
  px-4 py-[0.85rem] text-foreground text-[0.95rem] placeholder:text-dim
  focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(91,141,255,0.15)]
  transition-all duration-200
`

export function Contact() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    setLoading(true)
    // Placeholder — wire to Formspree or a real backend when ready
    setTimeout(() => {
      setLoading(false)
      setStatus(`Gracias${name ? ', ' + name : ''}. Tu mensaje fue registrado — te responderemos pronto.`)
      form.reset()
    }, 1200)
  }

  return (
    <section id="contacto" className="relative border-t border-[var(--line)] overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(91,141,255,0.12), transparent 70%)' }}
        aria-hidden
      />

      <div className="section-inner relative z-10">
        <p className="eyebrow">Contacto</p>
        <h2
          className="font-display font-semibold leading-[1.15] tracking-tight mb-4"
          style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', maxWidth: 800, letterSpacing: '-0.01em' }}
        >
          ¿Tienes un problema que vale<br />la pena resolver con IA?
        </h2>
        <p className="text-muted max-w-[480px] mb-12 text-[1.05rem]">
          Cuéntanos qué necesitas. Respondemos personalmente, sin formularios automatizados de relleno.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-[0.82rem] text-muted">
                Nombre <span className="text-warm">*</span>
              </label>
              <input
                id="name" name="name" type="text" required
                placeholder="Tu nombre" autoComplete="name"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[0.82rem] text-muted">
                Correo <span className="text-warm">*</span>
              </label>
              <input
                id="email" name="email" type="email" required
                placeholder="tucorreo@ejemplo.com" autoComplete="email"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="company" className="text-[0.82rem] text-muted">Empresa (opcional)</label>
              <input
                id="company" name="company" type="text"
                placeholder="Nombre de tu empresa" autoComplete="organization"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-[0.82rem] text-muted">
                Mensaje <span className="text-warm">*</span>
              </label>
              <textarea
                id="message" name="message" required rows={5}
                placeholder="Cuéntanos sobre tu proyecto o necesidad..."
                className={`${inputClass} resize-vertical min-h-[120px]`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full inline-flex items-center justify-center gap-2
                font-semibold text-[0.95rem] px-7 py-[0.85rem] rounded-full
                text-white bg-gradient-to-br from-accent to-[#4373E8]
                hover:shadow-[0_8px_30px_-6px_rgba(91,141,255,0.6)]
                hover:-translate-y-0.5 transition-all duration-200
                disabled:opacity-70 disabled:pointer-events-none
              "
            >
              {loading ? (
                <>
                  Enviando
                  <span className="inline-block w-[14px] h-[14px] border-2 border-white/40 border-t-white rounded-full animate-spin" />
                </>
              ) : 'Enviar mensaje'}
            </button>

            {status && (
              <p className="font-mono text-[0.85rem] text-accent-2 min-h-[1.2em]" aria-live="polite" role="status">
                {status}
              </p>
            )}
          </form>

          {/* Contact info */}
          <div className="flex flex-col gap-8 pt-2">
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[0.75rem] tracking-widest text-dim uppercase">Correo</span>
              <a href="mailto:contacto@deltaanalytics.io" className="text-[1.05rem] hover:text-accent-2 transition-colors">
                contacto@deltaanalytics.io
              </a>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[0.75rem] tracking-widest text-dim uppercase">Síguenos</span>
              <div className="flex gap-5">
                <a href="#" target="_blank" rel="noopener" className="hover:text-accent-2 transition-colors">Instagram</a>
                <a href="#" target="_blank" rel="noopener" className="hover:text-accent-2 transition-colors">LinkedIn</a>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[0.75rem] tracking-widest text-dim uppercase">Productos</span>
              <a href="https://tradeiqpro.com" target="_blank" rel="noopener" className="text-[1.05rem] hover:text-accent-2 transition-colors">
                TradeIQ Pro ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
