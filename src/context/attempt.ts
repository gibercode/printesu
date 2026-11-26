import { createContext, useContext } from 'react'

/** True once the user tried to export with missing data: empty required fields then show "Falta". */
export const AttemptContext = createContext(false)
export const useAttempted = () => useContext(AttemptContext)
