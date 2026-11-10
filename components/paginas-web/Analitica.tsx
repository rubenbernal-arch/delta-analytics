'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'

const ID = process.env.NEXT_PUBLIC_GADS_ID
const ETIQUETA_LEAD = process.env.NEXT_PUBLIC_GADS_LABEL_LEAD
const ETIQUETA_WHATSAPP = process.env.NEXT_PUBLIC_GADS_LABEL_WHATSAPP
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID
const GRACIAS = '/paginas-web/gracias'

type Gtag = (...args: unknown[]) => void

const REINTENTO_MS = 250
const ESPERA_MAX_MS = 10000

// Dispara la conversion una sola vez. Si gtag aun no carga, reintenta cada 250 ms hasta 10 s.
// alTerminar se llama al enviar el evento o al agotar la espera. Devuelve una funcion para cancelar.
function convertir(etiqueta?: string, alTerminar?: () => void): () => void {
  if (!ID || !etiqueta) {
    alTerminar?.()
    return () => {}
  }
  const inicio = Date.now()
  let timer: ReturnType<typeof setTimeout> | undefined
  const intentar = () => {
    const gtag = (window as unknown as { gtag?: Gtag }).gtag
    if (typeof gtag === 'function') {
      gtag('event', 'conversion', { send_to: `${ID}/${etiqueta}` })
      alTerminar?.()
    } else if (Date.now() - inicio >= ESPERA_MAX_MS) {
      alTerminar?.()
    } else {
      timer = setTimeout(intentar, REINTENTO_MS)
    }
  }
  intentar()
  return () => clearTimeout(timer)
}

export function Analitica() {
  const ruta = usePathname()

  // Lead: solo cuenta si el envio real fue exitoso (el formulario deja la marca dw_lead_ok).
  useEffect(() => {
    if (ruta !== GRACIAS) return
    try {
      if (sessionStorage.getItem('dw_lead_ok') !== '1') return
    } catch {
      return
    }
    // La marca se borra solo cuando el evento ya se envio o se agoto la espera de gtag.
    return convertir(ETIQUETA_LEAD, () => {
      try {
        sessionStorage.removeItem('dw_lead_ok')
      } catch {}
    })
  }, [ruta])

  // Clic a WhatsApp: no cuenta en la pagina de gracias para no duplicar al que ya lleno el formulario.
  useEffect(() => {
    function alClic(e: MouseEvent) {
      if (window.location.pathname === GRACIAS) return
      const a = (e.target as HTMLElement | null)?.closest?.('a')
      const href = a?.getAttribute('href') || ''
      if (href.includes('wa.me/')) convertir(ETIQUETA_WHATSAPP)
    }
    document.addEventListener('click', alClic)
    return () => document.removeEventListener('click', alClic)
  }, [])

  if (!ID && !CLARITY_ID) return null
  return (
    <>
      {ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ID}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ID}');`}
          </Script>
        </>
      )}
      {CLARITY_ID && (
        <Script id="clarity-init" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${CLARITY_ID}");`}
        </Script>
      )}
    </>
  )
}
