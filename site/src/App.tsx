/**
 * Personal site main page. One fixed background (Light Pillar) behind one page.
 *
 * The colour palette is finalised in index.css — see the note above `:root`.
 */
import { Background } from '@/components/backgrounds'
import { VariantFocus } from '@/variants/VariantFocus'

export default function App() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0">
        <Background />
      </div>

      <div className="relative z-10 h-full w-full">
        <VariantFocus />
      </div>
    </div>
  )
}
