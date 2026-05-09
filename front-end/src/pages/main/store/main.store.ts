import { makeAutoObservable } from 'mobx'

export class MainStore {
  loading = false

  constructor() {
    makeAutoObservable(this)
  }
}
