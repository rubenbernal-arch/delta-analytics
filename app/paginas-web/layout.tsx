import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Páginas web a la medida — Delta Analytics',
  description:
    'Diseñamos y desarrollamos páginas web enfocadas en generar resultados reales. Entrega en 5 días hábiles, dominio del primer año incluido.',
  alternates: { canonical: '/paginas-web' },
  robots: { index: false, follow: false },
}

export default function PaginasWebLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
