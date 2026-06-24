export function Mission() {
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
              body:  'Diseñar e implementar soluciones de inteligencia artificial y análisis de datos que resuelvan problemas concretos de personas y empresas, sin complejidad innecesaria.',
            },
            {
              label: 'Visión',
              body:  'Ser el equipo de referencia en Latinoamérica para construir productos de IA que pasan de la idea al uso real, en sectores donde la tecnología todavía no ha llegado bien.',
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
