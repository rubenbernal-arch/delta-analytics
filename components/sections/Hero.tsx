'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/* ── Canvas particle system (ported from original HTML) ── */
function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const COUNT = 46
    let w: number, h: number
    let particles: Array<{ x: number; y: number; vx: number; vy: number; r: number; a: number }>
    let animId: number

    function resize() {
      w = canvas!.width  = canvas!.offsetWidth
      h = canvas!.height = canvas!.offsetHeight
    }

    function makeParticles() {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.6 + 0.6,
        a: Math.random() * 0.5 + 0.2,
      }))
    }

    function step() {
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
          if (dist < 110) {
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y)
            ctx!.strokeStyle = `rgba(91,141,255,${0.12 * (1 - dist / 110)})`
            ctx!.lineWidth = 1; ctx!.stroke()
          }
        }
      }
      animId = requestAnimationFrame(step)
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ro = new ResizeObserver(() => { resize(); makeParticles() })
    ro.observe(canvas)
    resize(); makeParticles()
    if (!reduced) animId = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />
}

/* ── Hero section ──────────────────────────────────────── */
export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-dvh flex items-center justify-center text-center px-8 pt-32 pb-16 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0" aria-hidden>
        {/* Drifting grid */}
        <div
          className="absolute inset-[-20%]"
          style={{
            backgroundImage:
              'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(circle at 50% 40%, black 10%, transparent 65%)',
            animation: 'grid-drift 40s linear infinite',
          }}
        />
        <HeroParticles />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[760px]">
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
            fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
            background: 'linear-gradient(180deg, #fff, #E8EAF2 70%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
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
          No solo creamos herramientas: optimizamos el proceso completo. TradeIQ Pro y OdontoBot ya están en uso, eliminando horas de trabajo manual y convirtiendo información dispersa en respuestas al instante.
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
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[0.7rem] tracking-widest uppercase text-dim z-10"
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
      </div>
    </section>
  )
}
