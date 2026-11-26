import { Landmark, RefreshCw } from 'lucide-react'
import { Spinner } from './Skeleton'
import { useRate } from '../context/rate'
import { formatRate } from '../lib/format'

export function RateNote({ onRefresh, refreshing }: { onRefresh: () => void; refreshing: boolean }) {
  const rate = useRate()
  const busy = refreshing || rate.status === 'loading'
  return (
    <div className="rate" role="status" aria-busy={busy}>
      <p className="rate-text">
        {rate.status === 'loading' && (
          <>
            <Spinner /> Cargando tasa del BCV…
          </>
        )}
        {rate.status === 'ready' && (
          <>
            <Landmark size={16} aria-hidden="true" />
            Tasa BCV <span className="num">{formatRate(rate.rate)}</span> Bs/$
            {rate.stale && <span className="rate-warn"> · no se pudo actualizar</span>}
          </>
        )}
        {rate.status === 'error' && 'No se pudo obtener la tasa del BCV.'}
      </p>
      <button type="button" className="link" onClick={onRefresh} disabled={busy}>
        {busy ? <Spinner /> : <RefreshCw size={14} aria-hidden="true" />}
        {rate.status === 'error' ? 'Reintentar' : 'Actualizar'}
      </button>
    </div>
  )
}
