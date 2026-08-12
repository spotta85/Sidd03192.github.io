import LightPillarImpl from './LightPillar.reactbits.jsx'

/**
 * Wraps the vendored React Bits LightPillar (see LightPillar.reactbits.jsx).
 * The impl positions itself absolutely, so it only needs a fixed stacking shell.
 *
 * The two gradient stops are the "Flare" scene — see the palette note above
 * `:root` in index.css, which lists the alternates these were chosen over. The
 * accent tokens are matched to the orange bottom stop, so changing either of
 * these colours means revisiting that block too.
 */
export function LightPillar() {
  return (
    <div className="fixed inset-0 -z-10">
      <LightPillarImpl
        topColor="#2c27ff"
        bottomColor="#f97316"
        intensity={0.9}
        rotationSpeed={0.5}
        interactive
        glowAmount={0.003}
        pillarWidth={2}
        pillarHeight={0.4}
        noiseIntensity={0.5}
        pillarRotation={210}
        /*
          The impl defaults to mixBlendMode 'screen', which forces the compositor
          to blend this full-viewport canvas against the page every frame instead
          of leaving it as an independent layer. Our page sits at --page 6 6 14 —
          near black — and screening against black is an identity operation, so
          the blend was buying nothing and costing a whole-page recomposite.
        */
        mixBlendMode="normal"
      />
      {/*
        Dark wash between the shader and the content — --scrim in index.css.
        Without it the orange end of the ray washes out the body copy on top.
      */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'rgb(var(--page) / var(--scrim, 0.3))' }}
      />
    </div>
  )
}
