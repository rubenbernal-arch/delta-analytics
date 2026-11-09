export const runtime = 'nodejs'

const VENTANA_MS = 10 * 60 * 1000
const MAX_ENVIOS = 5
const intentos = new Map<string, number[]>()

// Limite basico en memoria: en serverless protege por instancia, no es una garantia global.
function limitado(ip: string) {
  const ahora = Date.now()
  const recientes = (intentos.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS)
  recientes.push(ahora)
  intentos.set(ip, recientes)
  if (intentos.size > 5000) intentos.clear()
  return recientes.length > MAX_ENVIOS
}

function texto(v: unknown, max: number) {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

function diez(v: unknown) {
  let d = typeof v === 'string' ? v.replace(/\D/g, '') : ''
  if (d.length > 10) d = d.replace(/^(521|52)/, '')
  return d
}

// Regla editable: alta = presupuesto desde $8,700 y quiere arrancar pronto; baja = menos de $8,700.
function prioridad(inversion: string, inicio: string): 'alta' | 'media' | 'baja' {
  if (inversion.startsWith('Menos de')) return 'baja'
  const rapido = inicio === 'Lo antes posible' || inicio === 'Este mes'
  const presupuesto = inversion.startsWith('De $8,700') || inversion.startsWith('Más de')
  return rapido && presupuesto ? 'alta' : 'media'
}

async function guardar(fila: Record<string, unknown>) {
  const url = process.env.SUPABASE_URL
  const llave = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !llave) return false
  const r = await fetch(`${url.replace(/\/$/, '')}/rest/v1/leads_web`, {
    method: 'POST',
    headers: {
      apikey: llave,
      Authorization: `Bearer ${llave}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(fila),
    signal: AbortSignal.timeout(8000),
  })
  if (!r.ok) console.error('lead: supabase respondio', r.status)
  return r.ok
}

async function avisar(asunto: string, cuerpo: string, responderA: string) {
  const llave = process.env.RESEND_API_KEY
  const de = process.env.LEADS_EMAIL_FROM
  const para = process.env.LEADS_EMAIL_TO || 'contacto@deltaanalytics.com.mx'
  if (!llave || !de) return false
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${llave}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: de, to: [para], subject: asunto, text: cuerpo, ...(responderA ? { reply_to: responderA } : {}) }),
    signal: AbortSignal.timeout(8000),
  })
  if (!r.ok) console.error('lead: correo respondio', r.status)
  return r.ok
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'sin-ip'
  if (limitado(ip)) return Response.json({ error: 'demasiados_intentos' }, { status: 429 })

  let b: Record<string, unknown>
  try {
    b = (await req.json()) as Record<string, unknown>
  } catch {
    return Response.json({ error: 'json_invalido' }, { status: 400 })
  }
  if (!b || typeof b !== 'object') return Response.json({ error: 'json_invalido' }, { status: 400 })

  const nombre = texto(b.nombre, 120)
  const whatsapp = diez(b.whatsapp)
  const correo = texto(b.correo, 160)
  if (nombre.length < 2 || whatsapp.length !== 10 || b.consentimiento !== true) {
    return Response.json({ error: 'datos_invalidos' }, { status: 400 })
  }
  if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) {
    return Response.json({ error: 'correo_invalido' }, { status: 400 })
  }

  const negocio = texto(b.negocio, 160)
  const giro = texto(b.giro, 80)
  const situacion = texto(b.situacion, 120)
  const objetivo = texto(b.objetivo, 120)
  const inicio = texto(b.inicio, 80)
  const inversion = texto(b.inversion, 80)
  const necesidades = Array.isArray(b.necesidades)
    ? b.necesidades.filter((x): x is string => typeof x === 'string').slice(0, 10).map((x) => x.slice(0, 80))
    : []
  const detalle = {
    necesidades,
    url_actual: texto(b.url_actual, 200),
    referencias: texto(b.referencias, 300),
    mensaje: texto(b.mensaje, 2000),
  }
  const prio = prioridad(inversion, inicio)

  const fila = {
    nombre,
    whatsapp,
    correo: correo || null,
    negocio,
    giro,
    situacion,
    objetivo,
    inicio,
    inversion,
    prioridad: prio,
    detalle,
    consentimiento: true,
    pagina: texto(b.pagina, 120),
    gclid: texto(b.gclid, 200) || null,
    utm_source: texto(b.utm_source, 120) || null,
    utm_medium: texto(b.utm_medium, 120) || null,
    utm_campaign: texto(b.utm_campaign, 160) || null,
    utm_term: texto(b.utm_term, 160) || null,
    utm_content: texto(b.utm_content, 160) || null,
  }

  const asunto = `[${prio.toUpperCase()}] Nuevo lead web: ${nombre}${negocio ? ` (${negocio})` : ''}`.replace(/[\r\n]+/g, ' ')
  const cuerpo = [
    `Prioridad: ${prio.toUpperCase()}`,
    `Nombre: ${nombre}`,
    `WhatsApp: ${whatsapp}  https://wa.me/52${whatsapp}`,
    `Correo: ${correo || 'no dejó'}`,
    `Negocio: ${negocio} (${giro})`,
    `Situación: ${situacion}`,
    detalle.url_actual ? `Página actual: ${detalle.url_actual}` : '',
    `Objetivo: ${objetivo}`,
    `Necesita: ${necesidades.join(', ') || 'no indicó'}`,
    `Arrancar: ${inicio}`,
    `Inversión: ${inversion}`,
    detalle.referencias ? `Referencias: ${detalle.referencias}` : '',
    detalle.mensaje ? `Mensaje: ${detalle.mensaje}` : '',
    `Origen: ${fila.utm_source || 'directo'} / ${fila.utm_campaign || '-'}${fila.gclid ? ' (gclid)' : ''}`,
  ]
    .filter(Boolean)
    .join('\n')

  const resultados = await Promise.allSettled([guardar(fila), avisar(asunto, cuerpo, correo)])
  const ok = resultados.some((r) => r.status === 'fulfilled' && r.value === true)
  resultados.forEach((r) => r.status === 'rejected' && console.error('lead: fallo', r.reason instanceof Error ? r.reason.message : 'desconocido'))
  if (!ok) return Response.json({ error: 'no_guardado' }, { status: 500 })
  return Response.json({ ok: true })
}
