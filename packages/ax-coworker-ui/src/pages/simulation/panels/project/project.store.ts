import { makeAutoObservable } from 'mobx'

export class ProjectStore {
  constructor() {
    makeAutoObservable(this)
  }
}
