import { useState, type CSSProperties } from 'react'
import { motion } from 'motion/react'
import cplusplus from '@thesvg/icons/cplusplus'
import ghostty from '@thesvg/icons/ghostty'
import intel from '@thesvg/icons/intel'
import langchain from '@thesvg/icons/langchain'
import linux from '@thesvg/icons/linux'
import nvidia from '@thesvg/icons/nvidia'
import python from '@thesvg/icons/python'
import react from '@thesvg/icons/react'
import spotify from '@thesvg/icons/spotify'
import strava from '@thesvg/icons/strava'
import typescript from '@thesvg/icons/typescript'
import { BrandIcon } from '@/data/tech'
import { cn } from '@/lib/utils'

type IconModule = { svg: string; title: string; variants?: Record<string, string> }

type Sticker = {
  id: string
  label: string
  blurb: string
  /** Brand artwork from thesvg… */
  icon?: IconModule
  /**
   * Named artwork variant. Only needed when the default art carries no `fill`
   * attributes — `tint` works by rewriting fills to currentColor, so with none
   * to rewrite the mark stays black and vanishes. LangChain is the case here;
   * its `mono` variant is drawn with explicit fills.
   */
  variant?: string
  /** …or a raster mark from /public, for logos no icon set carries. */
  img?: string
  /** Set when the raster has its own opaque background — it fills the chip. */
  imgFills?: boolean
  tint?: string
  /** Percentage position within the hero. */
  top: string
  left: string
  /** Seconds — varied so the stickers never bob in lockstep. */
  drift: number
  delay: number
  /** Which side the hover card opens toward, so it never leaves the viewport. */
  side: 'left' | 'right'
}

/**
 * Positions are hand-placed in a ring around the centred hero text: two vertical
 * columns down the sides, plus a row along the top and one along the bottom.
 *
 * The hero block is vertically centred and runs roughly 22%–78% of the height,
 * which is what frees the top and bottom strips. Two things to keep clear when
 * adding more: the page nav pill, centred at the very bottom, and the mid-height
 * band from ~25%–75% across, where the name and buttons live. `top`/`left` place
 * the icon's top-left corner and the art is 64px, so a sticker at `top: '8%'`
 * occupies about 8–15% of a 900px-tall viewport.
 */
const STICKERS: Sticker[] = [
  {
    id: 'intel',
    label: 'Intel',
    blurb: 'System Software Engineer Intern on the GuC team — GPU firmware, microkernel scheduling, and crash-dump tooling.',
    icon: intel,
    top: '20%',
    left: '13%',
    drift: 7.5,
    delay: 0,
    side: 'right',
  },
  {
    id: 'ut',
    label: 'UT Austin',
    blurb: 'B.S. Computer Science, 2024–2027. Coursework in computer architecture, operating systems, and compilers.',
    img: '/longhorn.png',
    top: '63%',
    left: '10%',
    drift: 8.5,
    delay: 1.1,
    side: 'right',
  },
  {
    id: 'longhorn-developers',
    label: 'Longhorn Developers',
    blurb: 'Lead Developer — I run a team of 6 on UT Degree Audit Plus, a Chrome extension serving 50,000+ students.',
    img: '/longhorn-developers.png',
    imgFills: true,
    top: '76%',
    left: '18%',
    drift: 7.2,
    delay: 1.5,
    side: 'right',
  },
  {
    id: 'ghostty',
    label: 'Ghostty',
    blurb: 'My favorite terminal emulator — GPU-accelerated, native, and fast enough that I stopped noticing it.',
    icon: ghostty,
    top: '16%',
    left: '88%',
    drift: 8.7,
    delay: 0.9,
    side: 'left',
  },
  {
    id: 'cpp',
    label: 'C++',
    blurb: 'My default for systems work — the inference engine, its op-graph IR, and most things that need to be fast.',
    icon: cplusplus,
    top: '31%',
    left: '85%',
    drift: 6.8,
    delay: 0.6,
    side: 'left',
  },
  {
    id: 'cuda',
    label: 'CUDA',
    blurb: 'Custom GPU kernels from naive tiling up to tensor cores, benchmarked against a SystemVerilog systolic array.',
    icon: nvidia,
    top: '48%',
    left: '90%',
    drift: 9.2,
    delay: 1.8,
    side: 'left',
  },
  {
    id: 'python',
    label: 'Python',
    blurb: 'Tooling and analysis — including the perf-analysis tool now used across multiple Intel GPU teams.',
    icon: python,
    top: '74%',
    left: '86%',
    drift: 7.9,
    delay: 0.3,
    side: 'left',
  },
  {
    id: 'biking',
    label: 'Mountain biking',
    blurb: 'Off the keyboard, I ride trails. Best way I have found to reset after a long week of debugging.',
    icon: strava,
    top: '40%',
    left: '7%',
    drift: 8.1,
    delay: 2.2,
    side: 'right',
  },

  /* top row — above the hero block */
  {
    id: 'typescript',
    label: 'TypeScript',
    blurb: 'What UT Degree Audit Plus is written in — a Chrome extension 50,000+ students actually depend on.',
    icon: typescript,
    top: '8%',
    left: '31%',
    drift: 7.6,
    delay: 0.45,
    side: 'right',
  },
  {
    id: 'react',
    label: 'React',
    blurb: 'The front end for the degree planner and the computer-vision dance coach at Texas Convergent.',
    icon: react,
    top: '6%',
    left: '48%',
    drift: 8.9,
    delay: 1.35,
    side: 'right',
  },
  {
    id: 'langchain',
    label: 'LangChain',
    blurb: 'Codesprout runs on it — Code-Act agents for grading, agentic RAG, and multi-step curriculum generation.',
    icon: langchain,
    variant: 'mono',
    tint: '#5FD3A6',
    top: '9%',
    left: '64%',
    drift: 6.9,
    delay: 2.05,
    side: 'left',
  },

  /* bottom row — clear of the centred page nav */
  {
    id: 'linux',
    label: 'Linux',
    blurb: 'Where the firmware work happens, and the reference the x86 mini OS file system was built against.',
    icon: linux,
    // Tux's real artwork is mostly near-black and would sink into the page, so
    // it is flattened to one light silhouette — same treatment as the GitHub
    // mark in Links.
    tint: '#E5E7EB',
    top: '84%',
    left: '31%',
    drift: 7.4,
    delay: 1.7,
    side: 'right',
  },
  {
    id: 'music',
    label: 'Music',
    // TODO(sidd): swap in what you actually listen to — this is placeholder copy.
    blurb: 'Headphones on is the default state. Long sets for deep work, louder things for chasing a race condition.',
    icon: spotify,
    tint: '#1ED760',
    top: '85%',
    left: '65%',
    drift: 8.3,
    delay: 0.75,
    side: 'left',
  },
]

