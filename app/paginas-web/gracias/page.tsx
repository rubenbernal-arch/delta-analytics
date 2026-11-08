import type { Metadata } from 'next'
import { Boton } from '@/components/paginas-web/Boton'
import { serif } from '@/components/paginas-web/fuentes'

export const metadata: Metadata = {
  title: 'Recibimos tu solicitud | Delta Analytics',
  robots: { index: false, follow: false },
}

const WHATSAPP = 'https://wa.me/523330163038?text=Hola%2C%20acabo%20de%20enviar%20mi%20solicitud%20de%20p%C3%A1gina%20web'

export default function GraciasPage() {
  return (
    <main className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-base px-6 py-16 lg:px-[72px]">
      <svg
        className="pointer-events-none absolute -right-[10%] top-[8%] w-[min(820px,80vw)] opacity-[0.09]"
        viewBox="0 0 100 90"
        fill="none"
        aria-hidden="true"
      >
        <polygon points="50,3 97,87 3,87" stroke="#fff" strokeWidth="0.35" />
        <polygon points="50,24 78,76 22,76" stroke="#FF8000" strokeWidth="0.3" />
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(255,128,0,0.14),transparent_55%)]" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        <a href="/paginas-web" className="mb-16 flex items-center gap-2 font-display text-[1.25rem] font-extrabold uppercase tracking-tight text-white">
          <span className="text-accent" aria-hidden="true">▲</span> Delta Analytics
        </a>
        <p className="flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-white/70">
          <span className="text-accent" aria-hidden="true">▲</span> Solicitud recibida
        </p>
        <h1 className="mt-8 font-display text-[clamp(64px,13vw,200px)] font-extrabold uppercase leading-[0.85] tracking-[-0.04em] text-white">
          Listo.
        </h1>
        <p className={`${serif.className} mt-3 text-[clamp(32px,5.6vw,84px)] italic leading-[1] text-white/90`}>
          recibimos tu solicitud.
        </p>
        <p className="mb-10 mt-8 max-w-[520px] text-[1.15rem] leading-[1.5] text-muted">
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
      </div>
    </main>
  )
}
