import { memo } from 'react'
import { num } from '../lib/pricing'
import type { Part } from '../lib/types'

const LAYER_LINES: Record<string, number> = { '0.08': 14, '0.12': 10, '0.16': 8, '0.20': 6, '0.28': 4 }

type Props = Pick<Part, 'layer' | 'infill' | 'multicolor' | 'hours' | 'minutes'> & { qty: number }

/**
 * Isometric printed block. Layer lines follow the layer height, the top hatch the infill,
 * the right face is coloured when multicolor, the height follows print time and copies
 * stack behind it for the quantity.
 */
export const PartDrawing = memo(function PartDrawing({ layer, infill, multicolor, hours, minutes, qty }: Props) {
  const n = LAYER_LINES[layer] ?? 6
  const hatch = Math.max(2, Math.min(10, Math.round((num(infill) || 20) / 10)))
  const copies = Math.min(qty, 3) - 1
  const h = 28 + Math.round(Math.min(num(hours) + num(minutes) / 60, 20) * 1.6)

  const block = (key: string, offset: number, solid: boolean) => (
    <g key={key} transform={`translate(${offset * 14} ${-offset * 10})`}>
      <path d="M60 10L100 30L60 50L20 30Z" className="d-face" />
      <path d={`M20 30L60 50V${50 + h}L20 ${30 + h}Z`} className="d-face" />
      <path d={`M60 50L100 30V${30 + h}L60 ${50 + h}Z`} className={solid && multicolor ? 'd-face d-color' : 'd-face'} />
      {solid &&
        Array.from({ length: n - 1 }, (_, k) => {
          const d = ((k + 1) * h) / n
          return (
            <g key={`l${k}`} className="d-thin">
              <path d={`M20 ${30 + d}L60 ${50 + d}`} />
              <path d={`M60 ${50 + d}L100 ${30 + d}`} />
            </g>
          )
        })}
      {solid &&
        Array.from({ length: hatch - 1 }, (_, k) => {
          const t = (k + 1) / hatch
          return <path key={`h${k}`} className="d-thin" d={`M${60 - 40 * t} ${10 + 20 * t}L${100 - 40 * t} ${30 + 20 * t}`} />
        })}
    </g>
  )

  return (
    <svg className="drawing" viewBox="0 0 150 110" aria-hidden="true" focusable="false">
      {Array.from({ length: copies }, (_, i) => block(`c${i}`, copies - i, false))}
      {block('main', 0, true)}
    </svg>
  )
})
