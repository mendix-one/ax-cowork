import { AuthStore } from './auth.store'
import { UiStore } from './ui.store'

export class RootStore {
  auth = new AuthStore()
  ui = new UiStore()
}

export const rootStore = new RootStore()
