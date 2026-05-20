import { AuthStore } from './auth.store'
import { DocumentStore } from './document.store'
import { HomeStore } from './home.store'
import { SimulationStore } from './simulation.store'
import { UiStore } from './ui.store'

export class RootStore {
  auth = new AuthStore()
  ui = new UiStore()
  documents = new DocumentStore()
  home = new HomeStore()
  simulation = new SimulationStore()
}

export const rootStore = new RootStore()
