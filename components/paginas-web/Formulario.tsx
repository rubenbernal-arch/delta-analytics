'use client'

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { motion, MotionConfig, type Variants } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, ChevronDown } from 'lucide-react'
import { serif } from './fuentes'

const WHATSAPP = 'https://wa.me/523330163038?text=Hola%2C%20quiero%20cotizar%20una%20p%C3%A1gina%20web%20para%20mi%20negocio'
const CLAVES_ATRIBUCION = ['gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
const ALMACEN = 'dw_atribucion'
const CHAFLAN = 'polygon(0 0, calc(100% - 36px) 0, 100% 36px, 100% 100%, 36px 100%, 0 calc(100% - 36px))'

// Escribe aqui lo que prometes de tiempo de respuesta (ej. "Te escribimos el mismo dia habil"). Vacio = no se muestra.
const TIEMPO_RESPUESTA = 'te escribimos en una hora o menos (horario hábil)'

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

const objetivos = [
  'Que me contacten por WhatsApp',
  'Vender en línea',
  'Recibir reservas o citas',
  'Mostrar mi catálogo o servicios',
  'Verme más profesional',
]

const necesidadesOpciones = [
  'Botón de WhatsApp',
  'Catálogo o servicios',
  'Reservas o citas',
  'Tienda con pagos en línea',
  'Blog o artículos',
  'Otra cosa',
]

const inicios = ['Lo antes posible', 'Este mes', 'Estoy cotizando, sin prisa']

const inversiones = ['Menos de $8,700 MXN', 'De $8,700 a $15,000 MXN', 'Más de $15,000 MXN', 'Aún no lo sé']

const etapas = ['Tus datos', 'Tu negocio', 'Tu proyecto']
const titulosPaso = ['¿Cómo te contactamos?', 'Sobre tu negocio', 'Sobre tu proyecto']

const proceso = [
  { titulo: 'Nos cuentas de tu negocio', texto: 'Tres pasos cortos para entender tu proyecto.' },
  { titulo: 'Te contactamos', texto: 'Revisamos tus respuestas y te escribimos por WhatsApp.' },
  { titulo: 'Recibes tu cotización', texto: 'Precio claro, desde $8,700 MXN IVA incluido.' },
]

const subir: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}
const lista: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const visible = { once: true, amount: 0.2 } as const

const entrada =
  'h-12 w-full rounded-lg border border-white/15 bg-[#1a1d21] px-4 text-[1rem] text-white placeholder:text-dim outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30'

const chip =
  'flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border border-white/15 bg-[#1a1d21] px-4 py-2 text-[0.95rem] leading-snug text-muted transition-colors hover:border-white/30 has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/40'

const etiquetaClase = 'mb-2 flex w-full items-baseline justify-between font-mono text-[0.72rem] uppercase tracking-[0.14em] text-white/80'

type Paso = 1 | 2 | 3
type Errores = Partial<
  Record<'nombre' | 'whatsapp' | 'correo' | 'negocio' | 'giro' | 'situacion' | 'url' | 'objetivo' | 'inicio' | 'inversion' | 'consentimiento', string>
>

function soloDiez(valor: string) {
  let d = valor.replace(/\D/g, '')
  if (d.length > 10) d = d.replace(/^(521|52)/, '')
  return d
}

function MensajeError({ id, texto }: { id: string; texto?: string }) {
  if (!texto) return null
  return (
    <p id={id} role="alert" className="mt-1.5 text-[0.85rem] text-[#ff7a6b]">
      {texto}
    </p>
  )
}

function Campo({ id, etiqueta, error, opcional, children }: { id: string; etiqueta: string; error?: string; opcional?: boolean; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={etiquetaClase}>
        {etiqueta}
        {opcional && <span className="text-[0.68rem] font-normal text-dim">Opcional</span>}
      </label>
      {children}
      <MensajeError id={`${id}-error`} texto={error} />
    </div>
  )
}

function Chips({
  id,
  leyenda,
  opciones,
  valor,
  onChange,
  error,
  opcional,
}: {
  id: string
  leyenda: string
  opciones: string[]
  valor: string
  onChange: (v: string) => void
  error?: string
  opcional?: boolean
}) {
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined}>
      <legend className={etiquetaClase}>
        {leyenda}
        {opcional && <span className="text-[0.68rem] font-normal text-dim">Opcional</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {opciones.map((o) => (
          <label key={o} className={chip}>
            <input type="radio" name={id} value={o} checked={valor === o} onChange={() => onChange(o)} className="sr-only" />
            {o}
          </label>
        ))}
      </div>
      <MensajeError id={`${id}-error`} texto={error} />
    </fieldset>
  )
}

