import { makeAutoObservable, runInAction } from 'mobx'

export class VerifyStore {
  code = ''
  isSubmitting = false
  isResending = false
  resendNotice: string | null = null
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setCode = (value: string) => {
    this.code = value.replace(/\s+/g, '').slice(0, 6)
    this.error = null
  }

  submit = async () => {
    if (this.code.length !== 6) {
      this.error = 'Enter the 6-character code from your email.'
      return
    }
    this.isSubmitting = true
    this.error = null
    await new Promise((resolve) => setTimeout(resolve, 600))
    runInAction(() => {
      this.isSubmitting = false
      this.error = 'Mock verify — wire to real auth API.'
    })
  }

  resend = async () => {
    this.isResending = true
    this.resendNotice = null
    await new Promise((resolve) => setTimeout(resolve, 400))
    runInAction(() => {
      this.isResending = false
      this.resendNotice = 'A new code has been sent.'
    })
  }
}
