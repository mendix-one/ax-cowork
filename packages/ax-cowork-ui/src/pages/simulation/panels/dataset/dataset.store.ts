import { makeAutoObservable } from 'mobx'

export class DatasetStore {
  constructor() {
    makeAutoObservable(this)
  }
}
