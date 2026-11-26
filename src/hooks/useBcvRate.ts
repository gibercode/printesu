import { useCallback, useEffect, useState } from 'react'
import { fetchBcvRate } from '../lib/bcv'

export type RateState =
  | { status: 'loading' }
  | { status: 'ready'; rate: number; stale: boolean }
  | { status: 'error' }

/**
 * Fetches the BCV rate on mount. `refresh` revalidates without dropping the value on screen:
 * if the retry fails the previous rate is kept and flagged `stale`. Aborts on unmount.
 */
export function useBcvRate() {
  const [state, setState] = useState<RateState>({ status: 'loading' })
  const [refreshing, setRefreshing] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchBcvRate(controller.signal)
      .then(({ rate }) => {
        setState({ status: 'ready', rate, stale: false })
        setRefreshing(false)
      })
      .catch(() => {
        if (controller.signal.aborted) return
        setState((s) => (s.status === 'ready' ? { ...s, stale: true } : { status: 'error' }))
        setRefreshing(false)
      })
    return () => controller.abort()
  }, [attempt])

  const refresh = useCallback(() => {
    setRefreshing(true)
    setState((s) => (s.status === 'ready' ? s : { status: 'loading' }))
    setAttempt((a) => a + 1)
  }, [])

  return { state, refreshing, refresh }
}
