import { makeAutoObservable } from 'mobx'

export class StandardStore {
  constructor() {
    makeAutoObservable(this)
  }
}
