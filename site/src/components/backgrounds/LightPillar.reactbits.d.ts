import type { CSSProperties, FC } from 'react'

/**
 * Types for the vendored React Bits LightPillar, which ships as plain JS
 * (the LightPillar-JS-CSS registry item). Mirrors the impl's prop defaults.
 */
export interface LightPillarProps {
  topColor?: string
  bottomColor?: string
  intensity?: number
  rotationSpeed?: number
  interactive?: boolean
  className?: string
  glowAmount?: number
  pillarWidth?: number
  pillarHeight?: number
  noiseIntensity?: number
  mixBlendMode?: CSSProperties['mixBlendMode']
  pillarRotation?: number
  quality?: 'low' | 'medium' | 'high'
}

declare const LightPillar: FC<LightPillarProps>
export default LightPillar
