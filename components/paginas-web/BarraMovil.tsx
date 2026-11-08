'use client'

import { useEffect, useState } from 'react'
import { Boton } from './Boton'

const WHATSAPP = 'https://wa.me/523330163038?text=Hola%2C%20quiero%20cotizar%20una%20p%C3%A1gina%20web%20para%20mi%20negocio'

export function BarraMovil() {
  const [ver, setVer] = useState(false)

  useEffect(() => {
    const alScroll = () => setVer(window.scrollY > 700)
    window.addEventListener('scroll', alScroll, { passive: true })
    return () => window.removeEventListener('scroll', alScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 flex gap-3 border-t border-white/15 bg-base/95 px-4 py-3 backdrop-blur transition-transform duration-300 lg:hidden ${ver ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="flex-1">
        <Boton href="#cotiza" tamano="mini">Cotizar mi página</Boton>
      </div>
      <Boton href={WHATSAPP} externo variante="cristal" flecha={false} tamano="mini">
        WhatsApp
      </Boton>
    </div>
  )
}
