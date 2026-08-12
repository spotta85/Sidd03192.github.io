import { TECH, TechIcon, tintOf, type TechKey } from '@/data/tech'
import { cn } from '@/lib/utils'

/**
 * A single technology chip: full-colour brand icon plus label. Technologies
 * with no brand artwork (SystemVerilog, Quartus…) show a tinted lettermark
 * instead so the row stays visually even.
 */
export function TechChip({ id, className }: { id: TechKey; className?: string }) {
  const tech = TECH[id]
  if (!tech) return null
  const tint = tintOf(tech)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[5px] border px-2 py-[3px]',
        'font-mono text-[10.5px] leading-none whitespace-nowrap',
        className,
      )}
      style={{
        borderColor: `${tint}33`,
        backgroundColor: `${tint}14`,
        color: tint,
      }}
    >
      {tech.icon ? (
        <TechIcon tech={tech} className="h-3 w-3" />
      ) : (
        <span
          aria-hidden
          className="grid h-3 w-3 place-items-center rounded-[2px] text-[7px] font-bold"
          style={{ backgroundColor: `${tint}2e` }}
        >
          {tech.label.slice(0, 2).toUpperCase()}
        </span>
      )}
      {tech.label}
    </span>
  )
}

export function TechRow({
  items,
  className,
}: {
  items: readonly string[]
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {items.map((id) => (
        <TechChip key={id} id={id as TechKey} />
      ))}
    </div>
  )
}