function ChipsMultiples({
  id,
  leyenda,
  opciones,
  valor,
  onToggle,
  opcional,
}: {
  id: string
  leyenda: string
  opciones: string[]
  valor: string[]
  onToggle: (v: string) => void
  opcional?: boolean
}) {
  return (
    <fieldset>
      <legend className={etiquetaClase}>
        {leyenda}
        {opcional && <span className="text-[0.68rem] font-normal text-dim">Opcional</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {opciones.map((o) => {
          const marcado = valor.includes(o)
          return (
            <label key={o} className={chip}>
              <input type="checkbox" name={id} value={o} checked={marcado} onChange={() => onToggle(o)} className="sr-only" />
              {marcado && <Check size={16} className="shrink-0 text-accent" aria-hidden="true" />}
              {o}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function Formulario() {
  const router = useRouter()
  const [paso, setPaso] = useState<Paso>(1)
  const [nombre, setNombre] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [correo, setCorreo] = useState('')
  const [negocio, setNegocio] = useState('')
  const [giro, setGiro] = useState('')
  const [situacion, setSituacion] = useState('')
  const [url, setUrl] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [necesidades, setNecesidades] = useState<string[]>([])
  const [inicio, setInicio] = useState('')
  const [inversion, setInversion] = useState('')
  const [referencias, setReferencias] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [consentimiento, setConsentimiento] = useState(false)
  const [trampa, setTrampa] = useState('')
  const [errores, setErrores] = useState<Errores>({})
  const [estado, setEstado] = useState<'reposo' | 'enviando' | 'error'>('reposo')

  const tarjeta = useRef<HTMLDivElement>(null)
  const tituloPaso = useRef<HTMLHeadingElement>(null)
  const pasoPrevio = useRef<Paso>(1)

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

  // Al cambiar de paso: foco en el titulo del paso y, si la tarjeta quedo arriba de la pantalla, la regresa a la vista.
  useEffect(() => {
    if (pasoPrevio.current === paso) return
    pasoPrevio.current = paso
    tituloPaso.current?.focus({ preventScroll: true })
    const t = tarjeta.current
    if (t && t.getBoundingClientRect().top < 0) t.scrollIntoView({ block: 'start' })
  }, [paso])

  function atribucion() {
    const datos: Record<string, string> = {}
    try {
      Object.assign(datos, JSON.parse(sessionStorage.getItem(ALMACEN) || '{}'))
      const params = new URLSearchParams(window.location.search)
      for (const k of CLAVES_ATRIBUCION) {
        const v = params.get(k)
        if (v) datos[k] = v
      }
    } catch {
      // ignorar
    }
    return datos
  }

  function validarPaso(p: Paso): Errores {
    const e: Errores = {}
    if (p === 1) {
      if (nombre.trim().length < 2) e.nombre = 'Escribe tu nombre.'
      if (soloDiez(whatsapp).length !== 10) e.whatsapp = 'Escribe tu WhatsApp a 10 dígitos.'
      if (correo.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim())) e.correo = 'Revisa que el correo esté bien escrito.'
    }
    if (p === 2) {
      if (negocio.trim().length < 2) e.negocio = 'Escribe el nombre de tu negocio.'
      if (!giro) e.giro = 'Elige el giro de tu negocio.'
      if (!situacion) e.situacion = 'Elige la opción que más se parezca.'
      if (situacion && situacion !== situaciones[0] && url.trim() && !/^(https?:\/\/)?[^\s/]+\.[^\s/]{2,}(\/\S*)?$/.test(url.trim()))
        e.url = 'Revisa la dirección de tu página.'
      if (!objetivo) e.objetivo = 'Elige tu objetivo principal.'
    }
    if (p === 3) {
      if (!inicio) e.inicio = 'Elige cuándo quieres arrancar.'
      if (!inversion) e.inversion = 'Elige una opción, puede ser "Aún no lo sé".'
      if (!consentimiento) e.consentimiento = 'Necesitamos que aceptes el aviso de privacidad.'
    }
    return e
  }

  function alternarNecesidad(o: string) {
    setNecesidades((prev) => (prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]))
  }

  function atras() {
    setErrores({})
    setPaso((p) => (p > 1 ? ((p - 1) as Paso) : p))
  }

  async function enviar(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    if (estado === 'enviando') return
    if (trampa) {
      router.push('/paginas-web/gracias')
      return
    }
    const e = validarPaso(paso)
    setErrores(e)
    if (Object.keys(e).length) return

    if (paso < 3) {
      setPaso((p) => (p + 1) as Paso)
      return
    }

    setEstado('enviando')
    try {
      const r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          whatsapp: soloDiez(whatsapp),
          correo: correo.trim(),
          negocio: negocio.trim(),
          giro,
          situacion,
          url_actual: situacion && situacion !== situaciones[0] ? url.trim() : '',
          objetivo,
          necesidades,
          inicio,
          inversion,
          referencias: referencias.trim(),
          mensaje: mensaje.trim(),
          consentimiento: true,
          pagina: window.location.pathname,
          ...atribucion(),
        }),
      })
      if (!r.ok) throw new Error('fallo')
      try {
        sessionStorage.setItem('dw_lead_ok', '1')
      } catch {
        // sin almacenamiento: no se registra la conversion, pero el lead ya quedo guardado
      }
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
        <svg
          className="pointer-events-none absolute -left-[10%] bottom-[-25%] w-[min(700px,70vw)] opacity-[0.07]"
          viewBox="0 0 100 90"
          fill="none"
          aria-hidden="true"
        >
          <polygon points="50,3 97,87 3,87" stroke="#fff" strokeWidth="0.35" />
          <polygon points="50,24 78,76 22,76" stroke="#FF8000" strokeWidth="0.3" />
        </svg>
        <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-16 lg:px-[72px] lg:py-24">
          <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
            <motion.div variants={lista} initial="hidden" whileInView="visible" viewport={visible} className="min-w-0 lg:sticky lg:top-12">
              <motion.div variants={subir} className="mb-5 flex items-center gap-3">
                <span className="text-accent" aria-hidden="true">▲</span>
                <span className="font-mono text-[0.8rem] font-medium uppercase tracking-[0.18em] text-white">
                  Diagnóstico gratuito
                </span>
              </motion.div>
              <motion.h2
                variants={subir}
                className="mb-4 font-display text-[clamp(36px,5vw,76px)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-white"
              >
                Cuéntanos de tu negocio
              </motion.h2>
              <motion.p
                variants={subir}
                className={`${serif.className} mb-6 text-[clamp(30px,3.8vw,56px)] italic leading-[1] text-white/90`}
              >
                y te decimos cómo lo haríamos.
              </motion.p>
              <motion.p variants={subir} className="mb-9 max-w-[520px] text-[1.15rem] leading-[1.5] text-muted">
                Te damos un diagnóstico gratuito y una cotización clara de tu página web.
              </motion.p>
              <motion.ol variants={lista} className="border-b border-white/15">
                {proceso.map(({ titulo, texto }, i) => (
                  <motion.li key={titulo} variants={subir} className="flex items-baseline gap-5 border-t border-white/15 py-5">
                    <span className="font-mono text-[0.75rem] tracking-[0.16em] text-accent">0{i + 1}</span>
                    <div>
                      <p className="font-display text-[1.1rem] font-extrabold uppercase tracking-tight text-white">{titulo}</p>
                      <p className="mt-1 text-[0.95rem] leading-snug text-muted">{texto}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ol>
            </motion.div>

            <div ref={tarjeta} style={{ clipPath: CHAFLAN }} className="min-w-0 bg-[rgba(255,160,60,0.45)] p-px">
              <motion.form
                style={{ clipPath: CHAFLAN }}
                onSubmit={enviar}
                noValidate
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={visible}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="bg-surface p-6 lg:p-10"
              >
                <div className="mb-8">
                  <div className="mb-3 flex items-baseline justify-between font-mono text-[0.72rem] uppercase tracking-[0.14em]">
                    <span className="text-white" aria-live="polite">
                      Paso {paso} de 3
                    </span>
                    <span className="text-muted">{etapas[paso - 1]}</span>
                  </div>
                  <div className="flex gap-2" aria-hidden="true">
                    {etapas.map((e, i) => (
                      <span key={e} className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${i < paso ? 'bg-accent' : 'bg-white/15'}`} />
                    ))}
                  </div>
                </div>

                <motion.div
                  key={paso}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="flex flex-col gap-5"
                >
                  <h3
                    ref={tituloPaso}
                    tabIndex={-1}
                    className="font-display text-[1.35rem] font-extrabold uppercase leading-none tracking-tight text-white outline-none"
                  >
                    {titulosPaso[paso - 1]}
                  </h3>

                  {paso === 1 && (
                    <>
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
                    </>
                  )}

                  {paso === 2 && (
                    <>
                      <Campo id="negocio" etiqueta="Nombre de tu negocio" error={errores.negocio}>
                        <input
                          id="negocio"
                          name="negocio"
                          autoComplete="organization"
                          value={negocio}
                          onChange={(e) => setNegocio(e.target.value)}
                          aria-invalid={Boolean(errores.negocio)}
                          aria-describedby={errores.negocio ? 'negocio-error' : undefined}
                          className={entrada}
                          placeholder="Ej. Café La Esquina"
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

                      <Chips id="situacion" leyenda="¿Cuál es tu situación?" opciones={situaciones} valor={situacion} onChange={setSituacion} error={errores.situacion} />

                      {situacion && situacion !== situaciones[0] && (
                        <Campo id="url" etiqueta="Dirección de tu página actual" opcional error={errores.url}>
                          <input
                            id="url"
                            name="url"
                            inputMode="url"
                            autoComplete="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            aria-invalid={Boolean(errores.url)}
                            aria-describedby={errores.url ? 'url-error' : undefined}
                            className={entrada}
                            placeholder="tunegocio.com"
                          />
                        </Campo>
                      )}

                      <Chips id="objetivo" leyenda="¿Qué quieres lograr con tu página?" opciones={objetivos} valor={objetivo} onChange={setObjetivo} error={errores.objetivo} />
                    </>
                  )}

                  {paso === 3 && (
                    <>
                      <ChipsMultiples id="necesidades" leyenda="¿Qué necesita tu página?" opciones={necesidadesOpciones} valor={necesidades} onToggle={alternarNecesidad} opcional />

                      <Chips id="inicio" leyenda="¿Cuándo quieres arrancar?" opciones={inicios} valor={inicio} onChange={setInicio} error={errores.inicio} />

                      <Chips id="inversion" leyenda="Inversión aproximada" opciones={inversiones} valor={inversion} onChange={setInversion} error={errores.inversion} />

                      <Campo id="referencias" etiqueta="Páginas que te gusten" opcional>
                        <input
                          id="referencias"
                          name="referencias"
                          value={referencias}
                          onChange={(e) => setReferencias(e.target.value)}
                          className={entrada}
                          placeholder="Pega uno o dos enlaces de referencia"
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
                        <MensajeError id="consentimiento-error" texto={errores.consentimiento} />
                      </div>
                    </>
                  )}
                </motion.div>

                {/* Campo trampa: las personas no lo ven, los bots sí lo llenan */}
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="empresa_web">Empresa web</label>
                  <input id="empresa_web" name="empresa_web" tabIndex={-1} autoComplete="off" value={trampa} onChange={(e) => setTrampa(e.target.value)} />
                </div>

                <div className="mt-7 flex gap-3">
                  {paso > 1 && (
                    <button type="button" onClick={atras} className="btn86 btn86-s" style={{ padding: '0 22px' }}>
                      <span>
                        <ArrowLeft className="h-[1.1em] w-[1.1em] shrink-0" aria-hidden="true" />
                        Atrás
                      </span>
                    </button>
                  )}
                  <button type="submit" disabled={estado === 'enviando'} className="btn86 btn86-p" style={{ flex: 1 }}>
                    <span>
                      {estado === 'enviando' ? 'Enviando...' : paso < 3 ? 'Continuar' : 'Quiero mi diagnóstico gratuito'}
                      {paso < 3 && <ArrowRight className="h-[1.1em] w-[1.1em] shrink-0" aria-hidden="true" />}
                    </span>
                  </button>
                </div>

                <p className="mt-4 text-center font-mono text-[0.7rem] uppercase tracking-[0.12em] text-dim">
                  Gratis y sin compromiso{TIEMPO_RESPUESTA ? ` · ${TIEMPO_RESPUESTA}` : ''}
                </p>

                {estado === 'error' && (
                  <div role="alert" className="mt-5 rounded-lg border border-[#ff7a6b]/40 bg-[#ff7a6b]/10 p-4 text-[0.92rem] text-white">
                    No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos directo por{' '}
                    <a href={WHATSAPP} target="_blank" rel="noopener" className="font-semibold text-accent underline underline-offset-2">
                      WhatsApp
                    </a>
                    .
                  </div>
                )}
              </motion.form>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  )
}
