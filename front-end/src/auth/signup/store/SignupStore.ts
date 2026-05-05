import { makeAutoObservable, runInAction } from 'mobx'

export class SignupStore {
  name = ''
  email = ''
  password = ''
  confirmPassword = ''
  isSubmitting = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setName = (value: string) => {
    this.name = value
    this.error = null
  }

  setEmail = (value: string) => {
    this.email = value
    this.error = null
  }

  setPassword = (value: string) => {
    this.password = value
    this.error = null
  }

  setConfirmPassword = (value: string) => {
    this.confirmPassword = value
    this.error = null
  }

  submit = async () => {
    if (!this.name || !this.email || !this.password) {
      this.error = 'Please fill in all required fields.'
      return
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.'
      return
    }
    this.isSubmitting = true
    this.error = null
    await new Promise((resolve) => setTimeout(resolve, 600))
    runInAction(() => {
      this.isSubmitting = false
      this.error = 'Mock signup — wire to real auth API.'
    })
  }
}
