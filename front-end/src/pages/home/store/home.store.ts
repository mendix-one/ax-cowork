import { makeAutoObservable } from 'mobx'

export class HomeStore {
  loading = false

  constructor() {
    makeAutoObservable(this)
  }
}
