import type { CSSProperties, ReactNode } from 'react'
import { makeAutoObservable, observable } from 'mobx'
import { AX_BROADCAST, emitEvent } from '@ax/common'

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

// Tooltip labels for every rail/top-bar button, keyed by id. Sourced from widget props (translatable
// in Studio). Left, right, and top labels all share this flat map — the ids don't collide.
export interface AxSimulationLabels {
  // left rail
  simulation: string
  projects: string
  analysis: string
  pmData: string
  tuningLogic: string
  setting: string
  // right rail
  compare: string
  aiAssistant: string
  recommendation: string
  history: string
  // top bar
  apps: string
  worldMap: string
  notify: string
  account: string
  settings: string
}

// Top-bar click handlers. Only plain callbacks cross into the store — the Mendix `ActionValue`s (and
// their canExecute/isExecuting guards) stay at the top level in AxSimulationSync, so the store and the
// layout never touch a widget value.
export interface AxSimulationActions {
  onClickApps?: () => void
  onClickWorldMap?: () => void
  onClickNotify?: () => void
  onClickAccount?: () => void
  onClickSettings?: () => void
}

// Empty starting values. The store mounts with these and AxSimulationSync fills each group in via
// useEffect as the widget props become available — some Mendix values (e.g. the context datasource)
// aren't resolved at mount, so the layout component must not assume any prop is present on first paint.
const EMPTY_LEFT_SLOTS: Record<LeftPanelId, ReactNode> = {
  simulation: null,
  projects: null,
  analysis: null,
  pmData: null,
  tuningLogic: null,
  factorControl: null,
  pmStandard: null,
  integration: null,
  setting: null,
}

const EMPTY_RIGHT_SLOTS: Record<RightPanelId, ReactNode> = {
  compare: null,
  aiAssistant: null,
  recommendation: null,
  history: null,
}

const EMPTY_LABELS: AxSimulationLabels = {
  simulation: '',
  projects: '',
  analysis: '',
  pmData: '',
  tuningLogic: '',
  setting: '',
  compare: '',
  aiAssistant: '',
  recommendation: '',
  history: '',
  apps: '',
  worldMap: '',
  notify: '',
  account: '',
  settings: '',
}

// MobX store owning the layout shell. It holds two kinds of state:
//
//  1. Interaction state — which left/right view is active and whether the right region is open. This
//     drives the CSS fade between views (every panel stays mounted).
//  2. Prop-derived view data — the drop-zone nodes, labels, layout attributes, and top-bar actions.
//     AxSimulationSync pushes these in group-by-group via useEffect as the Mendix props resolve, so
//     late-arriving values are picked up after mount rather than captured once.
//
// All prop-derived fields are `observable.ref`: they're React nodes / Mendix value objects that should
// be tracked by reference (reassignment re-renders observers) without MobX deep-observing their guts.
// AxSimulationMain and the rail children read everything from this store — never the widget props.
export class AxSimulationStore {
  activeLeft: LeftPanelId = 'simulation'
  activeRight: RightPanelId = 'compare'
  rightOpen = true

  // --- Prop-derived view data (set by AxSimulationSync) -------------------------------------------
  name: string = 'axSimulation1'
  tabIndex?: number
  className: string = ''
  style?: CSSProperties
  labels: AxSimulationLabels = EMPTY_LABELS
  actions: AxSimulationActions = {}

  logo: ReactNode = null
  leftSlots: Record<LeftPanelId, ReactNode> = EMPTY_LEFT_SLOTS
  rightSlots: Record<RightPanelId, ReactNode> = EMPTY_RIGHT_SLOTS

  constructor() {
    // Prop-derived fields are reference-observable (they hold React nodes / Mendix value objects we
    // reassign wholesale). autoBind so methods can be passed straight as handlers (onClick={store.apps}).
    makeAutoObservable<AxSimulationStore, 'actions'>(
      this,
      {
        style: observable.ref,
        labels: observable.ref,
        actions: observable.ref,
        logo: observable.ref,
        leftSlots: observable.ref,
        rightSlots: observable.ref,
      },
      { autoBind: true },
    )
  }

