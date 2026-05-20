import { makeAutoObservable } from 'mobx'

export type PanelId = 'regionLeft' | 'regionRight'
export type PanelState = 'normal' | 'maximized' | 'hidden'
export type PanelStates = Record<PanelId, PanelState>

export type MainPanelId = 'gantt' | 'analysis' | 'project' | 'dataset' | 'tuning' | 'factor' | 'standard' | 'setting' | 'integration' | 'schema'
export type SubPanelId = 'splitView' | 'aiAssistant' | 'progress'

const MAIN_PANEL_ID: PanelId = 'regionLeft'
const SUB_REGION_ID: PanelId = 'regionRight'

const initialStates: PanelStates = {
  regionLeft: 'normal',
  regionRight: 'normal',
}

export class SimulationStore {
  panelStates: PanelStates = { ...initialStates }
  activeMainPanel: MainPanelId = 'gantt'
  activeSubPanel: SubPanelId = 'aiAssistant'
  // Whether the right column was visible right before the main panel was maximized — restored on toggle back to normal.
  private rightVisibleBeforeMaximize = true

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
      this.rightVisibleBeforeMaximize = this.panelStates[SUB_REGION_ID] !== 'hidden'
      this.panelStates[SUB_REGION_ID] = 'hidden'
    }
    this.panelStates[id] = 'maximized'
  }

  restore(id: PanelId) {
    if (id === MAIN_PANEL_ID && this.panelStates[id] === 'maximized') {
      this.panelStates[SUB_REGION_ID] = this.rightVisibleBeforeMaximize ? 'normal' : 'hidden'
    }
    this.panelStates[id] = 'normal'
  }

  hide(id: PanelId) {
    this.panelStates[id] = 'hidden'
  }

  setActiveMainPanel(id: MainPanelId) {
    this.activeMainPanel = id
  }

  toggleSubPanel(id: SubPanelId) {
    if (this.activeSubPanel === id && this.panelStates[SUB_REGION_ID] !== 'hidden') {
      this.panelStates[SUB_REGION_ID] = 'hidden'
    } else {
      this.activeSubPanel = id
      this.panelStates[SUB_REGION_ID] = 'normal'
    }
  }
}

export const simulationStore = new SimulationStore()
