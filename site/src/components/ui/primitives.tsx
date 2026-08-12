import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('font-mono text-[10px] uppercase tracking-[0.18em] ink-faint', className)}>
      {children}
    </p>
  )
}

/** Small green pulse used next to "currently at Intel". */
export function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
    </span>
  )
}
