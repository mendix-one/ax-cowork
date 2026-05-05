import { makeAutoObservable, runInAction } from 'mobx'

export class SigninStore {
  email = ''
  password = ''
  isSubmitting = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setEmail = (value: string) => {
    this.email = value
    this.error = null
  }

  setPassword = (value: string) => {
    this.password = value
    this.error = null
  }

  submit = async () => {
    if (!this.email || !this.password) {
      this.error = 'Email and password are required.'
      return
    }
    this.isSubmitting = true
    this.error = null
    await new Promise((resolve) => setTimeout(resolve, 600))
    runInAction(() => {
      this.isSubmitting = false
      this.error = 'Mock signin — wire to real auth API.'
    })
  }
}
