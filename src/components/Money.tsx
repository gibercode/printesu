import { Skeleton } from './Skeleton'
import { useRate } from '../context/rate'
import { formatBs, formatRef } from '../lib/format'

/** Price in bolívares at the BCV rate, with the dollar reference (Ref. $) underneath. */
export function Money({ usd, className }: { usd: number; className?: string }) {
  const rate = useRate()
  return (
    <span className={`money${className ? ` ${className}` : ''}`}>
      <strong className="num">
        {rate.status === 'loading' ? (
          <Skeleton width={9} />
        ) : rate.status === 'ready' ? (
          <span className="reveal">{formatBs(usd, rate.rate)}</span>
        ) : (
          formatRef(usd)
        )}
      </strong>
      <small className="num">{rate.status === 'error' ? 'Bs —' : formatRef(usd)}</small>
    </span>
  )
}
