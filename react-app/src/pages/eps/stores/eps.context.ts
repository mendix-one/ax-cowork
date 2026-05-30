import { createContext, useContext } from 'react'
import type { EpsStore } from './eps.store'

export const EpsContext = createContext<EpsStore | null>(null)

export function useEpsContext(): EpsStore {
  const store = useContext(EpsContext)
  if (!store) {
    throw new Error('useEpsContext must be used inside EpsContext.Provider')
  }
  return store
}
