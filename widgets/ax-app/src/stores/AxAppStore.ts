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
export interface AxAppLabels {
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
// their canExecute/isExecuting guards) stay at the top level in AxAppSync, so the store and the
// layout never touch a widget value.
export interface AxAppActions {
  onClickLogo?: () => void
  onClickApps?: () => void
  onClickWorldMap?: () => void
  onClickNotify?: () => void
  onClickAccount?: () => void
  onClickSettings?: () => void
}

// Empty starting values. The store mounts with these and AxAppSync fills each group in via
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

const EMPTY_LABELS: AxAppLabels = {
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
//     AxAppSync pushes these in group-by-group via useEffect as the Mendix props resolve, so
//     late-arriving values are picked up after mount rather than captured once.
//
// All prop-derived fields are `observable.ref`: they're React nodes / Mendix value objects that should
// be tracked by reference (reassignment re-renders observers) without MobX deep-observing their guts.
// AxAppMain and the rail children read everything from this store — never the widget props.
export class AxAppStore {
  activeLeft: LeftPanelId = 'simulation'
  activeRight: RightPanelId = 'compare'
  rightOpen = true
  // The right view that was showing when the region was last closed. Saved on close so restoring the
  // main panel (or reopening) can bring back exactly that view rather than a default.
  lastRight: RightPanelId = 'compare'

  // --- Prop-derived view data (set by AxAppSync) -------------------------------------------
  name: string = 'axApp1'
  tabIndex?: number
  className: string = ''
  style?: CSSProperties
  labels: AxAppLabels = EMPTY_LABELS
  actions: AxAppActions = {}

  logoUrl?: string
  leftSlots: Record<LeftPanelId, ReactNode> = EMPTY_LEFT_SLOTS
  rightSlots: Record<RightPanelId, ReactNode> = EMPTY_RIGHT_SLOTS

  constructor() {
    // Prop-derived fields are reference-observable (they hold React nodes / Mendix value objects we
    // reassign wholesale). autoBind so methods can be passed straight as handlers (onClick={store.apps}).
    makeAutoObservable<AxAppStore, 'actions'>(
      this,
      {
        style: observable.ref,
        labels: observable.ref,
        actions: observable.ref,
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

  // --- Setters used by AxAppSync's effects -------------------------------------------------
  setWidget(name: string, className: string, style: CSSProperties | undefined, tabIndex: number | undefined): void {
    this.name = name
    this.className = className
    this.style = style
    this.tabIndex = tabIndex
  }

  setLabels(labels: AxAppLabels): void {
    this.labels = labels
  }

  setLogo(logoUrl: string | undefined): void {
    this.logoUrl = logoUrl
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
  // Opening/closing broadcasts AX_LAYOUT_RIGHT_CHANGED so an ax-panel can mirror it (right hidden →
  // maximize). `notify` is false when we're reacting to the panel's own broadcast, so we don't echo
  // back and bounce forever. The no-op guards also stop a redundant broadcast from re-triggering.
  toggleRight(id: RightPanelId): void {
    if (this.rightOpen && this.activeRight === id) {
      this.closeRight()
    } else {
      this.openRight(id)
    }
  }

  openRight(id: RightPanelId, notify = true): void {
    if (this.rightOpen && this.activeRight === id) return
    this.activeRight = id
    this.rightOpen = true
    if (notify) this.broadcast('AX_LAYOUT_RIGHT_CHANGED', { id, open: true })
  }

  closeRight(notify = true): void {
    if (!this.rightOpen) return
    this.lastRight = this.activeRight
    this.rightOpen = false
    if (notify) this.broadcast('AX_LAYOUT_RIGHT_CHANGED', { id: this.activeRight, open: false })
  }

  // --- Top bar ------------------------------------------------------------------------------------
  // Top-bar button handlers — pure passthroughs to the callbacks built in AxAppSync. These
  // buttons just fire their action; they carry no active/popover state.
  onClickLogo(): void {
    this.emit('ACT_ON_CLICK_LOGO', {})
  }

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

  // React to AX_LAYOUT_* notifications broadcast by an ax-panel inside the layout: collapse the right
  // region to give the maximized panel more room, and reopen the last-shown right view when the panel
  // is restored or closed. Reacts silently (notify=false) so it doesn't echo back to the panel. The
  // layout's own AX_LAYOUT_*_CHANGED notifications share this prefix but fall through to default.
  handleLayout(action: string): void {
    switch (action) {
      case 'AX_LAYOUT_MAXIMIZED':
        this.closeRight(true)
        break
      case 'AX_LAYOUT_RESTORED':
        this.openRight(this.lastRight, true)
        break
      case 'AX_LAYOUT_CLOSED':
        this.closeRight(true)
        break
      default:
        break
    }
  }
}
