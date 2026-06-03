import { makeAutoObservable } from 'mobx'

// The nine left-rail content views and four right-rail content views. IDs are the source of truth
// shared by the rail menus, the content stacks, and this store.
export type LeftPanelId =
  | 'simulation'
  | 'projects'
  | 'analysis'
  | 'pmData'
  | 'tuningLogic'
  | 'factorControl'
  | 'pmStandard'
  | 'integration'
  | 'setting'

export type RightPanelId = 'compare' | 'aiAssistant' | 'recommendation' | 'history'

// Top-bar toggle targets (notification / account / system-settings popovers). Mirrors react-app's
// MpsLayoutTop, where each is an independent `app.*ModalOpen` flag driving the icon's is-active state.
export type TopPanelId = 'notify' | 'account' | 'settings'

// MobX store owning only the layout shell's interaction state: which left view is active, which right
// view is active, and whether the right region is open. All content panels stay mounted (the layout
// renders every drop zone); the store just flips which one is visible so switching is a CSS fade with
// no remount / scroll loss.
export class AxSimulationStore {
  activeLeft: LeftPanelId = 'simulation'
  activeRight: RightPanelId = 'compare'
  rightOpen = true
  // Which top-bar popover is currently open, if any. Only one at a time; null when all are closed.
  activeTop: TopPanelId | null = null

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  setActiveLeft(id: LeftPanelId): void {
    this.activeLeft = id
  }

  // Clicking the open top item closes it; clicking any other switches to it. Mirrors toggleRight.
  toggleTop(id: TopPanelId): void {
    this.activeTop = this.activeTop === id ? null : id
  }

  // Clicking the active+open right item closes the region; clicking any other opens it on that view.
  toggleRight(id: RightPanelId): void {
    if (this.rightOpen && this.activeRight === id) {
      this.rightOpen = false
    } else {
      this.activeRight = id
      this.rightOpen = true
    }
  }

  closeRight(): void {
    this.rightOpen = false
  }
}
