import type { Metadata } from 'next'
import { Archivo, Inter, JetBrains_Mono } from 'next/font/google'
import { I18nProvider } from '@/lib/i18n'
import './globals.css'

const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export const metadata: Metadata = {
  title: 'Delta Analytics — Inteligencia que construye decisiones',
  description: 'Automatizamos procesos, reducimos costos operativos y convertimos datos en decisiones.',
  metadataBase: new URL('https://www.deltaanalytics.com.mx'),
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Delta Analytics — Inteligencia que construye decisiones',
    description: 'Automatizamos procesos, reducimos costos operativos y convertimos datos en decisiones.',
    url: 'https://www.deltaanalytics.com.mx',
    siteName: 'Delta Analytics',
    locale: 'es_MX',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${archivo.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
