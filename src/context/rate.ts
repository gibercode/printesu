import { createContext, useContext } from 'react'
import type { RateState } from '../hooks/useBcvRate'

export const RateContext = createContext<RateState>({ status: 'loading' })
export const useRate = () => useContext(RateContext)
