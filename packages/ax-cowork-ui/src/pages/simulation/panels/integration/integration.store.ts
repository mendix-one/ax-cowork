import { makeAutoObservable } from 'mobx'

export class IntegrationStore {
  constructor() {
    makeAutoObservable(this)
  }
}
