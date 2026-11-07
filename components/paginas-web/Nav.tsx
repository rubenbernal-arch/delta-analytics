export function Nav() {
  const links = [
    { href: '#servicios', label: 'Servicios' },
    { href: '#proyectos', label: 'Proyectos' },
    { href: '#proceso', label: 'Proceso' },
    { href: '#faq', label: 'FAQ' },
  ]

  return (
    <header className="relative z-20 border-b border-[var(--line)]">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 lg:px-[72px]">
        <a href="#top" className="flex items-center gap-2.5 font-display font-bold text-[1.25rem] tracking-tight">
          <span className="text-accent text-[1.4rem] leading-none">▲</span>
          <span>DELTA ANALYTICS</span>
        </a>

        <nav className="hidden items-center gap-10 text-[0.95rem] text-foreground/90 md:flex" aria-label="Navegación de la página">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-accent transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#cotiza"
          className="hidden items-center gap-2 rounded-full border border-accent px-5 py-2.5 text-[0.95rem] font-medium text-accent transition-colors hover:bg-accent hover:text-[#14161A] md:inline-flex"
        >
          Solicitar diagnóstico gratuito <span aria-hidden="true">→</span>
        </a>
      </div>
    </header>
  )
}
