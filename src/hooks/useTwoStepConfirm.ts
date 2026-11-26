import { useState } from 'react'

/** First call arms the action, the second runs it; `cancel` disarms (e.g. on blur). */
export function useTwoStepConfirm(action: () => void) {
  const [armed, setArmed] = useState(false)
  const trigger = () => {
    if (!armed) return setArmed(true)
    setArmed(false)
    action()
  }
  return { armed, trigger, cancel: () => setArmed(false) }
}
