import { makeAutoObservable } from 'mobx'

export class GanttStore {
  constructor() {
    makeAutoObservable(this)
  }
}
