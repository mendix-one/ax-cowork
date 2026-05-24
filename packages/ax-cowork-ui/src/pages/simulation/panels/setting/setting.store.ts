import { makeAutoObservable } from 'mobx'

export class SettingStore {
  constructor() {
    makeAutoObservable(this)
  }
}
