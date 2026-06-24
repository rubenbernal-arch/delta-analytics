export function About() {
  return (
    <section
      id="quienes"
      className="border-t border-[var(--line)]"
      style={{ background: 'linear-gradient(180deg, #070A14, #0F1429 140%)' }}
    >
      <div className="section-inner">
        <p className="eyebrow">Quiénes somos</p>
        <h2
          className="font-display font-semibold leading-[1.15] tracking-tight mb-10"
          style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', maxWidth: 800, letterSpacing: '-0.01em' }}
        >
          Un equipo que construye<br />donde otros solo automatizan.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-12 items-start">
          <p className="text-muted text-[1.15rem] max-w-[540px]">
            Delta Analytics es una empresa de tecnología fundada por un equipo de estudiantes y
            desarrolladores que decidió convertir problemas reales en software que funciona. No
            partimos de una idea abstracta de "innovación": partimos de procesos que vimos fallar
            de cerca —análisis financiero lento, gestión clínica desordenada— y construimos la
            herramienta que faltaba.
          </p>

          <div className="flex flex-col gap-[1.6rem]">
            {[
              { num: '3',    label: 'sistemas en producción' },
              { num: '100%', label: 'desarrollo propio' },
              { num: 'Δ',    label: 'IA aplicada a problemas reales' },
            ].map(({ num, label }) => (
              <div key={label} className="flex flex-col border-l-2 border-accent pl-5">
                <span className="font-mono text-[1.8rem] font-medium text-accent-2">{num}</span>
                <span className="text-muted text-[0.85rem]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
