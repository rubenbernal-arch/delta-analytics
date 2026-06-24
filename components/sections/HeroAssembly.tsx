'use client'

/**
 * HeroAssembly — Unified hero + scroll-narrative section.
 *
 * Architecture:
 *  • One section (550vh) with a sticky 100vh viewport.
 *  • Canvas particles span the entire sticky viewport and animate throughout.
 *  • Hero copy is visible at progress=0 and fades out as scroll begins (~0.15).
 *  • Spline robot is dim at progress=0 (barely emerging from particles) and
 *    fully illuminated by progress=1.0 (stage 03 "En vivo").
 *  • Δ symbol overlaid via CSS/SVG at progress≈0.80, synced with stage 03.
 *
 * Progress windows:
 *   0.00 → 0.18  Hero phase (particles + hero copy visible)
 *   0.18 → 1.00  Narrative phase — 4 steps, each ~0.205 wide
 *     Step 0  0.18 → 0.385  (00 / PUNTO DE PARTIDA)
 *     Step 1  0.385 → 0.59  (01 / INGESTA)
 *     Step 2  0.59 → 0.795  (02 / ANÁLISIS)
 *     Step 3  0.795 → 1.0   (03 / EN VIVO)
 *
 * TODO: Replace SCENE_URL with a custom Spline scene featuring the robot +
 *       Δ symbol as a chest material / emissive node.
 */

import { useEffect, useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from 'framer-motion'
import { SplineScene } from '@/components/ui/splite'

/* ── Scene URL ─────────────────────────────────────────────── */
const SCENE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

/* ── Layout constants ──────────────────────────────────────── */
const NARRATIVE_START = 0.18
const STEP_SIZE       = (1 - NARRATIVE_START) / 4   // ≈ 0.205

/* ── Narrative copy ────────────────────────────────────────── */
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
    body:    'No es una maqueta. Son 3 sistemas en producción, trabajando ahora mismo para quienes los usan.',
  },
]

