import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const

// Chillax sets wider and rounder than Public Sans, so the tracking is eased off
// from -tight to -[-0.015em]; at 88px the tighter value pinched the round glyphs.
const H1 =
  'font-display text-[clamp(2.5rem,7.5vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.015em]'

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Per-letter blur-in — the original reveal. */
function LetterReveal({ text }: { text: string }) {
  return (
    <h1 className={H1}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.18 + i * 0.028, duration: 0.55, ease }}
          className="inline-block"
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </h1>
  )
}

/**
 * Letter reveal plus a specular sheen that sweeps across the glyphs on a loop.
 * The gradient is clipped to the text, so the highlight rides the letterforms.
 */
function Sheen({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  // One sweep every REST ms. The class is attached only while the highlight is
  // actually crossing, because the underlying animation repaints the glyphs on
  // every frame it runs — see the note beside .name-sheen in index.css. This
  // timer fires twice per cycle, so the cost between sweeps is nil.
  useEffect(() => {
    if (reduced()) return
    const SWEEP = 1900
    const REST = 7000
    let off: ReturnType<typeof setTimeout>

    const sweep = () => {
      const el = ref.current
      if (!el) return
      el.classList.add('name-sheen--run')
      off = setTimeout(() => el.classList.remove('name-sheen--run'), SWEEP)
    }

    const first = setTimeout(sweep, 1100)
    const loop = setInterval(sweep, REST)
    return () => {
      clearTimeout(first)
      clearTimeout(off)
      clearInterval(loop)
    }
  }, [])

  return (
    <h1 className={H1}>
      <motion.span
        ref={ref}
        className="name-sheen inline-block"
        initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease, delay: 0.15 }}
      >
        {text}
      </motion.span>
    </h1>
  )
}

/** Characters scramble through random glyphs before settling. */
function Decrypt({ text }: { text: string }) {
  const [out, setOut] = useState(() => (reduced() ? text : ' '.repeat(text.length)))
  const raf = useRef(0)

  useEffect(() => {
    if (reduced()) return
    const GLYPHS = '!<>-_\\/[]{}—=+*^?#0123456789ABCDEF'
    const start = performance.now()
    const DUR = 1500
    // each character locks in at a staggered point through the run
    const locks = text.split('').map((_, i) => (i / text.length) * (DUR * 0.62) + 260)

    const tick = (now: number) => {
      const t = now - start
      let s = ''
      let done = true
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          s += ' '
          continue
        }
        if (t >= locks[i]) s += text[i]
        else {
          done = false
          s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }
      }
      setOut(s)
      if (!done) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [text])

  return (
    <h1 className={H1}>
      <span className="inline-block whitespace-pre">{out}</span>
    </h1>
  )
}

/** Words slide up from behind a mask, one after another. */
function MaskUp({ text }: { text: string }) {
  return (
    <h1 className={H1}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ delay: 0.2 + i * 0.12, duration: 0.7, ease }}
          >
            {word}
            {i === 0 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </h1>
  )
}

/**
 * Each letter settles from a random offset and rotation — looser and more
 * playful than the uniform blur-in.
 */
function Scatter({ text }: { text: string }) {
  // deterministic pseudo-random so the layout is stable across renders
  const rand = (i: number, salt: number) => {
    const v = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453
    return v - Math.floor(v)
  }

  return (
    <h1 className={H1}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          initial={{
            opacity: 0,
            x: (rand(i, 1) - 0.5) * 140,
            y: (rand(i, 2) - 0.5) * 120,
            rotate: (rand(i, 3) - 0.5) * 70,
            filter: 'blur(6px)',
          }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.15 + i * 0.035, duration: 0.75, ease }}
          className="inline-block"
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </h1>
  )
}

export const TEXT_ANIMATIONS = {
  sheen: { label: 'Sheen', Component: Sheen },
  letters: { label: 'Letters', Component: LetterReveal },
  decrypt: { label: 'Decrypt', Component: Decrypt },
  mask: { label: 'Mask up', Component: MaskUp },
  scatter: { label: 'Scatter', Component: Scatter },
} as const

export type TextAnimKey = keyof typeof TEXT_ANIMATIONS

/**
 * The hero name. `sheen` won the comparison, so it is the default and the page
 * no longer passes a variant — the others are kept for a future revisit.
 */
export function AnimatedName({ text, variant = 'sheen' }: { text: string; variant?: TextAnimKey }) {
  const { Component } = TEXT_ANIMATIONS[variant] ?? TEXT_ANIMATIONS.sheen
  // remount on change so the animation replays when you switch options
  return <Component key={variant} text={text} />
}
