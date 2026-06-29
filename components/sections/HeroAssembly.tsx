'use client'

import { useEffect, useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from 'framer-motion'
import { useI18n } from '@/lib/i18n'

const NARRATIVE_START = 0.18
const STEP_SIZE = (1 - NARRATIVE_START) / 4

const STEPS = [
  {
    eyebrow: '00 / EL PROBLEMA',
    title: 'Tu equipo pierde horas en tareas que debería hacer una máquina',
    body: 'Procesos manuales, datos dispersos, decisiones lentas. Cada hora perdida es dinero que no regresa.',
  },
  {
    eyebrow: '01 / LA SOLUCIÓN',
    title: 'Automatizamos lo repetitivo para que tu equipo haga lo que importa',
    body: 'Conectamos tus procesos, integramos tus datos y construimos el sistema que opera por ti.',
  },
  {
    eyebrow: '02 / EL RESULTADO',
    title: 'Menos costos. Más velocidad. Decisiones en tiempo real',
    body: 'Nuestros clientes reducen horas de trabajo manual y obtienen información accionable al instante.',
  },
  {
    eyebrow: '03 / EN PRODUCCIÓN',
    title: 'Ya está corriendo para empresas reales',
    body: '4 sistemas activos hoy. No vendemos promesas — entregamos software que ya está generando resultados.',
  },
]

function ChipAnimation({ progress }: { progress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const opacity = useTransform(progress, [0.16, 0.22], [0, 1])

  // Map scroll progress (0.72 -> 1.0) to build progress (0 -> 1)
  const buildProgress = useTransform(progress, [0.18, 0.92], [0, 1])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 500, H = 500
    canvas.width = W; canvas.height = H
    const CX = W / 2, CY = H / 2
    const CHIP = 110
    const PIN_COUNT = 12
    const PIN_LEN = 18
    const PIN_GAP = (CHIP * 2) / (PIN_COUNT + 1)

    // Pre-build all trace paths
    type Trace = {
      pts: [number,number][]
      color: string
      hasEndDot: boolean
    }
    const traces: Trace[] = []

    function makeTraces(side: 'top'|'bottom'|'left'|'right') {
      for (let i = 1; i <= PIN_COUNT; i++) {
        const offset = -CHIP + i * PIN_GAP
        let sx: number, sy: number
        if (side === 'top')    { sx = CX + offset; sy = CY - CHIP - PIN_LEN }
        else if (side === 'bottom') { sx = CX + offset; sy = CY + CHIP + PIN_LEN }
        else if (side === 'left')   { sx = CX - CHIP - PIN_LEN; sy = CY + offset }
        else                        { sx = CX + CHIP + PIN_LEN; sy = CY + offset }

        const ext1 = 20 + Math.random() * 50
        const ext2 = 10 + Math.random() * 40
        const isAccent = Math.random() > 0.55
        const pts: [number,number][] = [[sx, sy]]

        if (side === 'top') {
          const mx = sx, my = sy - ext1
          pts.push([mx, my])
          if (Math.random() > 0.4) pts.push([mx + (Math.random()-0.5)*ext2*2, my])
          if (Math.random() > 0.5) {
            const lx = pts[pts.length-1][0], ly = pts[pts.length-1][1]
            pts.push([lx, ly - ext2 * 0.5])
          }
        } else if (side === 'bottom') {
          const mx = sx, my = sy + ext1
          pts.push([mx, my])
          if (Math.random() > 0.4) pts.push([mx + (Math.random()-0.5)*ext2*2, my])
          if (Math.random() > 0.5) {
            const lx = pts[pts.length-1][0], ly = pts[pts.length-1][1]
            pts.push([lx, ly + ext2 * 0.5])
          }
        } else if (side === 'left') {
          const mx = sx - ext1, my = sy
          pts.push([mx, my])
          if (Math.random() > 0.4) pts.push([mx, my + (Math.random()-0.5)*ext2*2])
          if (Math.random() > 0.5) {
            const lx = pts[pts.length-1][0], ly = pts[pts.length-1][1]
            pts.push([lx - ext2*0.5, ly])
          }
        } else {
          const mx = sx + ext1, my = sy
          pts.push([mx, my])
          if (Math.random() > 0.4) pts.push([mx, my + (Math.random()-0.5)*ext2*2])
          if (Math.random() > 0.5) {
            const lx = pts[pts.length-1][0], ly = pts[pts.length-1][1]
            pts.push([lx + ext2*0.5, ly])
          }
        }

        traces.push({ pts, color: isAccent ? '#7CF5D4' : '#5B8DFF', hasEndDot: Math.random() > 0.3 })
      }
    }

    makeTraces('top'); makeTraces('bottom'); makeTraces('left'); makeTraces('right')
    // Shuffle for random build order
    traces.sort(() => Math.random() - 0.5)

    let currentBuild = 0
    let animId: number

    function draw() {
      ctx!.clearRect(0, 0, W, H)

      // ── Chip body ──────────────────────────────────────────
      // Outer ambient glow
      const grd = ctx!.createRadialGradient(CX, CY, 0, CX, CY, CHIP * 2.2)
      grd.addColorStop(0, `rgba(91,141,255,${0.12 * Math.min(1, currentBuild * 3)})`)
      grd.addColorStop(1, 'rgba(91,141,255,0)')
      ctx!.fillStyle = grd
      ctx!.fillRect(0, 0, W, H)

      // Body fill
      const bodyAlpha = Math.min(1, currentBuild * 4)
      ctx!.save()
      ctx!.globalAlpha = bodyAlpha
      ctx!.fillStyle = '#060C24'
      ctx!.strokeStyle = `rgba(91,141,255,0.85)`
      ctx!.lineWidth = 2.5
      ctx!.beginPath()
      ctx!.roundRect(CX - CHIP, CY - CHIP, CHIP*2, CHIP*2, 10)
      ctx!.fill()
      ctx!.stroke()

      // Inner subtle grid
      ctx!.strokeStyle = 'rgba(91,141,255,0.08)'
      ctx!.lineWidth = 1
      for (let i = 1; i < 6; i++) {
        const t = (CHIP*2/6)*i
        ctx!.beginPath(); ctx!.moveTo(CX-CHIP+t, CY-CHIP); ctx!.lineTo(CX-CHIP+t, CY+CHIP); ctx!.stroke()
        ctx!.beginPath(); ctx!.moveTo(CX-CHIP, CY-CHIP+t); ctx!.lineTo(CX+CHIP, CY-CHIP+t); ctx!.stroke()
      }

      // Corner capacitors
      const corners: [number,number][] = [[CX-CHIP+12,CY-CHIP+12],[CX+CHIP-12,CY-CHIP+12],[CX-CHIP+12,CY+CHIP-12],[CX+CHIP-12,CY+CHIP-12]]
      for (const [cx2,cy2] of corners) {
        ctx!.beginPath(); ctx!.arc(cx2, cy2, 5, 0, Math.PI*2)
        ctx!.fillStyle = '#FF6B5B'
        ctx!.fill()
        ctx!.strokeStyle = 'rgba(255,107,91,0.5)'
        ctx!.lineWidth = 1
        ctx!.stroke()
      }
      ctx!.restore()

      // ── Pins ───────────────────────────────────────────────
      ctx!.save()
      ctx!.globalAlpha = Math.min(1, currentBuild * 3)
      for (let i = 1; i <= PIN_COUNT; i++) {
        const off = -CHIP + i * PIN_GAP
        const pulse = 0.4 + Math.sin(Date.now()*0.003 + i*0.5)*0.3
        ctx!.strokeStyle = `rgba(124,245,212,${pulse})`
        ctx!.lineWidth = 2.5
        ctx!.lineCap = 'round'
        // top
        ctx!.beginPath(); ctx!.moveTo(CX+off, CY-CHIP); ctx!.lineTo(CX+off, CY-CHIP-PIN_LEN); ctx!.stroke()
        // bottom
        ctx!.beginPath(); ctx!.moveTo(CX+off, CY+CHIP); ctx!.lineTo(CX+off, CY+CHIP+PIN_LEN); ctx!.stroke()
        // left
        ctx!.beginPath(); ctx!.moveTo(CX-CHIP, CY+off); ctx!.lineTo(CX-CHIP-PIN_LEN, CY+off); ctx!.stroke()
        // right
        ctx!.beginPath(); ctx!.moveTo(CX+CHIP, CY+off); ctx!.lineTo(CX+CHIP+PIN_LEN, CY+off); ctx!.stroke()
      }
      ctx!.restore()

      // ── Traces (scroll-driven) ─────────────────────────────
      const traceProgress = Math.max(0, (currentBuild - 0.1) / 0.7)
      const tracesToShow = Math.floor(traceProgress * traces.length)

      for (let ti = 0; ti < Math.min(tracesToShow, traces.length); ti++) {
        const t = traces[ti]
        if (!t) continue
        // How far along this trace is drawn
        const traceLocal = Math.min(1, (traceProgress * traces.length - ti))
        const totalLen = t.pts.length - 1

        ctx!.strokeStyle = t.color === '#7CF5D4' ? 'rgba(124,245,212,0.75)' : 'rgba(91,141,255,0.6)'
        ctx!.lineWidth = 1.5
        ctx!.lineCap = 'round'

        for (let si = 0; si < totalLen; si++) {
          const segProg = Math.min(1, Math.max(0, traceLocal * totalLen - si))
          if (segProg <= 0) continue
          const [ax,ay] = t.pts[si]
          const [bx,by] = t.pts[si+1]
          ctx!.beginPath()
          ctx!.moveTo(ax, ay)
          ctx!.lineTo(ax + (bx-ax)*segProg, ay + (by-ay)*segProg)
          ctx!.stroke()
          // Node at end
          if (segProg >= 1 && si === totalLen - 1 && t.hasEndDot) {
            ctx!.beginPath()
            ctx!.arc(bx, by, 3, 0, Math.PI*2)
            ctx!.fillStyle = t.color
            ctx!.fill()
          }
        }
        // Start node
        ctx!.beginPath()
        ctx!.arc(t.pts[0][0], t.pts[0][1], 2, 0, Math.PI*2)
        ctx!.fillStyle = t.color
        ctx!.fill()
      }

      // ── Delta symbol ───────────────────────────────────────
      const deltaAlpha = Math.max(0, (currentBuild - 0.82) / 0.18)
      if (deltaAlpha > 0) {
        ctx!.save()
        ctx!.globalAlpha = deltaAlpha
        ctx!.font = `bold 80px "Space Grotesk", sans-serif`
        ctx!.textAlign = 'center'
        ctx!.textBaseline = 'middle'
        ctx!.fillStyle = '#7CF5D4'
        ctx!.shadowColor = 'rgba(124,245,212,0.95)'
        ctx!.shadowBlur = 28 * deltaAlpha
        ctx!.fillText('Δ', CX, CY)
        ctx!.restore()
      }

      animId = requestAnimationFrame(draw)
    }

    // Subscribe to scroll progress
    const unsub = buildProgress.on('change', (v) => {
      currentBuild = Math.max(0, Math.min(1, v))
    })

    animId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animId)
      unsub()
    }
  }, [buildProgress])

  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ zIndex: 4, right: '8%', top: '50%', translateY: '-50%', opacity }}
      aria-hidden
    >
      <canvas ref={canvasRef} style={{ width: 500, height: 500, transform: 'perspective(900px) rotateY(-12deg) rotateX(6deg)', filter: 'drop-shadow(0 0 40px rgba(91,141,255,0.35)) drop-shadow(0 0 80px rgba(124,245,212,0.15))' }} />
    </motion.div>
  )
}


