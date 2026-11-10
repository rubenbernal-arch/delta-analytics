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

function convertir(etiqueta?: string) {
  if (!ID || !etiqueta) return
  // Si el script de gtag aun no carga, crea la cola para que el evento no se pierda.
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: Gtag }
  w.dataLayer = w.dataLayer || []
  w.gtag =
    w.gtag ||
    function () {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments)
    }
  w.gtag('event', 'conversion', { send_to: `${ID}/${etiqueta}` })
}

export function Analitica() {
  const ruta = usePathname()

  // Lead: solo cuenta si el envio real fue exitoso (el formulario deja la marca dw_lead_ok).
  useEffect(() => {
    if (ruta !== GRACIAS) return
    try {
      if (sessionStorage.getItem('dw_lead_ok') !== '1') return
      sessionStorage.removeItem('dw_lead_ok')
    } catch {
      return
    }
    convertir(ETIQUETA_LEAD)
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
