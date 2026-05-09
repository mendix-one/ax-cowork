import { createContext, useContext } from 'react'
import type { RootStore } from './root.store'

export const StoreContext = createContext<RootStore | null>(null)

export function useStore(): RootStore {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('useStore must be used inside StoreContext.Provider')
  }
  return store
}
