'use client'

import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { motion, MotionConfig, type Variants } from 'framer-motion'
import { ChevronDown, FileText, MessageSquare, Search } from 'lucide-react'
import { estilos, brillo, tamanos } from './Boton'

const WHATSAPP = 'https://wa.me/523330163038?text=Hola%2C%20quiero%20cotizar%20una%20p%C3%A1gina%20web%20para%20mi%20negocio'
const CLAVES_ATRIBUCION = ['gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
const ALMACEN = 'dw_atribucion'

const giros = [
  'Restaurante o cafetería',
  'Turismo y experiencias',
  'Salud o bienestar',
  'Comercio o tienda',
  'Servicios profesionales',
  'Manufactura o industria',
  'Otro',
]

const situaciones = [
  'Aún no tengo página',
  'Tengo una, pero no me trae clientes',
  'Quiero rehacer la que tengo',
]

const pasos = [
  { titulo: 'Nos cuentas de tu negocio', texto: 'Dos minutos, solo lo básico.', Icono: MessageSquare },
  { titulo: 'Te contactamos', texto: 'Por WhatsApp, para entender qué necesitas.', Icono: Search },
  { titulo: 'Recibes tu cotización', texto: 'Precio claro, desde $8,700 MXN IVA incluido.', Icono: FileText },
]

const subir: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}
const lista: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const visible = { once: true, amount: 0.2 } as const

const entrada =
  'h-12 w-full rounded-xl border border-white/15 bg-[#1a1d21] px-4 text-[1rem] text-white placeholder:text-dim outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30'

type Errores = Partial<Record<'nombre' | 'whatsapp' | 'giro' | 'correo' | 'consentimiento', string>>

function soloDiez(valor: string) {
  let d = valor.replace(/\D/g, '')
  if (d.length > 10) d = d.replace(/^(521|52)/, '')
  return d
}

function Campo({ id, etiqueta, error, opcional, children }: { id: string; etiqueta: string; error?: string; opcional?: boolean; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-[0.9rem] font-medium text-white">
        {etiqueta}
        {opcional && <span className="text-[0.78rem] font-normal text-dim">Opcional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[0.85rem] text-[#ff7a6b]">
          {error}
        </p>
      )}
    </div>
  )
}

