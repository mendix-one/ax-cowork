import { makeAutoObservable } from 'mobx'

export class ErrorStore {
  message: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setMessage(message: string | null) {
    this.message = message
  }
}
