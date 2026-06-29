'use client'

import { useI18n } from '@/lib/i18n'

export function Mission() {
  const { t } = useI18n()
  return (
    <section id="mision" className="border-t border-[var(--line)]">
      <div className="section-inner">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-2xl overflow-hidden border border-[var(--line)]"
          style={{ background: 'var(--line)' }}
        >
          {[
            {
              label: t.mission.missionLabel,
              body:  t.mission.missionBody,
            },
            {
              label: t.mission.visionLabel,
              body:  t.mission.visionBody,
            },
          ].map(({ label, body }) => (
            <div key={label} className="bg-surface p-12 md:p-12">
              <p className="eyebrow">{label}</p>
              <p className="font-display font-medium leading-[1.4] text-foreground" style={{ fontSize: '1.3rem', letterSpacing: '-0.005em' }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
