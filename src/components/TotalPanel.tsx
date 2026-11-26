import { Receipt } from 'lucide-react'
import { RateNote } from './RateNote'
import { Skeleton } from './Skeleton'
import { useRate } from '../context/rate'
import { formatBs, formatRef } from '../lib/format'

type Props = {
  total: number
  delta: number
  partCount: number
  refreshing: boolean
  onRefreshRate: () => void
}

export function TotalPanel({ total, delta, partCount, refreshing, onRefreshRate }: Props) {
  const rate = useRate()
  const main = (usd: number) => (rate.status === 'ready' ? formatBs(usd, rate.rate) : formatRef(usd))
  const note =
    total === 0
      ? ''
      : `${partCount} ${partCount === 1 ? 'pieza' : 'piezas'} · ${
          delta !== 0 ? `último cambio ${delta > 0 ? '+' : '−'}${main(Math.abs(delta))}` : 'cálculo con tus costes'
        }`
  return (
    <section className="total" role="status" aria-busy={rate.status === 'loading'}>
      <h2 className="total-label">
        <Receipt size={18} aria-hidden="true" />
        Total estimado
      </h2>
      <p className="total-figure num">
        {rate.status === 'loading' ? <Skeleton width={11} className="on-dark" /> : <span className="reveal">{main(total)}</span>}
      </p>
      <p className="total-bs num">{rate.status === 'error' ? 'Bs —' : formatRef(total)}</p>
      <p className="total-note">{note}</p>
      <RateNote onRefresh={onRefreshRate} refreshing={refreshing} />
    </section>
  )
}
