import { createWidgetContext } from '@ax/common'
import type { AxSimulationStore } from './AxSimulationStore'

// Typed Provider + useStore for the layout's MobX store, built on the shared factory.
export const { Provider: AxSimulationProvider, useStore: useAxSimulationStore } =
  createWidgetContext<AxSimulationStore>('AxSimulation')
