import { Boton } from './Boton'
import { TituloHero } from './TituloHero'

const WHATSAPP = 'https://wa.me/523330163038?text=Hola%2C%20quiero%20cotizar%20una%20p%C3%A1gina%20web%20para%20mi%20negocio'

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
      <svg
        className="pointer-events-none absolute -left-[8%] bottom-[-18%] hidden w-[620px] opacity-[0.07] lg:block"
        viewBox="0 0 100 90"
        fill="none"
        aria-hidden="true"
      >
        <polygon points="50,3 97,87 3,87" stroke="#fff" strokeWidth="0.35" />
        <polygon points="50,22 80,78 20,78" stroke="#FF8000" strokeWidth="0.3" />
      </svg>
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-10 pt-8 lg:px-0 lg:pl-[72px] lg:pt-[44px]">
        <div className="relative z-10 max-w-[720px]">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-[4px] w-[50px] bg-accent" aria-hidden="true" />
            <span className="font-mono text-[0.8rem] font-medium uppercase tracking-[0.18em] text-white">
              Páginas web a la medida
            </span>
          </div>

          <TituloHero />

          <p className="mb-[12px] max-w-[590px] text-[1.4rem] leading-[1.5] text-muted">
            Diseñamos y desarrollamos páginas web enfocadas en generar resultados reales, ya sea que hoy no tengas una o quieras una que por fin funcione.
          </p>

          <div className="mb-6 flex flex-wrap items-center gap-[22px]">
            <Boton href="#cotiza">Solicitar diagnóstico gratuito</Boton>
            <Boton href="#proyectos" variante="cristal" flecha={false}>
              <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true" className="shrink-0">
                <path d="M0 0L12 7L0 14Z" />
              </svg>
              Ver proyectos
            </Boton>
          </div>

          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener"
            className="mb-6 inline-block text-[0.85rem] text-muted underline underline-offset-2 transition-colors hover:text-white"
          >
            ¿Prefieres WhatsApp? Escríbenos
          </a>

          <p className="mb-10 font-mono text-[0.92rem] tracking-wide text-muted">
            <span className="font-semibold text-white">Desde $8,700 MXN</span> IVA incluido · Entrega en 5 días hábiles · Dominio 1er año incluido
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

        <div className="pointer-events-none relative z-0 mt-10 aspect-[2700/1514] w-full lg:absolute lg:top-0 lg:right-0 lg:bottom-[110px] lg:left-[30%] lg:z-0 lg:mt-0 lg:aspect-auto lg:w-auto lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,#000_22%),linear-gradient(to_top,transparent_0%,#000_28%)] lg:[mask-image:linear-gradient(to_right,transparent_0%,#000_22%),linear-gradient(to_top,transparent_0%,#000_28%)] lg:[-webkit-mask-composite:source-in] lg:[mask-composite:intersect]">
          <picture>
            <source media="(min-width: 1024px)" srcSet="/paginas-web/devices-hero.webp" />
            <img
              src="/paginas-web/devices-hero-1200.webp"
              alt="Laptop con el sitio de TLA Adventures y celular con el sitio de La Puerta de Michoacán, páginas web hechas por Delta Analytics"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain object-right lg:object-cover lg:object-[right_bottom]"
            />
          </picture>
        </div>

        <div
          className="pointer-events-none absolute bottom-0 left-0 z-[5] hidden h-[190px] w-[46%] bg-gradient-to-r from-base via-base/75 to-transparent lg:block"
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
