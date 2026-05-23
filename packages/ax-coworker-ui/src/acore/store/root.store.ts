import { AuthStore } from './auth.store'
import { UiStore } from './ui.store'
import { DocumentStore } from '@/acore/store/document.store.ts'

export class RootStore {
  ui = new UiStore()
  auth = new AuthStore()
  documents = new DocumentStore()
}

export const rootStore = new RootStore()
