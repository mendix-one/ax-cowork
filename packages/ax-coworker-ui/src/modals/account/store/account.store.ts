import { makeAutoObservable } from 'mobx'
import type { SessionAccountInfo } from '@/acore/store/auth.store'

// Sidebar menu keys. String-literal union (not an enum — `erasableSyntaxOnly` forbids those).
export type AccountMenuKey = 'profile' | 'setting' | 'roles' | 'session'

// Local store scoped to the AccountModal — not on RootStore. Snapshots the account info
// from auth.currentAccount when the modal opens so the modal can render against a stable
// view that doesn't flicker if auth refreshes mid-edit. Also owns which sidebar menu item
// is active.
export class AccountStore {
  account: SessionAccountInfo | null = null
  activeMenu: AccountMenuKey = 'profile'

  constructor() {
    makeAutoObservable(this)
  }

  // Copy auth's current account snapshot into this store. Called when the modal opens; the
  // modal then renders against `this.account` instead of reaching back into auth on every
  // observable read.
  syncFromAuth(account: SessionAccountInfo | null): void {
    this.account = account
  }

  setActiveMenu(key: AccountMenuKey): void {
    this.activeMenu = key
  }

  // Reset to the default menu so the next open of the modal lands on the profile tab.
  reset(): void {
    this.activeMenu = 'profile'
    this.account = null
  }
}
