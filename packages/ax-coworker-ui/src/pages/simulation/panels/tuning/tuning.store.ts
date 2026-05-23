import { makeAutoObservable } from 'mobx'

export class TuningStore {
  constructor() {
    makeAutoObservable(this)
  }
}
