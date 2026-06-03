import { createWidgetContext } from '@ax/common'
import type { AxSigninStore } from './AxSigninStore'

// Typed Provider + useStore for the signin widget's MobX store, built on the shared factory.
export const { Provider: AxSigninProvider, useStore: useAxSigninStore } = createWidgetContext<AxSigninStore>('AxSignin')
