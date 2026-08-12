import github from '@thesvg/icons/github'
import gmail from '@thesvg/icons/gmail'
import linkedin from '@thesvg/icons/linkedin'
import pdf from '@thesvg/icons/pdf'
import { BrandIcon } from '@/data/tech'
import { profile } from '@/data/profile'
import { cn } from '@/lib/utils'

/**
 * Social links. Icons come from thesvg like every other icon on the page —
 * `variant` picks the artwork that survives a dark background (GitHub's default
 * mark is near-black; LinkedIn and PDF have no light variant, so they are
 * tinted instead).
 */
const ITEMS = [
  // GitHub's artwork is near-black in every variant, so it is tinted rather
  // than used as-is. Gmail and PDF keep their real multi-colour marks.
  { key: 'github', label: 'GitHub', href: profile.links.github, icon: github, variant: 'default', tint: '#E5E7EB' },
  { key: 'linkedin', label: 'LinkedIn', href: profile.links.linkedin, icon: linkedin, variant: 'default', tint: '#0A66C2' },
  { key: 'email', label: 'Email', href: profile.links.email, icon: gmail, variant: 'default', tint: undefined },
  { key: 'resume', label: 'Résumé', href: profile.links.resume, icon: pdf, variant: 'default', tint: undefined },
] as const

export function Links({
  size = 'md',
  labels = true,
  className,
}: {
  size?: 'sm' | 'md'
  labels?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {ITEMS.map(({ key, label, href, icon, variant, tint }) => (
        <a
          key={key}
          href={href}
          target={href.startsWith('mailto:') ? undefined : '_blank'}
          rel="noreferrer"
          className={cn('btn btn-plain group', size === 'sm' && 'px-2.5 py-1 text-xs')}
        >
          <BrandIcon
            icon={icon}
            variant={variant}
            tint={tint}
            className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'}
          />
          {labels && <span>{label}</span>}
        </a>
      ))}
    </div>
  )
}

