import { CounterStore } from './CounterStore'

export class RootStore {
  counter = new CounterStore()
}

export const rootStore = new RootStore()
