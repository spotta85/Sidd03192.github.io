import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue } from 'motion/react'
import { stats, type StatTarget } from '@/data/profile'
import { cn } from '@/lib/utils'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Count-up — React-Bits "count up". The number is driven by a motion value
 * rather than React state, so the tween runs on the animation frame loop
 * without re-rendering the tree 60 times a second; only the text node is
 * written to. `decimals` keeps the width stable while it climbs (3.82 counts
 * through 1.00–3.82, never 1 → 1.5 → 3.82 with a jumping decimal point).
 */
function CountUp({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const value = useMotionValue(0)
  // `once` so the numbers do not re-roll every time the section scrolls past;
  // the margin starts them slightly before the row is fully on screen.
  const inView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const write = (n: number) => {
      node.textContent = n.toFixed(decimals)
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      write(to)
      return
    }

    write(0)
    if (!inView) return

    const controls = animate(value, to, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: write,
    })
    return () => controls.stop()
  }, [inView, to, decimals, value])

  // The server/first paint value — replaced on the first frame of the tween.
  return <span ref={ref}>{(0).toFixed(decimals)}</span>
}

/** The figures themselves — shared by the static and clickable renderings. */
function StatBody({ s }: { s: (typeof stats)[number] }) {
  return (
    <>
      <p className="text-legible font-display text-2xl font-semibold leading-none tracking-tight ink sm:text-[28px]">
        <CountUp to={s.to} decimals={'decimals' in s ? s.decimals : 0} />
        {s.suffix && <span className="accent">{s.suffix}</span>}
      </p>
      <p className="text-legible mt-1.5 text-[11.5px] font-medium ink-muted transition-colors group-hover:text-[rgb(var(--ink))]">
        {s.label}
      </p>
      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ink-faint transition-colors group-hover:text-[rgb(var(--accent))]">
        {s.note}
      </p>
    </>
  )
}

/**
 * The stat row under the hero copy. Numbers come from `stats` in data/profile,
 * which is the single source of truth for the figures quoted on the page.
 *
 * Stats carrying a `target` are buttons that jump to the entry behind the
 * number; the GPA has no source page, so it stays plain text rather than
 * offering a click that goes nowhere.
 */
export function Stats({
  className,
  onSelect,
}: {
  className?: string
  onSelect: (target: StatTarget) => void
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-x-8 gap-y-6 sm:flex sm:flex-wrap sm:items-start sm:justify-center sm:gap-x-10',
        className,
      )}
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          // staggered off the same 0.82s the buttons use, so the row resolves
          // left-to-right after the controls above it have landed
          transition={{ delay: 0.95 + i * 0.09, duration: 0.5, ease }}
        >
          {'target' in s ? (
            <button
              type="button"
              onClick={() => onSelect(s.target)}
              aria-label={`${s.label} — see ${s.note}`}
              className={cn(
                'group rounded-lg px-3 py-2 text-center transition-all duration-200',
                'hover:-translate-y-0.5 hover:bg-[rgb(var(--surface)/0.7)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent)/0.6)]',
              )}
            >
              <StatBody s={s} />
            </button>
          ) : (
            <div className="px-3 py-2 text-center">
              <StatBody s={s} />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
