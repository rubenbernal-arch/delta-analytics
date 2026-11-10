import { Plus } from 'lucide-react'
import { Revelar } from './Movimiento'
import { serif } from './fuentes'

const preguntas = [
  {
    q: '¿Cuánto cuesta?',
    a: 'Desde $8,700 MXN con IVA incluido. El dominio del primer año va incluido.',
  },
  {
    q: '¿Cuánto tarda?',
    a: 'La entrega es en 5 días hábiles, contados desde que tenemos tu información y el anticipo.',
  },
  {
    q: '¿Cómo se paga?',
    a: 'Se paga un anticipo del 50% para arrancar y el resto al entregar. El anticipo no es reembolsable.',
  },
  {
    q: '¿El mantenimiento es obligatorio?',
    a: 'No, es opcional. El primer mes va incluido y después tú decides si lo continúas.',
  },
  {
    q: '¿Qué incluye el mantenimiento y qué no?',
    a: 'Son $696 MXN al mes, IVA incluido, unos $23 pesos al día. Tu página siempre en línea, segura y al día:',
    lista: [
      'Hosting de tu página',
      'Renovación de tu dominio',
      'Certificado de seguridad (SSL) vigente',
      'Respaldos y actualizaciones de seguridad',
      'Hasta 4 cambios menores al mes (textos, fotos, horarios o precios)',
      'Soporte por WhatsApp',
    ],
    aparte: 'Una función nueva, como un sistema de reservas, un carrito de compras o una sección nueva, es un proyecto aparte y se cotiza por separado.',
  },
  {
    q: '¿Cuánto cuesta el hosting y el dominio?',
    a: 'El dominio del primer año va incluido. El hosting va incluido si contratas el mantenimiento, junto con la renovación del dominio. Si no lo contratas, el hosting cuesta desde $1,740 MXN al año, IVA incluido, y el dominio se renueva al costo según su extensión.',
  },
  {
    q: '¿Puedo ver ejemplos antes de decidir?',
    a: 'Sí. Arriba están proyectos reales en línea, cada uno con su enlace para que los abras y los revises.',
  },
]

export function FAQ() {
  return (
    <section id="faq" className="relative border-t border-[var(--line)] bg-base">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-6 py-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.3fr)] lg:gap-20 lg:px-[72px] lg:py-28">
        <div>
          <p className="flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-white/70">
            <span className="text-accent" aria-hidden="true">▲</span> Dudas
          </p>
          <h2 className="mt-8 font-display text-[clamp(34px,4.2vw,64px)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-white">
            <Revelar>Preguntas</Revelar>
          </h2>
          <p className={`${serif.className} mt-1 text-[clamp(32px,4.4vw,64px)] italic leading-[1] text-white/90`}>
            <Revelar retraso={0.12}>frecuentes.</Revelar>
          </p>
        </div>

        <div className="border-b border-white/15">
          {preguntas.map((p) => (
            <details key={p.q} className="group border-t border-white/15">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                <span className="font-display text-[clamp(20px,2vw,28px)] font-extrabold uppercase leading-tight tracking-tight text-white">
                  {p.q}
                </span>
                <Plus className="h-5 w-5 shrink-0 text-accent transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
              </summary>
              <div className="max-w-[60ch] pb-7 text-[1rem] leading-relaxed text-muted">
                <p>{p.a}</p>
                {p.lista && (
                  <ul className="mt-4 space-y-2">
                    {p.lista.map((x) => (
                      <li key={x} className="flex gap-3">
                        <span className="text-accent" aria-hidden="true">▲</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                )}
                {p.aparte && <p className="mt-4 text-white/85">{p.aparte}</p>}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