  // Broadcast a layout state-change notification on the global bus (for child widgets to react).
  private emit(action: string, payload?: unknown): void {
    emitEvent(`ax:${this.name}`, { action, payload })
  }

  // Broadcast a layout state-change notification on the global bus (for child widgets to react).
  private broadcast(action: string, payload?: unknown): void {
    emitEvent(AX_BROADCAST, { action, payload })
  }

  // --- Setters used by AxSimulationSync's effects -------------------------------------------------
  setWidget(name: string, className: string, style: CSSProperties | undefined, tabIndex: number | undefined): void {
    this.name = name
    this.className = className
    this.style = style
    this.tabIndex = tabIndex
  }

  setLabels(labels: AxSimulationLabels): void {
    this.labels = labels
  }

  setLogo(logo: ReactNode): void {
    this.logo = logo
  }

  setLeftSlots(slots: Record<LeftPanelId, ReactNode>): void {
    this.leftSlots = slots
  }

  setRightSlots(slots: Record<RightPanelId, ReactNode>): void {
    this.rightSlots = slots
  }

  // --- Left rail ----------------------------------------------------------------------------------
  // The left rail only selects a view (no open/close), so this is a plain switch — unlike toggleRight.
  selectLeft(id: LeftPanelId): void {
    this.activeLeft = id
    this.broadcast('AX_LAYOUT_LEFT_CHANGED', { id })
  }

  // --- Right rail ---------------------------------------------------------------------------------
  // Clicking the active+open right item closes the region; clicking any other opens it on that view.
  toggleRight(id: RightPanelId): void {
    if (this.rightOpen && this.activeRight === id) {
      this.rightOpen = false
    } else {
      this.activeRight = id
      this.rightOpen = true
    }
    this.broadcast('AX_LAYOUT_RIGHT_CHANGED', { id: this.activeRight, open: this.rightOpen })
  }

  openRight(id: RightPanelId): void {
    this.activeRight = id
    this.rightOpen = true
    this.broadcast('AX_LAYOUT_RIGHT_CHANGED', { id, open: true })
  }

  closeRight(): void {
    this.rightOpen = false
    this.broadcast('AX_LAYOUT_RIGHT_CHANGED', { id: this.activeRight, open: false })
  }

  // --- Top bar ------------------------------------------------------------------------------------
  // Top-bar button handlers — pure passthroughs to the callbacks built in AxSimulationSync. These
  // buttons just fire their action; they carry no active/popover state.
  onClickApps(): void {
    this.emit('ACT_ON_CLICK_APPS', {})
  }

  onClickWorldMap(): void {
    this.emit('ACT_ON_CLICK_WORLD_MAP', {})
  }

  onClickNotify(): void {
    this.emit('ACT_ON_CLICK_NOTIFY', {})
  }

  onClickAccount(): void {
    this.emit('ACT_ON_CLICK_ACCOUNT', {})
  }

  onClickSettings(): void {
    this.emit('ACT_ON_CLICK_SETTINGS', {})
  }

  // --- Global event bus ---------------------------------------------------------------------------
  // Dispatch a global-bus command to drive the layout from nanoflows / other widgets. Command names
  // are distinct from the `*-changed` notifications emitted above, so a broadcast command never loops
  // back into itself. Unknown ids are ignored (validated against the live slot maps).
  handleCommand(action: string, payload: unknown): void {
    switch (action) {
      case 'CMD_SET_LEFT':
        if (typeof payload === 'string' && payload in this.leftSlots) {
          this.selectLeft(payload as LeftPanelId)
        }
        break
      case 'CMD_OPEN_RIGHT':
        if (typeof payload === 'string' && payload in this.rightSlots) {
          this.openRight(payload as RightPanelId)
        }
        break
      case 'CMD_TOGGLE_RIGHT':
        if (typeof payload === 'string' && payload in this.rightSlots) {
          this.toggleRight(payload as RightPanelId)
        }
        break
      case 'CMD_CLOSE_RIGHT':
        this.closeRight()
        break
      default:
        break
    }
  }
}
