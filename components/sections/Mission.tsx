'use client'

import { useI18n } from '@/lib/i18n'

export function Mission() {
  const { t } = useI18n()
  return (
    <section id="mision" className="border-t border-[var(--line)]">
      <div className="section-inner">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-2xl overflow-hidden border border-[var(--line)]"
          style={{ background: 'var(--line)' }}
        >
          {[
            {
              label: 'Misión',
              body:  'Reducir el costo operativo de las empresas mediante automatización con IA — entregando software que funciona desde el primer día, sin proyectos eternos ni consultoras de relleno.',
            },
            {
              label: 'Visión',
              body:  'Ser la empresa que demuestra que tres personas con las herramientas correctas pueden hacer lo que antes requería un departamento entero — y vender ese modelo a quien lo necesite.',
            },
          ].map(({ label, body }) => (
            <div key={label} className="bg-surface p-12 md:p-12">
              <p className="eyebrow">{label}</p>
              <p className="font-display font-medium leading-[1.4] text-foreground" style={{ fontSize: '1.3rem', letterSpacing: '-0.005em' }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