function StickerCard({ s }: { s: Sticker }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      className="pointer-events-auto absolute"
      style={{ top: s.top, left: s.left }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.9 + s.delay * 0.18, duration: 0.5 }}
    >
      {/*
        The drift is its own layer so hover scaling never fights it. Each
        sticker traces a slow, uneven loop on both axes — the x and y periods
        differ, so the path never reads as a simple bob.
      */}
      <div
        className="sticker-drift"
        style={{ '--drift': `${s.drift}s`, '--drift-delay': `${s.delay}s` } as CSSProperties}
      >
        <button
          type="button"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          aria-label={s.label}
          className={cn(
            'group grid place-items-center rounded-lg transition-transform duration-200',
            'hover:scale-115',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent)/0.6)]',
          )}
        >
          {s.img ? (
            <img
              src={s.img}
              alt=""
              aria-hidden
              className={cn(
                // No drop-shadow here: a CSS filter spins up a render surface
                // and a blur pass, and on a subtree that moves every frame that
                // cost repeats every frame. See the note in StickerCard.
                'object-contain',
                s.imgFills
                  ? // this mark has an opaque background baked in, so with no
                    // chip behind it the art itself has to be the rounded
                    // shape — a circle reads as a badge, not a stray square
                    'h-16 w-16 rounded-full'
                  : // wide marks (the longhorn is ~2:1) would fit to width and
                    // render half-height in a square box, so size by height
                    'h-15 w-auto max-w-22',
              )}
            />
          ) : (
            s.icon && (
              <BrandIcon
                icon={s.icon}
                variant={s.variant}
                tint={s.tint}
                className="h-16 w-16"
              />
            )
          )}
        </button>
      </div>

      {/* hover card */}
      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0, x: open ? 0 : s.side === 'right' ? -6 : 6 }}
        transition={{ duration: 0.18 }}
        className={cn(
          'absolute top-1/2 z-30 w-60 -translate-y-1/2 rounded-xl border p-3.5 text-left',
          // neutral edge and fill — an accent-tinted card put an orange wash
          // behind the brand marks it is describing. See --surface in index.css.
          'border-[rgb(255_255_255/0.14)] bg-[rgb(var(--surface)/0.92)]',
          'shadow-[0_8px_30px_rgba(0,0,0,0.5)]',
          // The blur is attached only while the card is open. A backdrop-filter
          // re-snapshots and re-blurs its backdrop whenever that backdrop is
          // dirty, and ours is the shader — dirty every frame. Left always-on,
          // these eight hidden cards cost eight blur passes per frame for
          // something nobody is looking at.
          open ? 'backdrop-blur-md pointer-events-auto' : 'pointer-events-none',
          s.side === 'right' ? 'left-[calc(100%+14px)]' : 'right-[calc(100%+14px)]',
        )}
      >
        <p className="text-[12.5px] font-semibold tracking-tight ink">{s.label}</p>
        <p className="mt-1 text-[11.5px] leading-relaxed ink-muted">{s.blurb}</p>
      </motion.div>
    </motion.div>
  )
}

/**
 * Ambient stickers around the hero. The container ignores pointer events so it
 * never blocks the buttons underneath; each sticker re-enables them for itself.
 * Hidden below lg, where there is no room beside the centred text.
 */
export function FloatingStickers() {
  return (
    <div aria-hidden={false} className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
      {STICKERS.map((s) => (
        <StickerCard key={s.id} s={s} />
      ))}
    </div>
  )
}
