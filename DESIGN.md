# Delta Analytics — Sistema de diseño

## Paleta (app/globals.css)
- Base: #14161A · Surface: #1F2226 / #2E2E2A
- Acento: #FF8000 (naranja) · Acento 2: #CFCFC9 · Warm/error: #C63F2E
- Texto: #FFFFFF / muted #ABABA4 / dim #63635C
- Sección clara (portafolio/logos): #F2EEE7
- Líneas: rgba(255,255,255,.07) / .14

## Tipografía
- Display: Archivo (headings)
- Sans: Inter (body)
- Mono: JetBrains Mono (eyebrows, tags, datos)

## Layout
- Contenedor: max-width 1140px, `.section-inner` con padding responsivo 6/7/8rem
- Tarjetas: rounded-2xl, border sutil, spotlight en hover (mouse-follow)

## Componentes clave
- SpotlightCard, ImagePlaceholder, DeltaChip (SVG animado del hero)
- ProductCard (destacada + 2 columnas)

## Principios (implícitos, no documentados aún)
- Fondo oscuro dominante con una franja clara para "portafolio"
- CTAs en gradiente naranja, botones outline en dark
- Mobile-first breakpoints de Tailwind
