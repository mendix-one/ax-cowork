import { makeAutoObservable } from 'mobx'

export type PanelId = 'regionLeft' | 'regionRightTop' | 'regionRightBottom'
export type PanelState = 'normal' | 'maximized' | 'hidden'
export type PanelStates = Record<PanelId, PanelState>

export type MainPanelId = 'gantt' | 'analysis' | 'project' | 'dataset' | 'tuning' | 'factor' | 'standard' | 'setting' | 'integration' | 'schema'

const MAIN_PANEL_ID: PanelId = 'regionLeft'
const SUB_PANEL_IDS: PanelId[] = ['regionRightTop', 'regionRightBottom']

const initialStates: PanelStates = {
  regionLeft: 'normal',
  regionRightTop: 'normal',
  regionRightBottom: 'normal',
}

export class SimulationStore {
  panelStates: PanelStates = { ...initialStates }
  activeMainPanel: MainPanelId = 'gantt'
  // Sub panels that were visible right before the main panel was maximized — restored on toggle back to normal.
  private subsBeforeMaximize: PanelId[] = []

  constructor() {
    makeAutoObservable(this)
  }

  isHidden(id: PanelId): boolean {
    return this.panelStates[id] === 'hidden'
  }

  isMaximized(id: PanelId): boolean {
    return this.panelStates[id] === 'maximized'
  }

  maximize(id: PanelId) {
    if (id === MAIN_PANEL_ID) {
      this.subsBeforeMaximize = SUB_PANEL_IDS.filter((s) => this.panelStates[s] !== 'hidden')
      for (const s of SUB_PANEL_IDS) this.panelStates[s] = 'hidden'
    }
    this.panelStates[id] = 'maximized'
  }

  restore(id: PanelId) {
    if (id === MAIN_PANEL_ID && this.panelStates[id] === 'maximized') {
      for (const s of this.subsBeforeMaximize) this.panelStates[s] = 'normal'
      this.subsBeforeMaximize = []
    }
    this.panelStates[id] = 'normal'
  }

  hide(id: PanelId) {
    this.panelStates[id] = 'hidden'
  }

  setActiveMainPanel(id: MainPanelId) {
    this.activeMainPanel = id
  }
}

export const simulationStore = new SimulationStore()