export function Formulario() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [correo, setCorreo] = useState('')
  const [giro, setGiro] = useState('')
  const [situacion, setSituacion] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [consentimiento, setConsentimiento] = useState(false)
  const [trampa, setTrampa] = useState('')
  const [errores, setErrores] = useState<Errores>({})
  const [estado, setEstado] = useState<'reposo' | 'enviando' | 'error'>('reposo')

  // Guarda gclid y utm de la primera visita para no perderlos si el visitante navega.
  useEffect(() => {
    try {
      const url = new URLSearchParams(window.location.search)
      const guardado = JSON.parse(sessionStorage.getItem(ALMACEN) || '{}') as Record<string, string>
      let cambio = false
      for (const k of CLAVES_ATRIBUCION) {
        const v = url.get(k)
        if (v && !guardado[k]) {
          guardado[k] = v
          cambio = true
        }
      }
      if (cambio) sessionStorage.setItem(ALMACEN, JSON.stringify(guardado))
    } catch {
      // sin almacenamiento disponible: no pasa nada
    }
  }, [])

  function atribucion() {
    const datos: Record<string, string> = {}
    try {
      Object.assign(datos, JSON.parse(sessionStorage.getItem(ALMACEN) || '{}'))
      const url = new URLSearchParams(window.location.search)
      for (const k of CLAVES_ATRIBUCION) {
        const v = url.get(k)
        if (v) datos[k] = v
      }
    } catch {
      // ignorar
    }
    return datos
  }

  function validar(): Errores {
    const e: Errores = {}
    if (nombre.trim().length < 2) e.nombre = 'Escribe tu nombre.'
    if (soloDiez(whatsapp).length !== 10) e.whatsapp = 'Escribe tu WhatsApp a 10 dígitos.'
    if (!giro) e.giro = 'Elige el giro de tu negocio.'
    if (correo.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim())) e.correo = 'Revisa que el correo esté bien escrito.'
    if (!consentimiento) e.consentimiento = 'Necesitamos que aceptes el aviso de privacidad.'
    return e
  }

  async function enviar(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    if (trampa) {
      router.push('/paginas-web/gracias')
      return
    }
    const e = validar()
    setErrores(e)
    if (Object.keys(e).length) return

    setEstado('enviando')
    try {
      const r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          whatsapp: soloDiez(whatsapp),
          correo: correo.trim(),
          giro,
          situacion,
          mensaje: mensaje.trim(),
          consentimiento: true,
          pagina: window.location.pathname,
          ...atribucion(),
        }),
      })
      if (!r.ok) throw new Error('fallo')
      router.push('/paginas-web/gracias')
    } catch {
      setEstado('error')
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <section id="cotiza" className="relative overflow-hidden border-t border-[var(--line)] bg-base">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_40%,rgba(255,128,0,0.16),transparent_55%)]"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-16 lg:px-[72px] lg:py-24">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
            <motion.div variants={lista} initial="hidden" whileInView="visible" viewport={visible} className="lg:sticky lg:top-12">
              <motion.div variants={subir} className="mb-5 flex items-center gap-3">
                <span className="h-[4px] w-[50px] bg-accent" aria-hidden="true" />
                <span className="font-mono text-[0.8rem] font-medium uppercase tracking-[0.18em] text-white">
                  Diagnóstico gratuito
                </span>
              </motion.div>
              <motion.h2
                variants={subir}
                className="mb-5 text-balance font-display text-[32px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[42px] lg:text-[52px]"
              >
                Cuéntanos de tu negocio y te decimos <span className="text-accent">cómo lo haríamos.</span>
              </motion.h2>
              <motion.p variants={subir} className="mb-9 max-w-[520px] text-[1.15rem] leading-[1.5] text-muted">
                Te damos un diagnóstico gratuito y una cotización clara de tu página web.
              </motion.p>
              <motion.ol variants={lista} className="flex flex-col gap-5">
                {pasos.map(({ titulo, texto, Icono }, i) => (
                  <motion.li key={titulo} variants={subir} className="flex items-center gap-4">
                    <span className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-surface">
                      <Icono size={24} className="text-accent" aria-hidden="true" />
                      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent font-mono text-[0.72rem] font-bold text-[#14161A]">
                        {i + 1}
                      </span>
                    </span>
                    <div>
                      <p className="font-display text-[1.05rem] font-semibold text-white">{titulo}</p>
                      <p className="text-[0.95rem] leading-snug text-muted">{texto}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ol>
            </motion.div>

            <motion.form
              onSubmit={enviar}
              noValidate
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={visible}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="rounded-3xl border border-[rgba(255,160,60,0.35)] bg-surface p-6 shadow-[0_30px_80px_-40px_rgba(255,128,0,0.5)] lg:p-10"
            >
              <div className="flex flex-col gap-5">
                <Campo id="nombre" etiqueta="Tu nombre" error={errores.nombre}>
                  <input
                    id="nombre"
                    name="nombre"
                    autoComplete="name"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    aria-invalid={Boolean(errores.nombre)}
                    aria-describedby={errores.nombre ? 'nombre-error' : undefined}
                    className={entrada}
                    placeholder="Ej. María López"
                  />
                </Campo>

                <Campo id="whatsapp" etiqueta="WhatsApp" error={errores.whatsapp}>
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    aria-invalid={Boolean(errores.whatsapp)}
                    aria-describedby={errores.whatsapp ? 'whatsapp-error' : undefined}
                    className={entrada}
                    placeholder="33 1234 5678"
                  />
                </Campo>

                <Campo id="giro" etiqueta="Giro de tu negocio" error={errores.giro}>
                  <div className="relative">
                    <select
                      id="giro"
                      name="giro"
                      value={giro}
                      onChange={(e) => setGiro(e.target.value)}
                      aria-invalid={Boolean(errores.giro)}
                      aria-describedby={errores.giro ? 'giro-error' : undefined}
                      className={`${entrada} appearance-none pr-10 ${giro ? '' : 'text-dim'}`}
                    >
                      <option value="">Elige una opción</option>
                      {giros.map((g) => (
                        <option key={g} value={g} className="text-white">
                          {g}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
                  </div>
                </Campo>

                <fieldset>
                  <legend className="mb-1.5 flex w-full items-baseline justify-between text-[0.9rem] font-medium text-white">
                    ¿Cuál es tu situación? <span className="text-[0.78rem] font-normal text-dim">Opcional</span>
                  </legend>
                  <div className="flex flex-col gap-2">
                    {situaciones.map((s) => (
                      <label
                        key={s}
                        className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-white/15 bg-[#1a1d21] px-4 text-[0.95rem] text-muted transition-colors hover:border-white/30 has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/40"
                      >
                        <input
                          type="radio"
                          name="situacion"
                          value={s}
                          checked={situacion === s}
                          onChange={() => setSituacion(s)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${situacion === s ? 'border-accent' : 'border-white/40'}`}
                        >
                          {situacion === s && <span className="h-2 w-2 rounded-full bg-accent" />}
                        </span>
                        {s}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <Campo id="correo" etiqueta="Correo" opcional error={errores.correo}>
                  <input
                    id="correo"
                    name="correo"
                    type="email"
                    autoComplete="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    aria-invalid={Boolean(errores.correo)}
                    aria-describedby={errores.correo ? 'correo-error' : undefined}
                    className={entrada}
                    placeholder="tucorreo@ejemplo.com"
                  />
                </Campo>

                <Campo id="mensaje" etiqueta="Algo más que quieras contarnos" opcional>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows={3}
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className={`${entrada} h-auto resize-none py-3`}
                  />
                </Campo>

                {/* Campo trampa: las personas no lo ven, los bots sí lo llenan */}
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="empresa_web">Empresa web</label>
                  <input id="empresa_web" name="empresa_web" tabIndex={-1} autoComplete="off" value={trampa} onChange={(e) => setTrampa(e.target.value)} />
                </div>

                <div>
                  <label className="flex cursor-pointer items-start gap-3 text-[0.88rem] leading-snug text-muted">
                    <input
                      type="checkbox"
                      checked={consentimiento}
                      onChange={(e) => setConsentimiento(e.target.checked)}
                      aria-invalid={Boolean(errores.consentimiento)}
                      aria-describedby={errores.consentimiento ? 'consentimiento-error' : undefined}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-[#FF8000]"
                    />
                    <span>
                      Acepto el{' '}
                      <a href="/aviso-de-privacidad" target="_blank" rel="noopener" className="text-white underline underline-offset-2 hover:text-accent">
                        aviso de privacidad
                      </a>{' '}
                      y que me contacten por WhatsApp o correo sobre mi cotización.
                    </span>
                  </label>
                  {errores.consentimiento && (
                    <p id="consentimiento-error" role="alert" className="mt-1.5 text-[0.85rem] text-[#ff7a6b]">
                      {errores.consentimiento}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={estado === 'enviando'}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`group relative inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-full font-semibold backdrop-blur-xl transition-shadow disabled:opacity-70 ${tamanos.normal} ${estilos.primario}`}
                >
                  <span aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b ${brillo.primario} to-transparent`} />
                  <span className="relative z-10">{estado === 'enviando' ? 'Enviando...' : 'Quiero mi diagnóstico gratuito'}</span>
                </motion.button>

                {estado === 'error' && (
                  <div role="alert" className="rounded-xl border border-[#ff7a6b]/40 bg-[#ff7a6b]/10 p-4 text-[0.92rem] text-white">
                    No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos directo por{' '}
                    <a href={WHATSAPP} target="_blank" rel="noopener" className="font-semibold text-accent underline underline-offset-2">
                      WhatsApp
                    </a>
                    .
                  </div>
                )}
              </div>
            </motion.form>
          </div>
        </div>
      </section>
    </MotionConfig>
  )
}
