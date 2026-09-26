'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

const translations = {
  es: {
    nav: { solutions: 'Soluciones', products: 'Portafolio', security: 'Seguridad', about: 'Nosotros', contact: 'Hablemos' },
    hero: {
      eyebrow: 'Software · Automatización · IA',
      title: 'Menos tareas manuales.\nMás posibilidades.',
      subtitle: 'Desarrollamos software e integramos tus procesos para que tu empresa avance.',
      cta: 'Hablemos de tu proyecto',
      cta2: 'Explorar portafolio',
    },
    logos: {
      eyebrow: 'Empresas que nos respaldan',
      items: [
        { name: 'TLA', src: '/TLA.png', forceBlack: true },
        { name: 'La Herencia', src: '/la%20herencia.png' },
        { name: 'La Puerta', src: '/lapuerta.png' },
        { name: 'Josefinos', src: '/josefinos.png' },
        { name: 'Awasa', src: '/awasa.png' },
        { name: 'Ferretería', src: '/ferreteria.png' },
      ],
    },
    about: {
      eyebrow: 'Quiénes somos',
      title: 'Un equipo que resuelve, no que promete.',
      body: 'Delta Analytics nació de ver procesos fallar de cerca: análisis financiero que llegaba tarde, facturación hecha a mano, operaciones repartidas en diez hojas de Excel. En lugar de hablar de "innovación", construimos la herramienta que faltaba.',
      stats: [{ num: '6+', label: 'proyectos en portafolio' }, { num: '100%', label: 'desarrollo propio' }],
    },
    mission: {
      missionLabel: 'Misión', missionBody: 'Reducir el costo operativo de las empresas con automatización e IA: software que resuelve un problema concreto, en semanas y no en años, sin proyectos eternos.',
      visionLabel: 'Visión', visionBody: 'Que cualquier empresa, sin importar su tamaño, opere con la eficiencia de una mucho más grande, con equipos pequeños y herramientas que trabajan por ellos.',
    },
    products: {
      eyebrow: 'Portafolio', title: 'De una necesidad real', title2: 'a software que funciona.', viewAll: 'Ver todos los proyectos ↗', available: 'Disponible para clientes',
      items: [
        // TODO: public/atum.png es una imagen estática con métricas de ejemplo en $0 / 0 founders — reemplázala por una captura con datos demo creíbles.
        { id: 'atum', icon: 'delta' as const, image: '/atum.png', tag: 'OPERACIONES · IA', name: 'ATUM', subtitle: 'Inteligencia para tu operación.', desc: 'Inventario, clientes, ventas y facturación en un solo panel, con un agente de IA al que le preguntas cómo va tu operación.', link: null, linkLabel: null, accentColor: '#FF8000', tags: ['Operaciones', 'Inventario', 'Facturación'] },
        { id: 'tradeiq', icon: 'chart' as const, image: '/tradeiq.png', tag: 'FINTECH · IA', name: 'TradeIQ Pro', subtitle: 'Análisis financiero con IA.', desc: 'Indicadores técnicos, señales y contexto de mercado resumidos por IA, para que analices en minutos lo que antes te tomaba horas.', link: 'https://tradeiqpro.com', linkLabel: 'tradeiqpro.com', accentColor: '#3D6DA6', tags: ['Datos financieros', 'IA', 'Reportes'] },
        { id: 'shubati', icon: 'whatsapp' as const, image: '/shubati.png', tag: 'FACTURACIÓN · IA', name: 'Shubati', subtitle: 'Facturación desde WhatsApp.', desc: 'Mándale una foto de tu ticket por WhatsApp y recibe tu factura timbrada, PDF y XML, en segundos.', link: 'https://www.shubati.mx/', linkLabel: 'shubati.mx', accentColor: '#2E8C6F', tags: ['WhatsApp', 'Facturación', 'Clientes'] },
      ],
    },
    security: {
      eyebrow: 'Ciberseguridad',
      title: 'Atacamos tus sistemas', title2: 'antes que alguien más lo haga.',
      subtitle: 'Sabemos cómo atacan porque llevamos años defendiendo — combinamos experiencia en SOC con pentesting certificado.',
      offensive: {
        tag: 'Ofensiva',
        title: 'Ofensiva',
        desc: 'Pentesting en modalidad black box, gray box y white box, red team y análisis de vulnerabilidades en aplicaciones web, redes e infraestructura.',
        tags: ['Black box', 'Gray box', 'White box', 'Red team'],
      },
      defensive: {
        tag: 'Defensiva',
        title: 'Defensiva',
        desc: 'Blue team, monitoreo y detección, y respuesta a incidentes.',
        tags: ['Blue team', 'Monitoreo', 'Detección', 'Respuesta a incidentes'],
      },
      credibility: [
        { label: 'Experiencia', body: 'Años de experiencia en operaciones de SOC: monitoreo, detección y respuesta a incidentes.' },
        { label: 'Certificación', body: 'Pentester certificado eJPT.' },
        { label: 'Metodología', body: 'OWASP, PTES y MITRE ATT&CK como marco de referencia.' },
      ],
      deliverables: 'Reporte ejecutivo y reporte técnico con evidencias y severidad de cada hallazgo, más un retest después de las correcciones. Todo el trabajo se realiza bajo NDA.',
      process: [
        { num: '01', title: 'Alcance', desc: 'Definimos qué se evalúa y bajo qué modalidad (black, gray o white box).' },
        { num: '02', title: 'Pruebas', desc: 'Ejecutamos las pruebas siguiendo OWASP, PTES y MITRE ATT&CK.' },
        { num: '03', title: 'Reporte', desc: 'Reporte ejecutivo y técnico, con evidencias y severidad de cada hallazgo.' },
        { num: '04', title: 'Retest', desc: 'Verificamos que las correcciones cierren las vulnerabilidades encontradas.' },
      ],
      cta: 'Agenda una evaluación de seguridad',
    },
    features: {
      eyebrow: 'Cómo trabajamos',
      title: 'Tecnología que', title2: 'conecta tu negocio.',
      items: [
        { title: 'Automatización', desc: 'Conecta tus herramientas y elimina tareas manuales.' },
        { title: 'Software a medida', desc: 'Soluciones diseñadas para tus procesos.' },
        { title: 'Analítica e IA', desc: 'Convierte tus datos en mejores decisiones.' },
      ],
    },
    ctaBand: {
      title: 'Hablemos de lo que sigue.',
      subtitle: 'Cuéntanos sobre tu proyecto y encontremos la mejor forma de hacerlo realidad.',
      button: 'Cuéntanos tu proyecto ↗',
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
    nav: { solutions: 'Solutions', products: 'Portfolio', security: 'Security', about: 'About us', contact: "Let's talk" },
    hero: {
      eyebrow: 'Software · Automation · AI',
      title: 'Fewer manual tasks.\nMore possibilities.',
      subtitle: 'We build software and integrate your processes so your company moves forward.',
      cta: "Let's talk about your project",
      cta2: 'Explore portfolio',
    },
    logos: {
      eyebrow: 'Companies that back us',
      items: [
        { name: 'TLA', src: '/TLA.png', forceBlack: true },
        { name: 'La Herencia', src: '/la%20herencia.png' },
        { name: 'La Puerta', src: '/lapuerta.png' },
        { name: 'Josefinos', src: '/josefinos.png' },
        { name: 'Awasa', src: '/awasa.png' },
        { name: 'Ferretería', src: '/ferreteria.png' },
      ],
    },
    about: {
      eyebrow: 'About us',
      title: 'A team that solves, not just promises.',
      body: 'Delta Analytics was born from watching processes fail up close: financial analysis that arrived too late, invoicing done by hand, operations scattered across ten spreadsheets. Instead of talking about "innovation," we built the tool that was missing.',
      stats: [{ num: '6+', label: 'projects in portfolio' }, { num: '100%', label: 'in-house development' }],
    },
    mission: {
      missionLabel: 'Mission', missionBody: "Reduce companies' operating costs with automation and AI: software that solves a specific problem in weeks, not years, without endless projects.",
      visionLabel: 'Vision', visionBody: 'That any company, regardless of size, can operate with the efficiency of a much bigger one, using small teams and tools that work for them.',
    },
    products: {
      eyebrow: 'Portfolio', title: 'From a real need', title2: 'to software that works.', viewAll: 'View all projects ↗', available: 'Available for clients',
      items: [
        { id: 'atum', icon: 'delta' as const, image: '/atum.png', tag: 'OPERATIONS · AI', name: 'ATUM', subtitle: 'Intelligence for your operation.', desc: 'Inventory, clients, sales and invoicing in one panel, with an AI agent you can simply ask how your operation is doing.', link: null, linkLabel: null, accentColor: '#FF8000', tags: ['Operations', 'Inventory', 'Invoicing'] },
        { id: 'tradeiq', icon: 'chart' as const, image: '/tradeiq.png', tag: 'FINTECH · AI', name: 'TradeIQ Pro', subtitle: 'Financial analysis with AI.', desc: 'Technical indicators, signals and market context summarized by AI, so you analyze in minutes what used to take hours.', link: 'https://tradeiqpro.com', linkLabel: 'tradeiqpro.com', accentColor: '#3D6DA6', tags: ['Financial data', 'AI', 'Reports'] },
        { id: 'shubati', icon: 'whatsapp' as const, image: '/shubati.png', tag: 'INVOICING · AI', name: 'Shubati', subtitle: 'Invoicing from WhatsApp.', desc: 'Send a photo of your receipt over WhatsApp and get your stamped invoice, PDF and XML, in seconds.', link: 'https://www.shubati.mx/', linkLabel: 'shubati.mx', accentColor: '#2E8C6F', tags: ['WhatsApp', 'Invoicing', 'Clients'] },
      ],
    },
    security: {
      eyebrow: 'Cybersecurity',
      title: 'We attack your systems', title2: 'before someone else does.',
      subtitle: 'We know how attackers think because we\'ve spent years defending — combining SOC experience with certified pentesting.',
      offensive: {
        tag: 'Offensive',
        title: 'Offensive',
        desc: 'Black box, gray box and white box pentesting, red team, and vulnerability assessments across web apps, networks and infrastructure.',
        tags: ['Black box', 'Gray box', 'White box', 'Red team'],
      },
      defensive: {
        tag: 'Defensive',
        title: 'Defensive',
        desc: 'Blue team, monitoring and detection, and incident response.',
        tags: ['Blue team', 'Monitoring', 'Detection', 'Incident response'],
      },
      credibility: [
        { label: 'Experience', body: 'Years of experience in SOC operations: monitoring, detection and incident response.' },
        { label: 'Certification', body: 'Certified eJPT pentester.' },
        { label: 'Methodology', body: 'OWASP, PTES and MITRE ATT&CK as reference frameworks.' },
      ],
      deliverables: 'An executive report and a technical report with evidence and severity for each finding, plus a retest after fixes. All work is done under NDA.',
      process: [
        { num: '01', title: 'Scope', desc: 'We define what gets tested and under which mode (black, gray or white box).' },
        { num: '02', title: 'Testing', desc: 'We run the tests following OWASP, PTES and MITRE ATT&CK.' },
        { num: '03', title: 'Report', desc: 'Executive and technical reports, with evidence and severity for each finding.' },
        { num: '04', title: 'Retest', desc: 'We verify the fixes actually close the vulnerabilities found.' },
      ],
      cta: 'Book a security assessment',
    },
    features: {
      eyebrow: 'How we work',
      title: 'Technology that', title2: 'connects your business.',
      items: [
        { title: 'Automation', desc: 'Connect your tools and remove manual tasks.' },
        { title: 'Custom software', desc: 'Solutions designed for your processes.' },
        { title: 'Analytics & AI', desc: 'Turn your data into better decisions.' },
      ],
    },
    ctaBand: {
      title: "Let's talk about what's next.",
      subtitle: 'Tell us about your project and let\'s find the best way to make it real.',
      button: 'Tell us about your project ↗',
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
