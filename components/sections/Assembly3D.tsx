'use client'

/**
 * Assembly3D — Spline neural-network scene + scroll-driven narrative.
 *
 * The Spline scene here is a placeholder. To replace it:
 * 1. Open https://community.spline.design and find a "neural network" /
 *    "particles network" scene.
 * 2. Add a text/geometry object "Δ" in the center with a glow material,
 *    positioned as the central node of the network.
 * 3. Export → Public URL → copy the .splinecode URL.
 * 4. Replace SCENE_URL below.
 *
 * TODO: Replace SCENE_URL with a custom particles → neural-network scene
 *       featuring the Δ symbol at the center node.
 */

import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from 'framer-motion'
import { SplineScene } from '@/components/ui/splite'

/* ── Scene URL ───────────────────────────────────────────── */
// Source: https://21st.dev/community/components/serafim/splite — dark bg scene
// TODO: replace with a neural-network / particles scene (see file header above)
const SCENE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

/* ── Narrative steps (from the original HTML) ─────────────── */
const STEPS = [
  {
    eyebrow: '00 / PUNTO DE PARTIDA',
    title:   'Antes de Delta',
    body:    'Hojas de cálculo. Mensajes de WhatsApp con cifras. Una decisión que debía tomarse hoy, tomada tres días tarde.',
  },
  {
    eyebrow: '01 / INGESTA',
    title:   'Cada dato, en un solo lugar',
    body:    'Conectamos las fuentes que antes vivían separadas. Sin copiar y pegar, sin perder nada en el camino.',
  },
  {
    eyebrow: '02 / ANÁLISIS',
    title:   'La IA hace el trabajo pesado',
    body:    'Modelos entrenados para leer patrones que a un humano le tomaría horas encontrar — en segundos.',
  },
  {
    eyebrow: '03 / EN VIVO',
    title:   'Esto ya está corriendo',
    body:    'No es una maqueta. Es TradeIQ Pro y OdontoBot, trabajando ahora mismo para quienes los usan.',
  },
]

/* ── Step text (fades in/out based on scroll progress) ─────── */
function StepText({
  step,
  index,
  progress,
}: {
  step: (typeof STEPS)[0]
  index: number
  progress: MotionValue<number>
}) {
  const n = STEPS.length
  const pad = 0.06

  // Each step owns its 25% band; fade on the edges
  const opacity = useTransform(
    progress,
    [index / n - pad, index / n + pad, (index + 1) / n - pad, (index + 1) / n + pad],
    [0, 1, 1, 0],
  )
  const y = useTransform(
    progress,
    [index / n - pad, index / n + pad],
    [14, 0],
  )

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      style={{ opacity, y }}
      aria-hidden={index !== 0}
    >
      <span className="eyebrow mb-2">{step.eyebrow}</span>
      <h3
        className="font-display font-semibold text-foreground mb-3 leading-tight"
        style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
      >
        {step.title}
      </h3>
      <p className="text-muted text-base leading-relaxed max-w-[340px]">{step.body}</p>
    </motion.div>
  )
}

/* ── Dot indicator ─────────────────────────────────────────── */
function Dot({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const n = STEPS.length
  const isActive = useTransform(progress, (v) => {
    const step = Math.min(Math.floor(v * n), n - 1)
    return step === index ? 1 : 0
  })

  return (
    <motion.span
      className="block w-[6px] h-[6px] rounded-full bg-[var(--line-strong)]"
      style={{
        backgroundColor: useTransform(isActive, (a) =>
          a === 1 ? '#7CF5D4' : 'rgba(232,234,242,0.16)',
        ),
        scale: useTransform(isActive, [0, 1], [1, 1.5]),
      }}
    />
  )
}

/* ── Assembly3D ───────────────────────────────────────────── */
export function Assembly3D() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Smooth the raw scroll value so animations feel physical
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 28 })

  // Scene enter / parallax
  const sceneOpacity = useTransform(progress, [0, 0.15], [0, 1])
  const sceneScale   = useTransform(progress, [0, 0.6, 1], [0.9, 1.0, 1.06])
  const sceneBlurNum = useTransform(progress, [0, 0.2], [24, 0])
  const sceneFilter  = useTransform(sceneBlurNum, (v) => `blur(${v.toFixed(1)}px)`)

  return (
    <section
      ref={containerRef}
      id="assembly"
      className="relative bg-base"
      style={{ height: '450vh' }}
    >
      {/* ── Sticky viewport ───────────────────────────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Spline scene — right side / background */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ opacity: sceneOpacity, scale: sceneScale, filter: sceneFilter }}
        >
          {/* Gradient mask so the scene bleeds naturally into the page bg */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, #070A14 22%, rgba(7,10,20,0.5) 55%, transparent 80%), linear-gradient(0deg, #070A14 0%, transparent 15%)',
            }}
          />
          <SplineScene scene={SCENE_URL} className="w-full h-full" />
        </motion.div>

        {/* Step text — left panel */}
        <div className="absolute inset-0 z-20 flex items-center px-[6vw] md:px-[8vw]">
          <div className="relative h-40 w-full max-w-sm">
            {STEPS.map((step, i) => (
              <StepText key={i} step={step} index={i} progress={progress} />
            ))}
          </div>
        </div>

        {/* Progress dots — far left */}
        <div className="absolute left-9 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-[0.9rem]">
          {STEPS.map((_, i) => (
            <Dot key={i} index={i} progress={progress} />
          ))}
        </div>

        {/* Bottom gradient fade into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(transparent, #070A14)' }}
        />
      </div>
    </section>
  )
}
