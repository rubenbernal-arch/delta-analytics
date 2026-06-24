'use client'

/**
 * SplineScene — lazy-loads the Spline runtime only on the client.
 * Uses next/dynamic with ssr:false to avoid hydration mismatches from
 * the WebGL canvas.
 */

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

interface SplineSceneProps {
  scene: string
  className?: string
}

// Dynamically import so the ~1 MB Spline runtime doesn't block SSR/TTFB
const SplineViewer = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-surface">
      <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
    </div>
  ),
})

export function SplineScene({ scene, className = '' }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-surface">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      }
    >
      <SplineViewer scene={scene} className={className} />
    </Suspense>
  )
}
