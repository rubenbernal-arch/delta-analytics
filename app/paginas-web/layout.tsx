import type { Metadata } from 'next'
import { Analitica } from '../../components/paginas-web/Analitica'

const TITULO = 'Páginas web a la medida | Delta Analytics'
const DESCRIPCION =
  'Diseñamos y desarrollamos páginas web enfocadas en generar resultados reales. Entrega en 5 días hábiles, dominio del primer año incluido.'

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: '/paginas-web' },
  // Cuando el formulario funcione de punta a punta: cambiar a { index: true, follow: true }
  robots: { index: false, follow: false },
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: 'https://www.deltaanalytics.com.mx/paginas-web',
    siteName: 'Delta Analytics',
    locale: 'es_MX',
    type: 'website',
    images: [{ url: 'https://www.deltaanalytics.com.mx/paginas-web/devices-hero-1200.webp' }],
  },
  twitter: { card: 'summary_large_image', title: TITULO, description: DESCRIPCION },
}

export default function PaginasWebLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analitica />
    </>
  )
}
