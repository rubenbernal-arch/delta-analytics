const WHATSAPP = 'https://wa.me/523330163038?text=Hola%2C%20quiero%20cotizar%20una%20p%C3%A1gina%20web%20para%20mi%20negocio'

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--line)] bg-base">
      <svg
        className="pointer-events-none absolute -bottom-[40%] -right-[6%] w-[min(620px,70vw)] opacity-[0.07]"
        viewBox="0 0 100 90"
        fill="none"
        aria-hidden="true"
      >
        <polygon points="50,3 97,87 3,87" stroke="#fff" strokeWidth="0.35" />
        <polygon points="50,22 80,78 20,78" stroke="#FF8000" strokeWidth="0.3" />
      </svg>
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-8 px-6 py-14 pb-28 lg:flex-row lg:items-end lg:justify-between lg:px-[72px] lg:pb-14">
        <div>
          <p className="flex items-center gap-2 font-display text-[1.4rem] font-extrabold uppercase tracking-tight text-white">
            <span className="text-accent" aria-hidden="true">▲</span> Delta Analytics
          </p>
          <p className="mt-3 font-mono text-[0.72rem] uppercase leading-relaxed tracking-[0.14em] text-muted">
            Delta Analytics S. de R.L. de C.V.<br />Zapopan, Jalisco, México
          </p>
        </div>
        <nav aria-label="Pie de página" className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-white/70">
          <a href="/aviso-de-privacidad" className="min-h-[44px] py-2 hover:text-white">Aviso de privacidad</a>
          <a href={WHATSAPP} target="_blank" rel="noopener" className="min-h-[44px] py-2 hover:text-white">WhatsApp</a>
          <a href="#top" className="min-h-[44px] py-2 hover:text-white">Volver arriba ↑</a>
        </nav>
      </div>
    </footer>
  )
}
