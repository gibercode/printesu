import { useMemo } from 'react'
import { computeQuote } from '../lib/pricing'
import type { QuoteForm } from '../lib/types'

export function useQuote({ parts, settings }: Pick<QuoteForm, 'parts' | 'settings'>) {
  return useMemo(() => computeQuote(parts, settings), [parts, settings])
}
