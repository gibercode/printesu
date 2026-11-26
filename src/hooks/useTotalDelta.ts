import { useState } from 'react'

/** Difference caused by the last edit. `reset` re-baselines when data is replaced wholesale. */
export function useTotalDelta(total: number) {
  const [prev, setPrev] = useState(total)
  const [delta, setDelta] = useState(0)
  if (total !== prev) {
    setPrev(total)
    setDelta(total - prev)
  }
  const reset = (next: number) => {
    setPrev(next)
    setDelta(0)
  }
  return [delta, reset] as const
}
