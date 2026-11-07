import Image from 'next/image'

const benefits = [
  {
    title: 'Más clientes',
    desc: <>Convierte visitas<br />en oportunidades.</>,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 20V10M10 20V4M16 20V13M22 20V7" stroke="#FF8000" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Más confianza',
    desc: <>Refuerza la imagen<br />de tu negocio.</>,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2l8 3.5v5.2c0 5-3.4 8.9-8 10.3-4.6-1.4-8-5.3-8-10.3V5.5L12 2z" stroke="#FF8000" strokeWidth="2" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="#FF8000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Resultados reales',
    desc: <>Diseño, tecnología<br />y estrategia de conversión.</>,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke="#FF8000" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-base">
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-10 pt-8 lg:px-0 lg:pl-[72px] lg:pt-[44px]">
        <div className="relative z-10 max-w-[720px]">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-[4px] w-[50px] bg-accent" aria-hidden="true" />
            <span className="font-mono text-[0.8rem] font-medium uppercase tracking-[0.18em] text-white">
              Páginas web a la medida
            </span>
          </div>

          <h1 className="mb-5 font-display text-[32px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[42px] lg:text-[60px] lg:leading-[1.0]">
            Consigue más clientes{' '}
            <br className="hidden lg:block" />
            y haz crecer tu negocio{' '}
            <br className="hidden lg:block" />
            con una <span className="text-accent">página web</span>{' '}
            <br className="hidden lg:block" />
            <span className="text-accent">profesional.</span>
          </h1>

          <p className="mb-[12px] max-w-[590px] text-[1.4rem] leading-[1.5] text-muted">
            Diseñamos y desarrollamos páginas web enfocadas en generar resultados reales, ya sea que hoy no tengas una o quieras una que por fin funcione.
          </p>

          <div className="mb-6 flex flex-wrap items-center gap-[22px]">
            <a
              href="#cotiza"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-accent px-10 text-[1.05rem] font-semibold text-[#14161A] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-8px_rgba(255,128,0,0.55)]"
            >
              Solicitar diagnóstico gratuito <span aria-hidden="true">→</span>
            </a>
            <a
              href="#proyectos"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-white/80 px-[33px] text-[1.05rem] font-semibold text-white transition-colors hover:bg-white/10"
            >
              <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true" className="shrink-0">
                <path d="M0 0L12 7L0 14Z" />
              </svg>
              Ver proyectos
            </a>
          </div>

          <p className="mb-10 font-mono text-[0.78rem] tracking-wide text-dim">
            Desde $7,500 MXN + IVA · Entrega en 5 días hábiles · Dominio 1er año incluido
          </p>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-6">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                className={`flex items-stretch ${i > 0 ? 'lg:border-l lg:border-white/15 lg:pl-6' : ''}`}
              >
                <div className="flex max-w-[280px] flex-col gap-2 pr-4 lg:max-w-[235px]">
                  {b.icon}
                  <div>
                    <p className="font-display text-[1rem] font-semibold text-white">{b.title}</p>
                    <p className="text-[0.9rem] leading-snug text-muted">{b.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none relative z-0 mt-10 aspect-[2700/1514] w-full lg:absolute lg:top-0 lg:right-0 lg:bottom-[165px] lg:left-[38%] lg:z-0 lg:mt-0 lg:aspect-auto lg:w-auto">
          <Image
            src="/paginas-web/devices-hero.webp"
            alt="Captura del sitio de TLA Adventures en laptop y celular"
            fill
            priority
            sizes="100vw"
            className="object-contain object-right lg:object-cover lg:object-[right_bottom]"
          />
        </div>

        <div
          className="pointer-events-none absolute bottom-0 left-0 z-[5] hidden h-[190px] w-[46%] bg-gradient-to-r from-base via-base/75 to-transparent lg:block"
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
