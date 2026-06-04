import type { CSSProperties, ReactNode } from 'react'
import type { WebIcon } from 'mendix'
import { makeAutoObservable, observable } from 'mobx'
import { AX_BROADCAST, emitEvent } from '@ax/common'

// One rail panel: a rail button (icon + caption tooltip) bound to a content view. AxSimulationSync builds
// one per item of the prpDsLeftPanels / prpDsRightPanels object lists; the rails and content stacks read
// them by array index, which is the source of truth for "which view is active". `no` is the panel-no
// used to group rail buttons (see AxPanelGroup).
export interface AxPanel {
  no: number
  icon?: WebIcon
  caption: string
  content: ReactNode
}

// Panels that share the same `no` render as one rail group; groups are ordered by `no` ascending and
// separated by a divider. Each item keeps its original index into leftPanels / rightPanels so the rail
// button still maps to the right content view (which stays in flat prop order).
export interface AxPanelGroup {
  no: number
  items: { panel: AxPanel; index: number }[]
}

function groupPanels(panels: AxPanel[]): AxPanelGroup[] {
  const groups = new Map<number, { panel: AxPanel; index: number }[]>()
  panels.forEach((panel, index) => {
    const items = groups.get(panel.no) ?? []
    items.push({ panel, index })
    groups.set(panel.no, items)
  })
  return [...groups.keys()].sort((a, b) => a - b).map((no) => ({ no, items: groups.get(no)! }))
}

// Tooltip labels for the fixed top-bar buttons. The rails are data-driven now, so their labels live on
// each panel (AxPanel.caption) — only the top bar still has a fixed set of labels sourced from props.
export interface AxSimulationTopBarLabels {
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
  onClickLogo?: () => void
  onClickApps?: () => void
  onClickWorldMap?: () => void
  onClickNotify?: () => void
  onClickAccount?: () => void
  onClickSettings?: () => void
}

const EMPTY_TOPBAR_LABELS: AxSimulationTopBarLabels = {
  apps: '',
  worldMap: '',
  notify: '',
  account: '',
  settings: '',
}

// MobX store owning the layout shell. It holds two kinds of state:
//
//  1. Interaction state — which left/right view (by index) is active and whether the right region is
//     open. This drives the CSS fade between views (every panel stays mounted).
//  2. Prop-derived view data — the panel lists (icon + caption + content per panel), top-bar labels,
//     layout attributes, and top-bar actions. AxSimulationSync pushes these in group-by-group via
//     useEffect as the Mendix props resolve, so late-arriving values are picked up after mount.
//
// All prop-derived fields are `observable.ref`: they're arrays / React nodes / Mendix value objects that
// should be tracked by reference (reassignment re-renders observers) without MobX deep-observing their
// guts. AxSimulationMain and the rail children read everything from this store — never the widget props.
export class AxSimulationStore {
  // Active view = index into the panel arrays (0 when a side has at least one panel).
  activeLeft = 0
  activeRight = 0
  rightOpen = false
  // The right view index that was showing when the region was last closed. Saved on close so restoring
  // the main panel (or reopening) can bring back exactly that view rather than a default.
  lastRight = 0

  // --- Prop-derived view data (set by AxSimulationSync) -------------------------------------------
  name: string = 'axSimulation1'
  tabIndex?: number
  className: string = ''
  style?: CSSProperties
  labels: AxSimulationTopBarLabels = EMPTY_TOPBAR_LABELS
  actions: AxSimulationActions = {}

  logoUrl?: string
  leftPanels: AxPanel[] = []
  rightPanels: AxPanel[] = []

  constructor() {
    // Prop-derived fields are reference-observable (they hold arrays of React nodes / Mendix value
    // objects we reassign wholesale). autoBind so methods can be passed straight as handlers.
    makeAutoObservable<AxSimulationStore, 'actions'>(
      this,
      {
        style: observable.ref,
        labels: observable.ref,
        actions: observable.ref,
        leftPanels: observable.ref,
        rightPanels: observable.ref,
      },
      { autoBind: true },
    )
  }

  // Rail groups (by panel-no, ordered ascending) — the rails render these with a divider between
  // groups. Derived from the flat panel arrays, so they recompute whenever the lists are reassigned.
  get leftGroups(): AxPanelGroup[] {
    return groupPanels(this.leftPanels)
  }

  get rightGroups(): AxPanelGroup[] {
    return groupPanels(this.rightPanels)
  }

  // Broadcast a per-instance notification on the global bus (for child widgets to react).
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

  setTopBarLabels(labels: AxSimulationTopBarLabels): void {
    this.labels = labels
  }

  setLogo(logoUrl: string | undefined): void {
    this.logoUrl = logoUrl
  }

  setLeftPanels(panels: AxPanel[]): void {
    this.leftPanels = panels
    // Keep the active index in range as the list grows/shrinks (drop zones resolve after mount).
    if (this.activeLeft >= panels.length) this.activeLeft = 0
  }

  setRightPanels(panels: AxPanel[]): void {
    this.rightPanels = panels
    if (this.activeRight >= panels.length) this.activeRight = 0
    if (this.lastRight >= panels.length) this.lastRight = 0
  }

  // --- Left rail ----------------------------------------------------------------------------------
  // The left rail only selects a view (no open/close), so this is a plain switch — unlike toggleRight.
  selectLeft(index: number): void {
    if (index < 0 || index >= this.leftPanels.length) return
    this.activeLeft = index
    this.broadcast('AX_LAYOUT_LEFT_CHANGED', { index })
  }

  // --- Right rail ---------------------------------------------------------------------------------
  // Clicking the active+open right item closes the region; clicking any other opens it on that view.
  // Opening/closing broadcasts AX_LAYOUT_RIGHT_CHANGED so an ax-panel can mirror it (right hidden →
  // maximize). `notify` is false when we're reacting to the panel's own broadcast, so we don't echo
  // back and bounce forever. The no-op guards also stop a redundant broadcast from re-triggering.
  toggleRight(index: number): void {
    if (this.rightOpen && this.activeRight === index) {
      this.closeRight()
    } else {
      this.openRight(index)
    }
  }

  openRight(index: number, notify = true): void {
    if (index < 0 || index >= this.rightPanels.length) return
    if (this.rightOpen && this.activeRight === index) return
    this.activeRight = index
    this.rightOpen = true
    if (notify) this.broadcast('AX_LAYOUT_RIGHT_CHANGED', { index, open: true })
  }

  closeRight(notify = true): void {
    if (!this.rightOpen) return
    this.lastRight = this.activeRight
    this.rightOpen = false
    if (notify) this.broadcast('AX_LAYOUT_RIGHT_CHANGED', { index: this.activeRight, open: false })
  }

  // --- Top bar ------------------------------------------------------------------------------------
  // Top-bar button handlers — pure passthroughs to the callbacks built in AxSimulationSync. These
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
  // Dispatch a global-bus command to drive the layout from nanoflows / other widgets. The payload is a
  // panel index (number) into the matching rail. Command names are distinct from the `*-changed`
  // notifications emitted above, so a broadcast command never loops back into itself. Out-of-range
  // indices are ignored by the select/open guards.
  handleCommand(action: string, payload: unknown): void {
    switch (action) {
      case 'CMD_SET_LEFT':
        if (typeof payload === 'number') this.selectLeft(payload)
        break
      case 'CMD_OPEN_RIGHT':
        if (typeof payload === 'number') this.openRight(payload)
        break
      case 'CMD_TOGGLE_RIGHT':
        if (typeof payload === 'number') this.toggleRight(payload)
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
