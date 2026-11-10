'use client'

import { useEffect, useState } from 'react'
import { Boton } from './Boton'

const WHATSAPP = 'https://wa.me/523330163038?text=Hola%2C%20quiero%20cotizar%20una%20p%C3%A1gina%20web%20para%20mi%20negocio'

export function BarraMovil() {
  const [pasoElInicio, setPasoElInicio] = useState(false)
  const [enFormulario, setEnFormulario] = useState(false)

  useEffect(() => {
    const alScroll = () => setPasoElInicio(window.scrollY > 700)
    alScroll()
    window.addEventListener('scroll', alScroll, { passive: true })
    return () => window.removeEventListener('scroll', alScroll)
  }, [])

  // Mientras el formulario esta en pantalla la barra sobra: ofrece ir a donde ya estas
  useEffect(() => {
    const formulario = document.getElementById('cotiza')
    if (!formulario) return
    const observador = new IntersectionObserver(
      ([entrada]) => setEnFormulario(entrada.isIntersecting),
      { threshold: 0 },
    )
    observador.observe(formulario)
    return () => observador.disconnect()
  }, [])

  const mostrar = pasoElInicio && !enFormulario

  return (
    <div
      inert={!mostrar}
      aria-hidden={!mostrar}
      className={`fixed inset-x-0 bottom-0 z-50 flex gap-3 border-t border-white/15 bg-base/95 px-4 py-3 transition-transform duration-300 lg:hidden ${mostrar ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="flex-1">
        <Boton href="#cotiza" tamano="barra" bloque>Cotizar mi página</Boton>
      </div>
      <Boton href={WHATSAPP} externo variante="cristal" flecha={false} tamano="barra">
        WhatsApp
      </Boton>
    </div>
  )
}
