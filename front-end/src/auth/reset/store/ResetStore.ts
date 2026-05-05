import { makeAutoObservable, runInAction } from 'mobx'

export class ResetStore {
  email = ''
  isSubmitting = false
  isSent = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setEmail = (value: string) => {
    this.email = value
    this.error = null
  }

  submit = async () => {
    if (!this.email) {
      this.error = 'Email is required.'
      return
    }
    this.isSubmitting = true
    this.error = null
    await new Promise((resolve) => setTimeout(resolve, 600))
    runInAction(() => {
      this.isSubmitting = false
      this.isSent = true
    })
  }

  reset = () => {
    this.email = ''
    this.isSent = false
    this.error = null
  }
}
