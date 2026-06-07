import { AppStore } from './app.store'
import { AuthStore } from './auth.mock2'
import { DocumentStore } from '@/acore/store/document.store.ts'
import { ProductionLineStore } from './production-line.store'

export class RootStore {
  app = new AppStore()
  auth = new AuthStore()
  documents = new DocumentStore()
  productionLine = new ProductionLineStore()
}

export const rootStore = new RootStore()
