import { createWidgetContext } from '@ax/common'
import type { AxAppStore } from './AxAppStore'

// Typed Provider + useStore for the layout's MobX store, built on the shared factory.
export const { Provider: AxAppProvider, useStore: useAxAppStore } = createWidgetContext<AxAppStore>('AxApp')
