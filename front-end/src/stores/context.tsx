import { createContext, useContext, type ReactNode } from 'react'
import { rootStore, type RootStore } from './RootStore'

const StoreContext = createContext<RootStore | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  return <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
}

export function useStore(): RootStore {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore must be used within a StoreProvider')
  return store
}
