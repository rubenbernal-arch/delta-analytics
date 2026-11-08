'use client'

import { Globe, MessageCircle, Palette, Rocket, Smartphone, Wrench, type LucideIcon } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'
import { Revelar } from './Movimiento'
import { serif } from './fuentes'

const items: { n: string; icono: LucideIcon; t: string; d: string }[] = [
  { n: '01', icono: Palette, t: 'Diseño a la medida', d: 'Con tu marca, tus colores y tus fotos. No una plantilla igual a la de todos.' },
  { n: '02', icono: Smartphone, t: 'Hecha para celular', d: 'Se ve y funciona bien en el teléfono, donde hoy te buscan tus clientes.' },
  { n: '03', icono: MessageCircle, t: 'Contacto directo', d: 'Botón de WhatsApp y formulario para que te escriban en un toque.' },
  { n: '04', icono: Globe, t: 'Dominio incluido', d: 'Tu dominio el primer año va incluido en el precio.' },
  { n: '05', icono: Rocket, t: 'En línea en 5 días', d: 'Del brief a la publicación en 5 días hábiles.' },
  { n: '06', icono: Wrench, t: 'Mantenimiento mensual', d: 'Después del primer mes, mantenimiento por $890 + IVA al mes.' },
]

const lista: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const subir: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export function Servicios() {
  return (
    <section id="servicios" className="relative overflow-x-clip border-t border-[var(--line)] bg-base">
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 py-20 lg:px-[72px] lg:py-28">
        <div className="flex items-center justify-between font-mono text-[0.72rem] uppercase tracking-[0.16em] text-white/70">
          <span className="flex items-center gap-2">
            <span className="text-accent" aria-hidden="true">▲</span> Qué incluye
          </span>
          <span>06 puntos</span>
        </div>

        <div className="mb-14 mt-10 lg:mb-20 lg:mt-14">
          <h2 className="font-display text-[clamp(44px,9.5vw,140px)] font-extrabold uppercase leading-[0.88] tracking-[-0.03em] text-white">
            <Revelar>Todo lo que</Revelar>
          </h2>
          <p className={`${serif.className} mt-2 text-[clamp(34px,6.2vw,92px)] italic leading-[1] text-white/90`}>
            <Revelar retraso={0.15}>necesita tu página.</Revelar>
          </p>
        </div>

        <motion.ul
          variants={lista}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map(({ n, icono: Icono, t, d }) => (
            <motion.li key={n} variants={subir} className="border-t border-white/15 py-8 lg:py-10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.75rem] tracking-[0.16em] text-accent">{n}</span>
                <Icono className="h-5 w-5 text-white/60" aria-hidden="true" />
              </div>
              <h3 className="mt-6 font-display text-[clamp(24px,2.4vw,34px)] font-extrabold uppercase leading-[0.98] tracking-tight text-white">
                {t}
              </h3>
              <p className="mt-3 max-w-[34ch] text-[0.98rem] leading-relaxed text-muted">{d}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
