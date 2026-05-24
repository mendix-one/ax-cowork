import { makeAutoObservable } from 'mobx'

export type ThemeMode = 'light' | 'dark'

// App-wide store: owns layout/UI state (theme, modals, error queue) and any global app-level
// actions/state that don't belong to a specific domain store (auth, documents, etc.). When
// adding a new piece of state, ask: "is this scoped to a feature?" — if yes, add to that
// feature's domain store instead. AppStore stays the catch-all for *truly* app-global concerns.
export class AppStore {
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
