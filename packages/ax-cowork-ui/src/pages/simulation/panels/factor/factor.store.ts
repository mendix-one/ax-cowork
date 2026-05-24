import { makeAutoObservable } from 'mobx'

export class FactorStore {
  constructor() {
    makeAutoObservable(this)
  }
}
