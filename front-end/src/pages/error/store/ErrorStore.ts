import { makeAutoObservable } from 'mobx'

export class ErrorStore {
  code = 404
  message = 'Page not found'

  constructor() {
    makeAutoObservable(this)
  }

  set = (code: number, message: string) => {
    this.code = code
    this.message = message
  }
}
