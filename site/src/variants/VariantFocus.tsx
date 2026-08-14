import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Eyebrow } from '@/components/ui/primitives'
import { Links } from '@/components/ui/Links'
import { AnimatedName } from '@/components/ui/AnimatedName'
import { FloatingStickers } from '@/components/ui/FloatingStickers'
import { Stats } from '@/components/ui/Stats'
import { TechRow } from '@/components/ui/TechChip'
import { experience, profile, projects, type StatTarget } from '@/data/profile'
import { cn } from '@/lib/utils'

const ROLES = ['GPU firmware', 'computer architecture', 'compilers', 'agentic systems'] as const

const PAGES = ['home', 'experience', 'projects'] as const
type Page = (typeof PAGES)[number]

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Cycles a word in place — React-Bits "rotating text".
 *
 * All the words are rendered stacked in a single grid cell, so the container
 * is always as wide as the longest one: the sentence never reflows, and no
 * word can get clipped or land between two heights mid-transition.
 */
function RotatingWord() {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((n) => (n + 1) % ROLES.length), 2600)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="inline-grid text-left align-baseline">
      {ROLES.map((role, idx) => (
        <motion.span
          key={role}
          aria-hidden={idx !== i}
          className="col-start-1 row-start-1 whitespace-nowrap accent"
          initial={false}
          animate={{
            opacity: idx === i ? 1 : 0,
            y: idx === i ? '0em' : idx < i || (i === 0 && idx === ROLES.length - 1) ? '-0.4em' : '0.4em',
          }}
          transition={{ duration: 0.45, ease }}
        >
          {role}
        </motion.span>
      ))}
    </span>
  )
}

function Home({
  go,
  goToStat,
}: {
  go: (p: Page) => void
  goToStat: (target: StatTarget) => void
}) {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease }}
      className="relative flex h-full flex-col items-center justify-center px-6 text-center"
    >
      <FloatingStickers />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease }}
        // `btn` for the shared control styling and hover sweep; it is a status
        // badge rather than a control, so the pointer affordance is dropped
        className="btn mb-7 cursor-default rounded-md py-1.5"
      >
        <span className="font-mono text-[11px] ink-muted">System Software Engineer Intern @ Intel</span>
      </motion.div>

      <AnimatedName text={profile.name} />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5, ease }}
        className="text-legible mt-5 text-base font-semibold ink sm:text-lg"
      >
        CS at UT Austin. I work on <RotatingWord />
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5, ease }}
        className="text-legible mt-4 max-w-xl text-[15px] font-medium leading-relaxed ink-muted"
      >
        I build for the web and everything under it — firmware, processors, inference engines. I like
        shipping something people actually use, and I like getting my hands dirty in the layers nobody
        sees. Most of it with a team around me, which is the part I'd keep either way.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.82, duration: 0.5, ease }}
        className="relative z-20 mt-9 flex flex-col items-center gap-5"
      >
        <div className="flex gap-2">
          {(['experience', 'projects'] as const).map((p) => (
            <button
              key={p}
              onClick={() => go(p)}
              className="btn btn-primary group"
            >
              {p === 'experience' ? 'Experience' : 'Projects'}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          ))}
        </div>
        <Links size="sm" />
      </motion.div>

      <Stats className="relative z-20 mt-10" onSelect={goToStat} />
    </motion.div>
  )
}