/* ─────────────────────────────────────────────────────────── */
/*  Particles canvas — identical to original Hero canvas       */
/* ─────────────────────────────────────────────────────────── */
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const COUNT = 46
    let w = 0, h = 0
    let particles: Array<{ x: number; y: number; vx: number; vy: number; r: number; a: number }>
    let animId: number

    function resize() {
      w = canvas!.width  = canvas!.offsetWidth
      h = canvas!.height = canvas!.offsetHeight
    }

    function makeParticles() {
      particles = Array.from({ length: COUNT }, () => ({
        x:  Math.random() * w,
        y:  Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r:  Math.random() * 1.6 + 0.6,
        a:  Math.random() * 0.5 + 0.2,
      }))
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h)

      /* dots */
      for (const p of particles) {
        p.x += p.vx;  p.y += p.vy
        if (p.x < 0) p.x = w;  if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h;  if (p.y > h) p.y = 0
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(124,245,212,${p.a})`
        ctx!.fill()
      }

      /* connecting lines */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 110) {
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.strokeStyle = `rgba(91,141,255,${0.12 * (1 - dist / 110)})`
            ctx!.lineWidth = 1
            ctx!.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ro = new ResizeObserver(() => { resize(); makeParticles() })
    ro.observe(canvas)
    resize()
    makeParticles()
    if (!reduced) animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" aria-hidden />
}

/* ─────────────────────────────────────────────────────────── */
/*  Step text — fades in/out per scroll window                 */
/* ─────────────────────────────────────────────────────────── */
function StepText({
  step,
  index,
  progress,
}: {
  step: (typeof STEPS)[0]
  index: number
  progress: MotionValue<number>
}) {
  const start = NARRATIVE_START + index * STEP_SIZE
  const end   = start + STEP_SIZE
  const pad   = 0.04

  const opacity = useTransform(
    progress,
    [start - pad, start + pad, end - pad, end + pad],
    [0, 1, 1, 0],
  )
  const y = useTransform(progress, [start - pad, start + pad], [14, 0])

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

/* ─────────────────────────────────────────────────────────── */
/*  Progress dot                                               */
/* ─────────────────────────────────────────────────────────── */
function Dot({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const isActive = useTransform(progress, (v) => {
    if (v < NARRATIVE_START) return 0
    const step = Math.min(Math.floor((v - NARRATIVE_START) / STEP_SIZE), STEPS.length - 1)
    return step === index ? 1 : 0
  })

  return (
    <motion.span
      className="block w-[6px] h-[6px] rounded-full"
      style={{
        backgroundColor: useTransform(
          isActive,
          (a) => (a === 1 ? '#7CF5D4' : 'rgba(232,234,242,0.16)'),
        ),
        scale: useTransform(isActive, [0, 1], [1, 1.5]),
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────── */
/*  HeroAssembly                                               */
/* ─────────────────────────────────────────────────────────── */
export function HeroAssembly() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 28 })

  /* ── Hero content ─────────────────────────────────────────── */
  const heroOpacity       = useTransform(progress, [0, 0.06, 0.15], [1, 1, 0])
  const gridOpacity       = useTransform(progress, [0, 0.06, 0.16], [1, 1, 0])
  const scrollHintOpacity = useTransform(progress, [0, 0.04, 0.10], [1, 1, 0])

  /* ── Robot (Spline scene) ─────────────────────────────────── */
  // Opacity: barely there at hero phase → fully visible at stage 03
  const robotOpacity = useTransform(
    progress,
    [0,    0.18,  0.385, 0.59,  0.795, 1.0],
    [0.10, 0.13,  0.40,  0.68,  0.88,  1.0],
  )

  // CSS filter: quick blur-in at start + progressive brightness as robot "emerges"
  // Framer Motion interpolates filter strings when the function signature is identical.
  const robotFilter = useTransform(
    progress,
    [0,     0.10,   0.18,   0.385,  0.59,   0.795,  1.0],
    [
      'blur(8px) brightness(0.28)',
      'blur(0px) brightness(0.30)',
      'blur(0px) brightness(0.33)',
      'blur(0px) brightness(0.60)',
      'blur(0px) brightness(0.88)',
      'blur(0px) brightness(1.18)',
      'blur(0px) brightness(1.38)',
    ],
  )

  /* ── Rim-light glow behind robot ─────────────────────────── */
  const rimOpacity = useTransform(
    progress,
    [NARRATIVE_START, 0.385, 0.59,  0.795, 1.0],
    [0,               0.18,  0.45,  0.72,  1.0],
  )

  /* ── Δ symbol (stage 03 "En vivo") ───────────────────────── */
  const deltaOpacity = useTransform(progress, [0.78, 0.88], [0, 1])
  const deltaScale   = useTransform(progress, [0.78, 0.90], [0.72, 1.0])

  /* ── Narrative panel + dots ───────────────────────────────── */
  const narrativeOpacity = useTransform(progress, [0.12, 0.22], [0, 1])

  return (
    <section
      ref={containerRef}
      id="top"
      className="relative"
      style={{ height: '550vh' }}
    >
      {/* ── Sticky viewport ──────────────────────────────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* 0 — Particle field (always animating) */}
        <Particles />

        {/* 1 — Drifting grid (fades with hero) */}
        <motion.div
          className="absolute inset-[-20%] pointer-events-none"
          style={{
            zIndex: 1,
            opacity: gridOpacity,
            backgroundImage:
              'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(circle at 50% 40%, black 10%, transparent 65%)',
            animation: 'grid-drift 40s linear infinite',
          }}
          aria-hidden
        />

        {/* 2 — Rim-light glow (intensifies through narrative stages) */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            opacity: rimOpacity,
            background:
              'radial-gradient(ellipse 48% 62% at 66% 44%, rgba(91,141,255,0.32), rgba(124,245,212,0.20) 42%, transparent 68%)',
          }}
          aria-hidden
        />

        {/* 3 — Spline robot (dims → illuminates) */}
        <motion.div
          className="absolute inset-0"
          style={{ zIndex: 3, opacity: robotOpacity, filter: robotFilter }}
        >
          {/* Left fade + bottom fade so robot bleeds naturally into page bg */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 10,
              background:
                'linear-gradient(90deg, #070A14 18%, rgba(7,10,20,0.42) 50%, transparent 76%),' +
                'linear-gradient(0deg, #070A14 0%, transparent 18%)',
            }}
          />
          <SplineScene scene={SCENE_URL} className="w-full h-full" />
        </motion.div>

        {/* 4 — Δ overlay (stage 03 "En vivo") */}
        {/* Outer div handles CSS positioning; inner motion.span handles animation */}
        <div
          className="absolute pointer-events-none select-none"
          style={{ zIndex: 4, left: '44%', top: '60%', transform: 'translate(-50%, -50%)' }}
          aria-hidden
        >
          <motion.span
            style={{ opacity: deltaOpacity, scale: deltaScale, display: 'block' }}
          >
            <span
              style={{
                fontFamily:   'var(--font-display)',
                fontSize:     'clamp(2.5rem, 4.5vw, 4rem)',
                fontWeight:   700,
                color:        '#7CF5D4',
                textShadow:
                  '0 0 18px #7CF5D4, ' +
                  '0 0 45px rgba(124,245,212,0.6), ' +
                  '0 0 80px rgba(91,141,255,0.7), ' +
                  '0 0 120px rgba(91,141,255,0.3)',
                letterSpacing: '-0.02em',
                lineHeight:    1,
              }}
            >
              Δ
            </span>
          </motion.span>
        </div>

        {/* 10 — Hero content (fades out as scroll starts) */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-center px-8 pt-32 pb-16"
          style={{ zIndex: 10, opacity: heroOpacity }}
        >
          <div className="max-w-[760px]">
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Delta Analytics
            </motion.p>

            <motion.h1
              className="font-display font-bold leading-[1.08] tracking-tight mb-6"
              style={{
                fontSize:             'clamp(2.4rem, 6vw, 4.2rem)',
                background:           'linear-gradient(180deg, #fff, #E8EAF2 70%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
                letterSpacing:        '-0.02em',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Construimos la inteligencia<br />detrás de tus decisiones
            </motion.h1>

            <motion.p
              className="text-muted text-[1.1rem] max-w-[560px] mx-auto mb-10"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Ya tenemos 3 sistemas en producción, eliminando horas de trabajo
              manual y convirtiendo información dispersa en respuestas al instante.
            </motion.p>

            <motion.a
              href="#contacto"
              className="
                inline-flex items-center justify-center gap-2 font-semibold text-[0.95rem]
                px-7 py-[0.85rem] rounded-full text-white cursor-pointer
                bg-gradient-to-br from-accent to-[#4373E8]
                hover:shadow-[0_8px_30px_-6px_rgba(91,141,255,0.6)]
                hover:-translate-y-0.5 transition-all duration-200
              "
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Hablemos de tu proyecto
            </motion.a>
          </div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[0.7rem] tracking-widest uppercase text-dim"
            style={{ opacity: scrollHintOpacity }}
            aria-hidden
          >
            <span>scroll para ver cómo construimos</span>
            <div
              className="w-px h-8"
              style={{
                background: 'linear-gradient(#5B8DFF, transparent)',
                animation: 'scroll-pulse 1.8s ease-in-out infinite',
              }}
            />
          </motion.div>
        </motion.div>

        {/* 20 — Narrative steps (fade in after hero fades) */}
        <motion.div
          className="absolute inset-0 flex items-center px-[6vw] md:px-[8vw]"
          style={{ zIndex: 20, opacity: narrativeOpacity }}
        >
          <div className="relative h-40 w-full max-w-sm">
            {STEPS.map((step, i) => (
              <StepText key={i} step={step} index={i} progress={progress} />
            ))}
          </div>
        </motion.div>

        {/* 30 — Progress dots */}
        <motion.div
          className="absolute left-9 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-[0.9rem]"
          style={{ zIndex: 30, opacity: narrativeOpacity }}
        >
          {STEPS.map((_, i) => (
            <Dot key={i} index={i} progress={progress} />
          ))}
        </motion.div>

        {/* Bottom gradient — fade into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            zIndex: 20,
            background: 'linear-gradient(transparent, #070A14)',
          }}
        />
      </div>
    </section>
  )
}
