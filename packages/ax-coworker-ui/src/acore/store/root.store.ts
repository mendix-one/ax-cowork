import { AuthStore } from './auth.store'
import { DocumentStore } from './document.store'
import { UiStore } from './ui.store'

export class RootStore {
  auth = new AuthStore()
  ui = new UiStore()
  documents = new DocumentStore()
}

export const rootStore = new RootStore()