function ProjectsPage({ initial = 0 }: { initial?: number }) {
  const [active, setActive] = useState(initial)
  const p = projects[active]

  return (
    <motion.div
      key="projects"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease }}
      className="mx-auto grid h-full w-full max-w-[1080px] grid-rows-[auto_1fr] px-6 py-20 md:py-24"
    >
      <Eyebrow className="mb-6">Projects — {projects.length}</Eyebrow>
      <div className="grid min-h-0 gap-8 md:grid-cols-[minmax(0,340px)_1fr] md:gap-12">
        {/* index */}
        <ul className="flex flex-col justify-center gap-1">
          {projects.map((proj, i) => (
            <li key={proj.name}>
              <button
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={cn(
                  'group flex w-full items-baseline gap-3 rounded-md px-3 py-2.5 text-left transition-colors',
                  // neutral fill, not --btn: see the --surface note in index.css
                  i === active ? 'bg-[rgb(var(--surface))]' : 'hover:bg-[rgb(var(--surface)/0.66)]',
                )}
              >
                <span className="font-mono text-[10px] ink-faint">{String(i + 1).padStart(2, '0')}</span>
                <span
                  className={cn(
                    'text-lg tracking-tight transition-colors',
                    i === active ? 'ink' : 'ink-faint',
                  )}
                >
                  {proj.name}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* detail */}
        <div className="flex min-h-0 flex-col justify-center border-l-0 pl-0 md:border-l md:border-[rgb(var(--border)/0.1)] md:pl-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease }}
            >
              <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                {p.tagline}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed ink-muted">{p.detail}</p>
              <TechRow items={p.tech} className="mt-5" />
              {p.href && (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs accent hover:underline"
                >
                  {p.href.replace('https://', '')}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * `focus` names a company to land on — set when you arrive from a stat. The
 * entry is scrolled into view and its rail marker pulses briefly, so the number
 * you clicked resolves to a visible place on the page rather than dumping you
 * at the top of the list to find it yourself.
 */
function ExperiencePage({ focus }: { focus?: string }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!focus) return
    const node = ref.current
    if (!node) return
    // after the page's own enter transition, so the scroll lands on a settled
    // layout rather than one still animating in
    const id = setTimeout(() => {
      node.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
        block: 'center',
      })
    }, 420)
    return () => clearTimeout(id)
  }, [focus])

  return (
    <motion.div
      key="experience"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease }}
      className="mx-auto flex h-full w-full max-w-[920px] flex-col px-6 pt-20 pb-24 md:pt-24"
    >
      <Eyebrow className="mb-7 shrink-0">Experience</Eyebrow>

      <div className="flex min-h-0 flex-1 flex-col justify-center gap-0 overflow-y-auto">
        {experience.map((e, i) => {
          const focused = e.company === focus
          return (
          <motion.article
            key={e.company}
            ref={focused ? ref : undefined}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.45, ease }}
            className="group relative border-l border-[rgb(var(--border)/0.12)] pb-8 pl-7 last:pb-0"
          >
            <motion.span
              // the marker pulses once on arrival to point out which entry the
              // stat referred to, then settles into the normal dot
              animate={focused ? { scale: [1, 1.9, 1.35] } : undefined}
              transition={{ delay: 0.5, duration: 0.7, ease }}
              className={cn(
                'absolute -left-[4.5px] top-1.5 h-[9px] w-[9px] rounded-full border-2 border-[rgb(var(--page))] bg-[rgb(var(--accent))] transition-transform duration-200 group-hover:scale-125',
                focused && 'shadow-[0_0_14px_3px_rgb(var(--accent)/0.6)]',
              )}
            />

            {/* header: company + role on the left, dates pinned right */}
            <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
              <div className="flex flex-wrap items-baseline gap-x-2.5">
                <h3 className="text-[17px] font-semibold tracking-tight">{e.company}</h3>
                {e.team && <span className="font-mono text-[10.5px] ink-faint">{e.team}</span>}
              </div>
              <span className="font-mono text-[10.5px] whitespace-nowrap ink-faint">
                {e.period} · {e.place}
              </span>
            </div>

            <p className="mt-0.5 text-[13px] font-medium accent">{e.role}</p>

            <ul className="mt-2.5 flex flex-col gap-1.5">
              {e.points.map((pt) => (
                <li key={pt} className="flex gap-2.5 text-[13px] leading-relaxed ink-muted">
                  <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-[rgb(var(--accent)/0.7)]" />
                  <span className="max-w-2xl">{pt}</span>
                </li>
              ))}
            </ul>

            <TechRow items={e.tech} className="mt-3" />
          </motion.article>
          )
        })}
      </div>
    </motion.div>
  )
}

export function VariantFocus() {
  const [page, setPage] = useState<Page>('home')
  /**
   * Which entry to land on, set only when you arrive by clicking a stat. It is
   * cleared whenever you navigate by hand, so the nav and back button always
   * open a page in its default state.
   */
  const [focus, setFocus] = useState<StatTarget | null>(null)

  const go = (p: Page) => {
    setFocus(null)
    setPage(p)
  }

  const goToStat = (target: StatTarget) => {
    setFocus(target)
    setPage(target.page)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && page !== 'home') go('home')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [page])

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* top bar — only present once you've left the hero */}
      <AnimatePresence>
        {page !== 'home' && (
          <motion.button
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            onClick={() => setPage('home')}
            className="btn absolute left-6 top-6 z-20 text-xs md:left-10 md:top-8"
          >
            <ArrowLeft className="h-3 w-3" />
            {profile.name}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {page === 'home' && <Home key="home" go={go} goToStat={goToStat} />}
        {page === 'projects' && (
          <ProjectsPage
            key="projects"
            initial={
              focus?.page === 'projects'
                ? Math.max(0, projects.findIndex((p) => p.name === focus.project))
                : 0
            }
          />
        )}
        {page === 'experience' && (
          <ExperiencePage
            key="experience"
            focus={focus?.page === 'experience' ? focus.company : undefined}
          />
        )}
      </AnimatePresence>

      {/* page nav */}
      {/*
        Bottom nav. The active pill is a shared layoutId, so switching pages
        slides the highlight between items instead of cutting.
      */}
      <div
        className={cn(
          'absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 gap-1 rounded-full p-1.5',
          'border border-[rgb(var(--accent)/0.2)] bg-[rgb(var(--btn)/0.72)] backdrop-blur-xl',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_28px_rgba(0,0,0,0.45)]',
        )}
      >
        {PAGES.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={cn(
              'relative rounded-full px-4 py-1.5 text-[12px] font-medium capitalize transition-colors duration-200',
              page === p ? 'text-[rgb(var(--page))]' : 'ink-faint hover:text-[rgb(var(--ink))]',
            )}
          >
            {page === p && (
              <motion.span
                layoutId="nav-pill"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className={cn(
                  'absolute inset-0 -z-10 rounded-full bg-[rgb(var(--accent))]',
                  'shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_2px_12px_rgb(var(--accent)/0.5)]',
                )}
              />
            )}
            <span className="relative">{p}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
