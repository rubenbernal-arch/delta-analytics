'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { ImagePlaceholder } from '@/components/ui/placeholder'

function ProductIcon({ type, color }: { type: 'delta' | 'chart' | 'whatsapp'; color: string }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'white', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <div className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0" style={{ background: color }}>
      {type === 'delta' && <span className="text-white text-[1.2rem] font-display font-bold">Δ</span>}
      {type === 'chart' && (
        <svg {...common}><path d="M4 20V10M12 20V4M20 20v-7" /></svg>
      )}
      {type === 'whatsapp' && (
        <svg {...common}><path d="M4 20l1.4-4.2A8 8 0 1 1 8.4 19L4 20Z" /><path d="M8.5 10.5c.3 1.8 2.2 3.7 4 4" /></svg>
      )}
    </div>
  )
}

export function Products() {
  const { t } = useI18n()
  const [featured, ...rest] = t.products.items

  return (
    <section id="productos" style={{ background: '#F2EEE7' }}>
      <div className="section-inner !pt-16 !pb-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="font-mono text-[0.72rem] font-medium tracking-[0.12em] uppercase mb-3" style={{ color: '#FF8000' }}>
              {t.products.eyebrow}
            </p>
            <h2
              className="font-display font-semibold leading-[1.12] tracking-tight"
              style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', color: '#14161A', letterSpacing: '-0.015em' }}
            >
              {t.products.title}<br />{t.products.title2}
            </h2>
          </div>
          <a href="#productos" className="font-mono text-[0.85rem] hover:opacity-70 transition-opacity" style={{ color: '#14161A' }}>
            {t.products.viewAll}
          </a>
        </div>

        <div className="flex flex-col gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <ProductCard product={featured} large />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {rest.map((p, i) => (
              <motion.div
                key={p.id}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.08 * (i + 1) }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

type Product = ReturnType<typeof useI18n>['t']['products']['items'][number]

function ProductCard({ product: p, large = false }: { product: Product; large?: boolean }) {
  const Wrapper = p.link ? 'a' : 'div'
  const wrapperProps = p.link ? { href: p.link, target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={`group relative flex flex-col ${large ? 'lg:flex-row lg:items-center' : 'h-full'} gap-8 bg-[#14161A] border border-[var(--line-strong)] rounded-2xl p-8 overflow-hidden hover:-translate-y-1 transition-all duration-200`}
    >
      <div
        className="absolute top-0 right-0 w-[55%] h-[65%] pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top right, ${p.accentColor}22, transparent 65%)` }}
      />

      <div className={`relative z-10 flex flex-col ${large ? 'lg:w-[42%]' : ''}`}>
        <div className="flex items-center gap-3 mb-5">
          <ProductIcon type={p.icon} color={p.accentColor} />
          <div>
            <h3 className="font-display font-bold leading-tight text-white" style={{ fontSize: '1.3rem', letterSpacing: '-0.01em' }}>
              {p.name}
            </h3>
            <span className="text-[0.85rem] inline-flex items-center gap-1" style={{ color: p.accentColor }}>
              {p.subtitle} {p.link && '↗'}
            </span>
          </div>
        </div>

        <p className="text-muted text-[0.93rem] leading-relaxed mb-5">
          {p.desc}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {p.tags.map((tag: string) => (
            <span
              key={tag}
              className="font-mono text-[0.68rem] tracking-wide px-2.5 py-1 rounded-full border"
              style={{ color: p.accentColor, borderColor: `${p.accentColor}30`, background: `${p.accentColor}08` }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={`relative z-10 flex-1 ${large ? '' : 'mt-2'}`}>
        {p.image ? (
          <div
            className={`relative ${large ? 'min-h-[260px]' : 'min-h-[200px]'}`}
            style={{
              WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at center, black 55%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse 75% 70% at center, black 55%, transparent 100%)',
            }}
          >
            <Image src={p.image} alt={p.name} fill className="object-contain" sizes={large ? '(min-width: 1024px) 55vw, 100vw' : '(min-width: 768px) 45vw, 100vw'} />
          </div>
        ) : (
          <ImagePlaceholder label={p.name} accentColor={p.accentColor} className={large ? 'min-h-[220px]' : 'min-h-[140px]'} />
        )}
      </div>
    </Wrapper>
  )
}
