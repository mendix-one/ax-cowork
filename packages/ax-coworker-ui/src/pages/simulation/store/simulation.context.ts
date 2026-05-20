import { createContext, useContext } from 'react'
import type { SimulationStore } from './simulation.store'

export const SimulationContext = createContext<SimulationStore | null>(null)

export function useSimulationContext(): SimulationStore {
  const store = useContext(SimulationContext)
  if (!store) {
    throw new Error('useSimulationContext must be used inside SimulationContext.Provider')
  }
  return store
}
