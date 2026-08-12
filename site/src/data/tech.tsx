import { useMemo } from 'react'
import c from '@thesvg/icons/c'
import cmake from '@thesvg/icons/cmake'
import cplusplus from '@thesvg/icons/cplusplus'
import docker from '@thesvg/icons/docker'
import googlecloud from '@thesvg/icons/googlecloud'
import kafka from '@thesvg/icons/kafka'
import kubernetes from '@thesvg/icons/kubernetes'
import langchain from '@thesvg/icons/langchain'
import linux from '@thesvg/icons/linux'
import nextdotjs from '@thesvg/icons/nextdotjs'
import nvidia from '@thesvg/icons/nvidia'
import postgresql from '@thesvg/icons/postgresql'
import python from '@thesvg/icons/python'
import react from '@thesvg/icons/react'
import redis from '@thesvg/icons/redis'
import rust from '@thesvg/icons/rust'
import typescript from '@thesvg/icons/typescript'

type IconModule = { svg: string; hex: string; title: string }

export type Tech = {
  label: string
  /** Full-colour brand SVG markup, when the brand has one. */
  icon?: IconModule
  /**
   * Chip tint. Defaults to the brand hex, but is overridden where that hex is
   * near-black (Rust, Next.js, LangChain) and would vanish on a dark page.
   */
  tint?: string
}

/**
 * Technologies shown on project cards.
 *
 * Icons come from `thesvg`, which ships real multi-colour brand artwork plus
 * the official hex. Hardware/EDA tools (SystemVerilog, Verilator, Quartus,
 * Pintos, bochs) have no brand icon in any set — they render as lettermark
 * chips, which is why `icon` is optional.
 */
export const TECH: Record<string, Tech> = {
  c: { label: 'C', icon: c },
  cpp: { label: 'C++', icon: cplusplus },
  cuda: { label: 'CUDA', icon: nvidia },
  python: { label: 'Python', icon: python },
  rust: { label: 'Rust', icon: rust, tint: '#DEA584' },
  typescript: { label: 'TypeScript', icon: typescript },
  react: { label: 'React', icon: react },
  next: { label: 'Next.js', icon: nextdotjs, tint: '#E5E7EB' },
  postgres: { label: 'PostgreSQL', icon: postgresql },
  docker: { label: 'Docker', icon: docker },
  k8s: { label: 'Kubernetes', icon: kubernetes },
  langchain: { label: 'LangChain', icon: langchain, tint: '#5FD3A6' },
  gcp: { label: 'GCP', icon: googlecloud, tint: '#4285F4' },
  kafka: { label: 'Kafka', icon: kafka, tint: '#9AA5B1' },
  redis: { label: 'Redis', icon: redis },
  linux: { label: 'Linux', icon: linux },
  cmake: { label: 'CMake', icon: cmake },

  // no brand glyph exists for these
  systemverilog: { label: 'SystemVerilog', tint: '#F4A460' },
  verilator: { label: 'Verilator', tint: '#8FBC8F' },
  quartus: { label: 'Quartus', tint: '#5AC8D8' },
  pintos: { label: 'Pintos', tint: '#C9A0DC' },
  bochs: { label: 'bochs', tint: '#9AA5B1' },
}

export type TechKey = string

/** Brand hexes that are effectively black — unusable on a dark surface. */
const isTooDark = (hex: string) => {
  const h = hex.replace('#', '')
  if (h.length !== 6) return false
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
  return 0.299 * r + 0.587 * g + 0.114 * b < 42
}

export function tintOf(t: Tech): string {
  if (t.tint) return t.tint
  if (!t.icon) return '#9AA5B1'
  const hex = t.icon.hex.startsWith('#') ? t.icon.hex : `#${t.icon.hex}`
  return isTooDark(hex) ? '#E5E7EB' : hex
}

/**
 * Prepares a brand SVG string for inlining.
 *
 * Several icons declare generic gradient/clip ids ("a", "Path"), so the ids are
 * namespaced per icon — otherwise the first one on the page wins and later ones
 * render with the wrong gradient. `tint` forces a flat colour for marks whose
 * brand artwork is near-black and would disappear on a dark page.
 */
function prepare(svg: string, ns: string, className: string, tint?: string) {
  const out = svg
    .replace(/id="([^"]+)"/g, (_m, id) => `id="${ns}-${id}"`)
    .replace(/url\(#([^)]+)\)/g, (_m, id) => `url(#${ns}-${id})`)
    .replace(/(xlink:href|href)="#([^"]+)"/g, (_m, attr, id) => `${attr}="#${ns}-${id}"`)
    // several marks hardcode width/height, which would beat the sizing classes
    .replace(/<svg([^>]*?)\s(width|height)="[^"]*"/g, '<svg$1')
    .replace(/<svg([^>]*?)\s(width|height)="[^"]*"/g, '<svg$1')
    .replace(/<svg /, `<svg class="${className}" `)

  if (!tint) return out
  // drop baked-in fills so `color` shows through, then paint via currentColor
  return out
    .replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"')
    .replace(/<svg /, `<svg style="color:${tint}" `)
}

const nsOf = (s: string) => `i${s.replace(/[^a-zA-Z0-9]/g, '')}`

/** Inlines any thesvg icon module, optionally picking a named variant. */
export function BrandIcon({
  icon,
  variant = 'default',
  tint,
  className = 'h-3.5 w-3.5',
}: {
  icon: { svg: string; title: string; variants?: Record<string, string> }
  variant?: string
  tint?: string
  className?: string
}) {
  const markup = useMemo(() => {
    const src = (variant !== 'default' && icon.variants?.[variant]) || icon.svg
    return prepare(src, nsOf(icon.title + variant), className, tint)
  }, [icon, variant, tint, className])

  // markup is build-time package data, not user input
  return <span aria-hidden className="inline-flex shrink-0" dangerouslySetInnerHTML={{ __html: markup }} />
}

/** Inlines the brand SVG for a Tech entry, if it has one. */
export function TechIcon({ tech, className = 'h-3.5 w-3.5' }: { tech: Tech; className?: string }) {
  const markup = useMemo(
    () => (tech.icon ? prepare(tech.icon.svg, nsOf(tech.label), className) : null),
    [tech, className],
  )

  if (!markup) return null
  // markup is build-time package data, not user input
  return <span aria-hidden className="inline-flex shrink-0" dangerouslySetInnerHTML={{ __html: markup }} />
}
