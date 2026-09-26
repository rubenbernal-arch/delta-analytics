'use client'

import Image from 'next/image'
import { useI18n } from '@/lib/i18n'

export function Logos() {
  const { t } = useI18n()
  const items = t.logos.items

  return (
    <section className="border-b border-[var(--line)] overflow-hidden" style={{ background: '#F2EEE7' }}>
      <div className="max-w-[1140px] mx-auto px-8 pt-8">
        <span className="font-mono text-[0.75rem] tracking-wide" style={{ color: '#14161A99' }}>
          {t.logos.eyebrow}
        </span>
      </div>

      <div
        className="relative py-8"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <div
          className="flex w-max items-center gap-16 hover:[animation-play-state:paused]"
          style={{ animation: 'logo-marquee 28s linear infinite' }}
        >
          {[...items, ...items].map((logo, i) => (
            <Image
              key={`${logo.name}-${i}`}
              src={logo.src}
              alt={logo.name}
              width={320}
              height={120}
              className="h-24 sm:h-32 w-auto object-contain opacity-90 shrink-0"
              style={logo.forceBlack ? { filter: 'brightness(0)' } : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
