import { makeAutoObservable } from 'mobx'

export type PanelId = 'regionLeftSidebar' | 'regionMainContent' | 'regionMainBottom' | 'regionRightTop' | 'regionRightBottom'
export type PanelState = 'normal' | 'maximized' | 'hidden'
export type PanelStates = Record<PanelId, PanelState>

const initialStates: PanelStates = {
  regionLeftSidebar: 'normal',
  regionMainContent: 'normal',
  regionMainBottom: 'normal',
  regionRightTop: 'normal',
  regionRightBottom: 'normal',
}

export class HomeStore {
  panelStates: PanelStates = { ...initialStates }

  constructor() {
    makeAutoObservable(this)
  }

  get maximizedId(): PanelId | null {
    return (Object.keys(this.panelStates) as PanelId[]).find((id) => this.panelStates[id] === 'maximized') ?? null
  }

  isHidden(id: PanelId): boolean {
    return this.panelStates[id] === 'hidden'
  }

  isMaximized(id: PanelId): boolean {
    return this.panelStates[id] === 'maximized'
  }

  maximize(id: PanelId) {
    for (const k of Object.keys(this.panelStates) as PanelId[]) {
      if (k !== id && this.panelStates[k] === 'maximized') this.panelStates[k] = 'normal'
    }
    this.panelStates[id] = 'maximized'
  }

  restore(id: PanelId) {
    this.panelStates[id] = 'normal'
  }

  hide(id: PanelId) {
    this.panelStates[id] = 'hidden'
  }
}