function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const COUNT = 55
    let w = 0, h = 0
    let particles: Array<{ x: number; y: number; vx: number; vy: number; r: number; a: number }>
    let animId: number
    function resize() {
      w = canvas!.width = canvas!.offsetWidth
      h = canvas!.height = canvas!.offsetHeight
    }
    function makeParticles() {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.8 + 0.5, a: Math.random() * 0.5 + 0.15,
      }))
    }
    function draw() {
      ctx!.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(124,245,212,${p.a})`
        ctx!.fill()
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y)
            ctx!.strokeStyle = `rgba(91,141,255,${0.13 * (1 - dist / 120)})`
            ctx!.lineWidth = 1; ctx!.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ro = new ResizeObserver(() => { resize(); makeParticles() })
    ro.observe(canvas)
    resize(); makeParticles()
    if (!reduced) animId = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(animId); ro.disconnect() }
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" aria-hidden />
}

function StepText({ step, index, progress }: { step: (typeof STEPS)[0]; index: number; progress: MotionValue<number> }) {
  const start = NARRATIVE_START + index * STEP_SIZE
  const end = start + STEP_SIZE
  const pad = 0.045
  const opacity = useTransform(progress, [start - pad, start + pad, end - pad, end + pad], [0, 1, 1, 0])
  const y = useTransform(progress, [start - pad, start + pad], [20, 0])
  return (
    <motion.div className="absolute inset-0 flex flex-col justify-center" style={{ opacity, y }}>
      <span className="eyebrow mb-3">{step.eyebrow}</span>
      <h3 className="font-display font-bold text-foreground mb-4 leading-tight" style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)', letterSpacing: '-0.02em' }}>
        {step.title}
      </h3>
      <p className="text-muted text-[1.05rem] leading-relaxed max-w-[360px]">{step.body}</p>
    </motion.div>
  )
}

function Dot({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const active = useTransform(progress, (v) => {
    if (v < NARRATIVE_START) return 0
    const step = Math.min(Math.floor((v - NARRATIVE_START) / STEP_SIZE), STEPS.length - 1)
    return step === index ? 1 : 0
  })
  return (
    <motion.span
      className="block rounded-full"
      style={{
        width: '6px',
        height: useTransform(active, [0, 1], ['6px', '20px']),
        backgroundColor: useTransform(active, (a) => a === 1 ? '#7CF5D4' : 'rgba(232,234,242,0.18)'),
        transition: 'height 0.3s ease, background-color 0.3s ease',
      }}
    />
  )
}

export function HeroAssembly() {
  const { t } = useI18n()
  const STEPS = t.steps
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 75, damping: 26 })

  const heroOpacity = useTransform(progress, [0, 0.06, 0.16], [1, 1, 0])
  const gridOpacity = useTransform(progress, [0, 0.08, 0.18], [1, 1, 0])
  const scrollHintOpacity = useTransform(progress, [0, 0.04, 0.10], [1, 1, 0])
  const narrativeOpacity = useTransform(progress, [0.13, 0.22], [0, 1])
  const orb1Opacity = useTransform(progress, [0, 0.3, 0.7, 1], [0.15, 0.4, 0.7, 1])
  const orb2Opacity = useTransform(progress, [0, 0.4, 0.8, 1], [0.08, 0.25, 0.55, 0.85])

  return (
    <section ref={containerRef} id="top" className="relative" style={{ height: '550vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        <Particles />

        {/* Drifting grid */}
        <motion.div
          className="absolute inset-[-20%] pointer-events-none"
          style={{
            zIndex: 1, opacity: gridOpacity,
            backgroundImage: 'linear-gradient(rgba(232,234,242,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(232,234,242,0.06) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(circle at 50% 40%, black 10%, transparent 65%)',
            animation: 'grid-drift 40s linear infinite',
          }}
          aria-hidden
        />

        {/* Orb 1 */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            zIndex: 2, opacity: orb1Opacity,
            top: '15%', right: '10%', width: '50vw', height: '60vh',
            background: 'radial-gradient(ellipse, rgba(91,141,255,0.28) 0%, rgba(91,141,255,0.08) 45%, transparent 70%)',
            filter: 'blur(2px)',
          }}
          aria-hidden
        />

        {/* Orb 2 */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            zIndex: 2, opacity: orb2Opacity,
            bottom: '10%', right: '20%', width: '32vw', height: '38vh',
            background: 'radial-gradient(ellipse, rgba(124,245,212,0.22) 0%, transparent 65%)',
          }}
          aria-hidden
        />

        {/* Chip animation — stage 03 */}
        <ChipAnimation progress={progress} />

        {/* Hero copy */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-center px-8 pt-28 pb-16"
          style={{ zIndex: 10, opacity: heroOpacity }}
        >
          <div className="max-w-[780px]">
            <motion.p className="eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              Delta Analytics
            </motion.p>
            <motion.h1
              className="font-display font-bold leading-[1.06] tracking-tight mb-6"
              style={{
                fontSize: 'clamp(2.6rem, 6.5vw, 4.6rem)',
                background: 'linear-gradient(160deg, #fff 30%, #7CF5D4 75%, #5B8DFF 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                letterSpacing: '-0.025em',
              }}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            >
              Tu empresa opera más rápido,<br />con más inteligencia y mejores decisiones
            </motion.h1>
            <motion.p
              className="text-muted text-[1.1rem] max-w-[560px] mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22 }}
            >
              Automatizamos procesos, reducimos costos operativos y convertimos datos en decisiones — para que tu empresa opere a una escala imposible para humanos solos.
            </motion.p>
            <motion.div
              className="flex items-center justify-center gap-4 flex-wrap"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.36 }}
            >
              <a href="#contacto" className="inline-flex items-center gap-2 font-semibold text-[0.95rem] px-7 py-[0.85rem] rounded-full text-white bg-gradient-to-br from-accent to-[#4373E8] hover:shadow-[0_8px_30px_-6px_rgba(91,141,255,0.65)] hover:-translate-y-0.5 transition-all duration-200">
                Hablemos de tu proyecto
              </a>
              <a href="#productos" className="inline-flex items-center gap-2 font-semibold text-[0.95rem] px-7 py-[0.85rem] rounded-full text-muted border border-[var(--line-strong)] hover:border-accent-2 hover:text-foreground transition-all duration-200">
                Ver productos ↓
              </a>
            </motion.div>
          </div>
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[0.68rem] tracking-widest uppercase text-dim"
            style={{ opacity: scrollHintOpacity }} aria-hidden
          >
            <span>scroll para ver cómo construimos</span>
            <div className="w-px h-8" style={{ background: 'linear-gradient(#5B8DFF, transparent)', animation: 'scroll-pulse 1.8s ease-in-out infinite' }} />
          </motion.div>
        </motion.div>

        {/* Narrative */}
        <motion.div
          className="absolute inset-0 flex items-center px-[7vw] md:px-[9vw]"
          style={{ zIndex: 20, opacity: narrativeOpacity }}
        >
          <div className="relative w-full max-w-[420px]" style={{ height: '220px' }}>
            {STEPS.map((step, i) => <StepText key={i} step={step} index={i} progress={progress} />)}
          </div>
        </motion.div>

        {/* Dots */}
        <motion.div
          className="absolute left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 items-center"
          style={{ zIndex: 30, opacity: narrativeOpacity }}
        >
          {STEPS.map((_, i) => <Dot key={i} index={i} progress={progress} />)}
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{ zIndex: 25, background: 'linear-gradient(transparent, #070A14)' }} />
      </div>
    </section>
  )
}
