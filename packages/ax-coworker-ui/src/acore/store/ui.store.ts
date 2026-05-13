import { makeAutoObservable } from 'mobx'

export type ThemeMode = 'light' | 'dark'

export class UiStore {
  theme: ThemeMode = 'light'
  errors: string[] = []

  constructor() {
    makeAutoObservable(this)
  }

  setTheme(theme: ThemeMode) {
    this.theme = theme
  }

  pushError(message: string) {
    this.errors.push(message)
  }

  clearErrors() {
    this.errors = []
  }
}
