import { AppStore } from './app.store'
import { AuthStore } from './auth.mock'
import { DocumentStore } from '@/acore/store/document.store.ts'

export class RootStore {
  app = new AppStore()
  auth = new AuthStore()
  documents = new DocumentStore()
}

export const rootStore = new RootStore()
