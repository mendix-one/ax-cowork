import { createContext, useContext } from 'react'
import type { MpsStore } from './mps.store'

export const MpsContext = createContext<MpsStore | null>(null)

export function useMpsContext(): MpsStore {
  const store = useContext(MpsContext)
  if (!store) {
    throw new Error('useMpsContext must be used inside MpsContext.Provider')
  }
  return store
}
