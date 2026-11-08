import type { Metadata } from 'next'
import { CheckCircle2 } from 'lucide-react'
import { Boton } from '@/components/paginas-web/Boton'

export const metadata: Metadata = {
  title: 'Recibimos tu solicitud | Delta Analytics',
  robots: { index: false, follow: false },
}

const WHATSAPP = 'https://wa.me/523330163038?text=Hola%2C%20acabo%20de%20enviar%20mi%20solicitud%20de%20p%C3%A1gina%20web'

export default function GraciasPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-base px-6 py-16 text-center">
      <a href="/paginas-web" className="mb-12 flex items-center gap-2.5 font-display text-[1.25rem] font-bold tracking-tight text-white">
        <span className="text-[1.4rem] leading-none text-accent">▲</span>
        <span>DELTA ANALYTICS</span>
      </a>
      <CheckCircle2 size={56} className="mb-6 text-accent" aria-hidden="true" />
      <h1 className="mb-4 max-w-[640px] text-balance font-display text-[34px] font-extrabold leading-[1.1] tracking-tight text-white sm:text-[46px]">
        Listo, recibimos tu <span className="text-accent">solicitud.</span>
      </h1>
      <p className="mb-9 max-w-[520px] text-[1.15rem] leading-[1.5] text-muted">
        Te contactaremos por WhatsApp para platicar tu proyecto. Si quieres adelantar, escríbenos ahora.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Boton href={WHATSAPP} externo>
          Escribir por WhatsApp
        </Boton>
        <Boton href="/paginas-web" variante="cristal" flecha={false}>
          Volver a la página
        </Boton>
      </div>
    </main>
  )
}
