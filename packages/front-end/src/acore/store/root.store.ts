import { MainStore } from '../../pages/main/store/main.store'
import { ErrorStore } from '../../pages/error/store/error.store'

export class RootStore {
  main = new MainStore()
  error = new ErrorStore()
}

export const rootStore = new RootStore()
