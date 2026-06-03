import { createWidgetContext } from '@ax/common'
import type { AxDisplayPanelStore } from './AxDisplayPanelStore'

// Typed Provider + useStore for the panel's MobX store, built on the shared factory.
export const { Provider: AxDisplayPanelProvider, useStore: useAxDisplayPanelStore } =
  createWidgetContext<AxDisplayPanelStore>('AxDisplayPanel')
