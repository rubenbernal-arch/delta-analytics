'use client'

interface ImagePlaceholderProps {
  label: string
  caption?: string
  accentColor?: string
  className?: string
}

export function ImagePlaceholder({ label, caption, accentColor = '#FF8000', className = '' }: ImagePlaceholderProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div
        className="relative flex-1 min-h-[180px] rounded-xl border border-dashed flex flex-col items-center justify-center gap-3 text-center px-6"
        style={{ borderColor: `${accentColor}40`, background: `linear-gradient(160deg, ${accentColor}0F, transparent)` }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ color: accentColor }} aria-hidden>
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M21 15l-5-5-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-mono text-[0.68rem] tracking-widest uppercase text-dim">{label}</span>
      </div>
      {caption && (
        <span className="mt-2 font-mono text-[0.68rem] tracking-wide text-dim text-right">{caption}</span>
      )}
    </div>
  )
}
