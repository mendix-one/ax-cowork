import { makeAutoObservable } from 'mobx'

export class SchemaStore {
  constructor() {
    makeAutoObservable(this)
  }
}
