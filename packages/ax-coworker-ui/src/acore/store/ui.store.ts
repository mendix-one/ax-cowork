import { makeAutoObservable } from 'mobx'

export type ThemeMode = 'light' | 'dark'

export class UiStore {
  theme: ThemeMode = 'light'
  errors: string[] = []
  settingModalOpen = false
  accountModalOpen = false
  notifyModalOpen = false
  guidesModalOpen = false
  supportModalOpen = false

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

  openSettingModal() {
    this.settingModalOpen = true
  }

  closeSettingModal() {
    this.settingModalOpen = false
  }

  openAccountModal() {
    this.accountModalOpen = true
  }

  closeAccountModal() {
    this.accountModalOpen = false
  }

  openNotifyModal() {
    this.notifyModalOpen = true
  }

  closeNotifyModal() {
    this.notifyModalOpen = false
  }

  openGuidesModal() {
    this.guidesModalOpen = true
  }

  closeGuidesModal() {
    this.guidesModalOpen = false
  }

  openSupportModal() {
    this.supportModalOpen = true
  }

  closeSupportModal() {
    this.supportModalOpen = false
  }
}
