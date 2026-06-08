import { createContext, useContext } from 'react'
import type { HomeStore } from './home.store'

export const HomeContext = createContext<HomeStore | null>(null)

export function useHomeContext(): HomeStore {
  const store = useContext(HomeContext)
  if (!store) {
    throw new Error('useHomeContext must be used inside HomeContext.Provider')
  }
  return store
}
