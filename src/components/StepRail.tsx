import { memo } from 'react'
import { Skeleton } from './Skeleton'
import { useRate } from '../context/rate'
import { scrollToId } from '../lib/scroll'
import { formatBs, formatBsNumber, formatNumber, formatRef } from '../lib/format'
import type { Quote } from '../lib/pricing'
import type { Part } from '../lib/types'

type Props = { ids: string[]; parts: Part[]; quote: Quote }

/** One tab per part; its height follows the part's share of the price. */
export const StepRail = memo(function StepRail({ ids, parts, quote }: Props) {
  const rate = useRate()
  const sum = quote.lines.reduce((a, l) => a + l.final, 0)
  return (
    <nav className="rail" aria-label="Piezas del presupuesto">
      {ids.map((id, i) => {
        const price = quote.lines[i]?.final ?? 0
        const share = sum > 0 ? price / sum : 0
        return (
          <button
            key={id}
            type="button"
            onClick={() => scrollToId(id)}
            className="tab"
            style={{ height: 44 + Math.round(share * 56) }}
            aria-label={`Pieza ${i + 1}, ${parts[i]?.name.trim() || 'sin nombre'}, ${rate.status === 'ready' ? formatBs(price, rate.rate) : formatRef(price)}`}
          >
            <span className="tab-n">{i + 1}</span>
            <span className="tab-p">{rate.status === 'loading' ? <Skeleton width={5} /> : rate.status === 'ready' ? formatBsNumber(price, rate.rate) : formatNumber(price)}</span>
          </button>
        )
      })}
    </nav>
  )
})
