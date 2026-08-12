# Personal site — design prototype

**This is a throwaway prototype.** Two layouts of the main page, each renderable against
five animated backgrounds and five cursor effects, all on one route. Flip through them, pick
what you like, then we promote the winner and delete the rest.

```bash
npm install
npm run dev
```

Open http://localhost:5173 — the floating panel at the bottom is the switcher.

## Controls

- **← / →** (or the arrows in the panel) cycle layouts.
- The **bg** and **cursor** rows swap those axes independently.
- Every combination is a shareable URL: `/?layout=rail&bg=silk&cursor=crosshair`.
- The panel is dev-only — gated on `import.meta.env.PROD`, so it never ships.

## Layouts (`?layout=`)

| key | what it is |
| --- | --- |
| `rail` | Fixed identity column on the left; About / Experience / Projects / Stack swap in place on the right. About ends on the impact row. |
| `focus` | Minimal centered hero. Experience and Projects each get their own full screen, reached from the hero or the bottom nav. `Esc` returns home. |

Both are non-scrolling at desktop sizes and fall back to scrolling on narrow screens.

## Backgrounds (`?bg=`)

All React-Bits shapes, all WebGL, all cursor-reactive.

| key | what it is |
| --- | --- |
| `silk` | Domain-warped folds in cold blue-white. The cloth bunches toward the pointer. |
| `galaxy` | Twinkling star layers over a slowly rotating nebula; the field parts around the cursor. |
| `pillar` | Volumetric light shafts fanning from a source above the frame that slides toward the pointer. |
| `molten` | Molten metal — fbm surface with a real specular highlight off its normal, plus glowing seams. The cursor stirs the melt. |
| `waves` | Broad gradient colour fronts rolling across the frame. |

Silk's colour lives in `SILK_PALETTES` (`Silk.tsx`) as three vec3s fed in as uniforms, so
recolouring it — or adding a second colourway — is a data edit, not a shader edit.

Backgrounds set the colour tokens on `<html data-variant>`; every component reads only those
tokens (see `src/index.css`), so a background swap restyles the whole page — including the
cursor effects, which read the live accent — without touching layout code.

### Brightness budget

Backgrounds are tuned by sampling their canvas pixels rather than by eye: each sits around
avg 13–27 / max 23–62 out of 255, which keeps white body copy well clear of contrast trouble.
If you retune a shader, keep peak luma under roughly 70.

## Cursor effects (`?cursor=`)

React-Bits shapes: `none` · `blob` (springy gooey blobs at three lag rates) · `target`
(corner brackets that snap around whatever link or button is under the pointer) · `ribbons`
(three tapering streamers that fan out on fast movement) · `spark` (a burst of lines on click).

All draw in the current accent, and all are disabled on coarse pointers and under
`prefers-reduced-motion`.

## Layout

```
src/
  data/profile.ts          all copy, straight from the résumé — single source of truth
  components/backgrounds/  six backgrounds + useShader (WebGL boilerplate) + registry
  components/cursors/      the five pointer effects + registry
  components/ui/           Impact (count-up stats), Card, Badge, Links, Marquee, brand icons
  variants/                one file per layout
  components/PrototypeSwitcher.tsx
```

## Known gaps

- **LinkedIn URL is a guess.** `profile.links.linkedin` uses `linkedin.com/in/siddharth-potta`
  — the résumé PDF hyperlinks out but the URL isn't in its text layer. Confirm before shipping.
- The résumé PDF is copied to `public/siddharth-potta-resume.pdf`; re-copy it when the
  résumé changes.
