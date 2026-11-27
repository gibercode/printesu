import { memo } from 'react'
import { Skeleton } from '../Skeleton'
import { useRate } from '../../store/rate'
import { formatBsNumber, formatNumber } from '../../lib/format'
import type { Quote } from '../../lib/pricing'
import type { Part, Settings } from '../../lib/types'
import './Breakdown.css'

type Props = { parts: Part[]; quote: Quote; settings: Settings }

function Amount({ usd }: { usd: number }) {
  const rate = useRate()
  return (
    <>
      <td className="r num">
        {rate.status === 'loading' ? <Skeleton width={8} /> : rate.status === 'ready' ? formatBsNumber(usd, rate.rate) : '—'}
      </td>
      <td className="r num muted">{formatNumber(usd)}</td>
    </>
  )
}

const pct = (raw: string) => (raw.trim() === '' ? 0 : Number(raw.replace(',', '.')) || 0)

export const Breakdown = memo(function Breakdown({ parts, quote, settings }: Props) {
  const costRows: [string, number][] = [
    ['Material', quote.material],
    ['Máquina', quote.machine],
  ]
  return (
    <div className="breakdown">
      <h3 className="sub">Por pieza</h3>
      <table>
        <thead>
          <tr>
            <th scope="col">Pieza</th>
            <th scope="col" className="r">Bs (con fallos y margen)</th>
            <th scope="col" className="r">Ref. $</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((p, i) => (
            <tr key={i}>
              <th scope="row">
                {p.name.trim() ? (
                  <>
                    {p.name.trim()}
                    <span className="muted">
                      {' '}
                      · ×{quote.lines[i]?.qty ?? 1} {p.material}, {p.layer} mm{p.multicolor ? ', multicolor' : ''}
                    </span>
                  </>
                ) : (
                  <>
                    ×{quote.lines[i]?.qty ?? 1} {p.material}
                    <span className="muted">
                      , {p.layer} mm{p.multicolor ? ', multicolor' : ''}
                    </span>
                  </>
                )}
              </th>
              <Amount usd={quote.lines[i]?.final ?? 0} />
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="sub">Desglose de costes</h3>
      <table>
        <thead>
          <tr>
            <th scope="col">Concepto</th>
            <th scope="col" className="r">Bs</th>
            <th scope="col" className="r">Ref. $</th>
          </tr>
        </thead>
        <tbody>
          {costRows.map(([label, usd]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <Amount usd={usd} />
            </tr>
          ))}
          <tr className="rule">
            <th scope="row">Subtotal</th>
            <Amount usd={quote.subtotal} />
          </tr>
          <tr>
            <th scope="row">
              Fallos <span className="muted">+{pct(settings.failurePct)}%</span>
            </th>
            <Amount usd={quote.failure} />
          </tr>
          <tr>
            <th scope="row">
              Margen <span className="muted">+{pct(settings.marginPct)}%</span>
            </th>
            <Amount usd={quote.margin} />
          </tr>
          <tr className="rule total-row">
            <th scope="row">Total</th>
            <Amount usd={quote.total} />
          </tr>
        </tbody>
      </table>
    </div>
  )
})
