import { createWidgetContext } from '@ax/common'
import type { AxLoginStore } from './AxLoginStore'

// Typed Provider + useStore for the login widget's MobX store, built on the shared factory.
export const { Provider: AxLoginProvider, useStore: useAxLoginStore } = createWidgetContext<AxLoginStore>('AxLogin')
