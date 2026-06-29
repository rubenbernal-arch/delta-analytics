'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

const translations = {
  es: {
    nav: { about: 'Quiénes somos', mission: 'Misión', products: 'Productos', contact: 'Contacto' },
    hero: {
      eyebrow: 'Delta Analytics',
      title: 'Tu empresa opera más rápido,\ncon más inteligencia y mejores decisiones',
      subtitle: 'Automatizamos procesos, reducimos costos operativos y convertimos datos en decisiones — para que tu empresa opere a una escala imposible para humanos solos.',
      cta: 'Hablemos de tu proyecto',
      cta2: 'Ver productos ↓',
      scroll: 'scroll para ver cómo construimos',
    },
    steps: [
      { eyebrow: '00 / EL PROBLEMA', title: 'Tu equipo pierde horas en tareas que debería hacer una máquina', body: 'Procesos manuales, datos dispersos, decisiones lentas. Cada hora perdida es dinero que no regresa.' },
      { eyebrow: '01 / LA SOLUCIÓN', title: 'Automatizamos lo repetitivo para que tu equipo haga lo que importa', body: 'Conectamos tus procesos, integramos tus datos y construimos el sistema que opera por ti.' },
      { eyebrow: '02 / EL RESULTADO', title: 'Menos costos. Más velocidad. Decisiones en tiempo real', body: 'Nuestros clientes reducen horas de trabajo manual y obtienen información accionable al instante.' },
      { eyebrow: '03 / EN PRODUCCIÓN', title: 'Ya está corriendo para empresas reales', body: '4 sistemas activos hoy. No vendemos promesas — entregamos software que ya está generando resultados.' },
    ],
    about: {
      eyebrow: 'Quiénes somos',
      title: 'Un equipo que construye donde otros solo automatizan.',
      body: 'Delta Analytics es una empresa de tecnología fundada por un equipo de estudiantes y desarrolladores que decidió convertir problemas reales en software que funciona. No partimos de una idea abstracta de "innovación": partimos de procesos que vimos fallar de cerca —análisis financiero lento, gestión clínica desordenada— y construimos la herramienta que faltaba.',
      stats: [{ num: '4', label: 'sistemas en producción' }, { num: '100%', label: 'desarrollo propio' }, { num: 'Δ', label: 'IA aplicada a problemas reales' }],
    },
    mission: {
      missionLabel: 'Misión', missionBody: 'Reducir el costo operativo de las empresas mediante automatización con IA — entregando software que funciona desde el primer día, sin proyectos eternos ni consultoras de relleno.',
      visionLabel: 'Visión', visionBody: 'Ser la empresa que demuestra que tres personas con las herramientas correctas pueden hacer lo que antes requería un departamento entero — y vender ese modelo a quien lo necesite.',
    },
    products: {
      eyebrow: 'Lo que construimos', title: 'Cuatro productos.', title2: 'Un mismo enfoque.', subtitle: 'Cada uno resuelve un problema real. Ninguno es una maqueta.', available: 'Disponible para clientes',
      items: [
        { id: 'tradeiq', tag: 'FINTECH · IA', name: 'TradeIQ Pro', desc: 'Plataforma de análisis de trading potenciada por IA. Señales estructuradas con entry, stop-loss y take-profit, scoring de confianza en múltiples temporalidades y chat con IA para validar setups en tiempo real.', link: 'https://tradeiqpro.com', linkLabel: 'tradeiqpro.com', accent: 'rgba(91,141,255,0.20)', accentColor: '#5B8DFF', tags: ['Forex', 'Crypto', 'Acciones', 'Futuros'] },
        { id: 'odonto', tag: 'SALUD · GESTIÓN', name: 'OdontoBot', desc: 'Automatización completa para clínicas dentales: agente de voz para citas, WhatsApp inteligente para seguimiento de pacientes y CRM sencillo para que el consultorio funcione sin fricción.', link: 'https://odontobot-demo.vercel.app', linkLabel: 'Ver demo →', accent: 'rgba(124,245,212,0.18)', accentColor: '#7CF5D4', tags: ['Clínicas dentales', 'WhatsApp', 'Voz IA', 'CRM'] },
        { id: 'atum', tag: 'OPERACIONES · IA', name: 'ATUM', desc: 'Sistema operativo de inteligencia para empresas. Dashboards de analítica, inteligencia de mercado, Google Analytics integrado y automatización de decisiones operativas en tiempo real.', link: null, linkLabel: null, accent: 'rgba(255,107,91,0.16)', accentColor: '#FF6B5B', tags: ['Analytics', 'Market Intel', 'Dashboards', 'Automatización'] },
        { id: 'sales', tag: 'VENTAS · OUTBOUND', name: 'Delta Sales Agent', desc: 'Pipeline de ventas autónomo. Scraping de leads, agente de voz outbound, seguimiento por WhatsApp y CRM integrado — todo conectado para cerrar clientes sin intervención manual.', link: null, linkLabel: null, accent: 'rgba(91,141,255,0.12)', accentColor: '#5B8DFF', tags: ['Lead gen', 'Voz IA', 'WhatsApp', 'CRM'] },
      ],
    },
    contact: {
      eyebrow: 'Contacto', title: '¿Tienes un problema que vale la pena resolver con IA?', subtitle: 'Cuéntanos qué necesitas. Respondemos personalmente — sin formularios automáticos de relleno.',
      name: 'Nombre', email: 'Correo', company: 'Empresa', companyOptional: '(opcional)', message: 'Mensaje',
      namePlaceholder: 'Tu nombre', emailPlaceholder: 'tucorreo@ejemplo.com', companyPlaceholder: 'Nombre de tu empresa', messagePlaceholder: 'Cuéntanos sobre tu proyecto o necesidad...',
      send: 'Enviar mensaje', sending: 'Enviando', sent: '✓ Mensaje enviado', thanks: 'Gracias. Te respondemos en menos de 24 horas.',
      locationLabel: 'Ubicación', location: 'Guadalajara, Jalisco · México', followLabel: 'Síguenos', productsLabel: 'Productos',
    },
    footer: { tagline: 'Construido con datos, IA y café.' },
  },
  en: {
    nav: { about: 'About us', mission: 'Mission', products: 'Products', contact: 'Contact' },
    hero: {
      eyebrow: 'Delta Analytics',
      title: 'Your company moves faster,\nwith more intelligence and better decisions',
      subtitle: 'We automate processes, reduce operating costs and turn data into decisions — so your company operates at a scale impossible for humans alone.',
      cta: "Let's talk about your project",
      cta2: 'See products ↓',
      scroll: 'scroll to see how we build',
    },
    steps: [
      { eyebrow: '00 / THE PROBLEM', title: 'Your team wastes hours on tasks a machine should handle', body: 'Manual processes, scattered data, slow decisions. Every lost hour is money that does not come back.' },
      { eyebrow: '01 / THE SOLUTION', title: 'We automate the repetitive so your team does what matters', body: 'We connect your processes, integrate your data and build the system that runs for you.' },
      { eyebrow: '02 / THE RESULT', title: 'Lower costs. More speed. Real-time decisions', body: 'Our clients cut hours of manual work and get actionable information instantly.' },
      { eyebrow: '03 / IN PRODUCTION', title: 'Already running for real companies', body: '4 active systems today. We do not sell promises — we deliver software that is already generating results.' },
    ],
    about: {
      eyebrow: 'About us',
      title: 'A team that builds where others just automate.',
      body: 'Delta Analytics is a technology company founded by a team of students and developers who decided to turn real problems into software that works. We did not start from an abstract idea of innovation — we started from processes we saw fail up close: slow financial analysis, disorganized clinic management. And we built the tool that was missing.',
      stats: [{ num: '4', label: 'systems in production' }, { num: '100%', label: 'in-house development' }, { num: 'Δ', label: 'AI applied to real problems' }],
    },
    mission: {
      missionLabel: 'Mission', missionBody: 'Reduce the operational cost of companies through AI automation — delivering software that works from day one, without endless projects or filler consultants.',
      visionLabel: 'Vision', visionBody: 'Be the company that proves three people with the right tools can do what used to require an entire department — and sell that model to whoever needs it.',
    },
    products: {
      eyebrow: 'What we build', title: 'Four products.', title2: 'One approach.', subtitle: 'Each one solves a real problem. None of them is a mockup.', available: 'Available for clients',
      items: [
        { id: 'tradeiq', tag: 'FINTECH · AI', name: 'TradeIQ Pro', desc: 'AI-powered trading analysis platform. Structured signals with entry, stop-loss and take-profit, confidence scoring across multiple timeframes and AI chat to validate setups in real time.', link: 'https://tradeiqpro.com', linkLabel: 'tradeiqpro.com', accent: 'rgba(91,141,255,0.20)', accentColor: '#5B8DFF', tags: ['Forex', 'Crypto', 'Stocks', 'Futures'] },
        { id: 'odonto', tag: 'HEALTH · MANAGEMENT', name: 'OdontoBot', desc: 'Full automation for dental clinics: voice agent for appointments, smart WhatsApp for patient follow-up and a simple CRM so the office runs without friction.', link: 'https://odontobot-demo.vercel.app', linkLabel: 'See demo →', accent: 'rgba(124,245,212,0.18)', accentColor: '#7CF5D4', tags: ['Dental clinics', 'WhatsApp', 'Voice AI', 'CRM'] },
        { id: 'atum', tag: 'OPERATIONS · AI', name: 'ATUM', desc: 'Intelligence operating system for companies. Analytics dashboards, market intelligence, Google Analytics integrated and real-time operational decision automation.', link: null, linkLabel: null, accent: 'rgba(255,107,91,0.16)', accentColor: '#FF6B5B', tags: ['Analytics', 'Market Intel', 'Dashboards', 'Automation'] },
        { id: 'sales', tag: 'SALES · OUTBOUND', name: 'Delta Sales Agent', desc: 'Autonomous sales pipeline. Lead scraping, outbound voice agent, WhatsApp follow-up and integrated CRM — all connected to close clients without manual intervention.', link: null, linkLabel: null, accent: 'rgba(91,141,255,0.12)', accentColor: '#5B8DFF', tags: ['Lead gen', 'Voice AI', 'WhatsApp', 'CRM'] },
      ],
    },
    contact: {
      eyebrow: 'Contact', title: 'Do you have a problem worth solving with AI?', subtitle: 'Tell us what you need. We respond personally — no automated filler forms.',
      name: 'Name', email: 'Email', company: 'Company', companyOptional: '(optional)', message: 'Message',
      namePlaceholder: 'Your name', emailPlaceholder: 'youremail@example.com', companyPlaceholder: 'Your company name', messagePlaceholder: 'Tell us about your project or need...',
      send: 'Send message', sending: 'Sending', sent: '✓ Message sent', thanks: 'Thanks. We will get back to you within 24 hours.',
      locationLabel: 'Location', location: 'Guadalajara, Jalisco · Mexico', followLabel: 'Follow us', productsLabel: 'Products',
    },
    footer: { tagline: 'Built with data, AI and coffee.' },
  },
}

type Locale = 'es' | 'en'
type Translations = typeof translations.es

const I18nContext = createContext<{ t: Translations; locale: Locale; setLocale: (l: Locale) => void }>({
  t: translations.es, locale: 'es', setLocale: () => {},
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('es')
  return (
    <I18nContext.Provider value={{ t: translations[locale], locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
