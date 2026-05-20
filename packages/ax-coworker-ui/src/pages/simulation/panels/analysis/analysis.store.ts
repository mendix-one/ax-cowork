import { makeAutoObservable } from 'mobx'

export class AnalysisStore {
  constructor() {
    makeAutoObservable(this)
  }
}
