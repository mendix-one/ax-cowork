import type { CSSProperties, ReactNode } from 'react'
import type { WebIcon } from 'mendix'
import { makeAutoObservable, observable } from 'mobx'
import { AX_BROADCAST, emitEvent } from '@ax/common'

// Layout display mode (mirrors the prpEnmMode enumeration). Drives which regions render and whether the
// main area is a single page-content view or a resizable split:
//  - FILL_CONTENT_PAGE  — page content fills the whole shell; the top bar floats over it (no rails).
//  - ONE_PANEL_PAGE     — page content, no split; left/right rails show action menus (or a thin gutter).
//  - SPLIT_VIEW_SINGLE  — split view; left is the (uncached) page content with action menus, right is the
//                         cached right-panel stack.
//  - SPLIT_VIEW_MULTIPLE— the full version: both sides are cached panel stacks driven by their rails.
export type AxLayoutMode = 'FILL_CONTENT_PAGE' | 'ONE_PANEL_PAGE' | 'SPLIT_VIEW_SINGLE' | 'SPLIT_VIEW_MULTIPLE'

// One rail panel: a rail button (icon + caption tooltip) bound to a content view. AxAppSync builds one
// per item of the prpDsLeftPanels / prpDsRightPanels object lists; the rails and content stacks read
// them by array index, which is the source of truth for "which view is active". `no` is the panel-no
// used to group rail buttons (see AxGroup).
export interface AxPanel {
  no: number
  icon?: WebIcon
  caption: string
  content: ReactNode
}

// One rail menu: a rail button (icon + caption tooltip) that fires a Mendix action instead of switching a
// view. Built from prpDsLeftMenus / prpDsRightMenus. `onClick` is a plain callback (the ActionValue and its
// guards stay in AxAppSync), so the store still never touches a widget value.
export interface AxMenu {
  no: number
  icon?: WebIcon
  caption: string
  onClick: () => void
}

// Items sharing the same `no` render as one rail group; groups are ordered by `no` ascending and separated
// by a divider. Each item keeps its original index into the source list so the rail button still maps to
// the right content view / menu (which stays in flat prop order).
export interface AxGroup<T> {
  no: number
  items: { item: T; index: number }[]
}

function groupByNo<T extends { no: number }>(list: T[]): AxGroup<T>[] {
  const groups = new Map<number, { item: T; index: number }[]>()
  list.forEach((item, index) => {
    const items = groups.get(item.no) ?? []
    items.push({ item, index })
    groups.set(item.no, items)
  })
  return [...groups.keys()].sort((a, b) => a - b).map((no) => ({ no, items: groups.get(no)! }))
}

// One normalized rail button — what the rail views actually render, regardless of whether the source was a
// view-switching panel or an action menu. `active` highlights the button; `onClick` selects/toggles a view
// or fires a menu action. Built per mode by the leftRail / rightRail getters.
export interface AxRailButton {
  key: string
  icon?: WebIcon
  caption: string
  active: boolean
  onClick: () => void
}

export interface AxRailGroup {
  no: number
  buttons: AxRailButton[]
}

// Header top-bar menu visibility (apps, world map, notify, account, settings). Each button is shown unless
// its flag is explicitly false — the props are optional booleans defaulting to "on".
export interface AxHeaderMenus {
  apps: boolean
  worldMap: boolean
  notify: boolean
  account: boolean
  settings: boolean
}

const ALL_HEADER_MENUS: AxHeaderMenus = {
  apps: true,
  worldMap: true,
  notify: true,
  account: true,
  settings: true,
}

// Tooltip labels for the fixed top-bar buttons. The rails are data-driven now, so their labels live on
// each panel (AxPanel.caption) — only the top bar still has a fixed set of labels sourced from props.
export interface AxTopBarLabels {
  apps: string
  worldMap: string
  notify: string
  account: string
  settings: string
}

// Top-bar click handlers. Only plain callbacks cross into the store — the Mendix `ActionValue`s (and
// their canExecute/isExecuting guards) stay at the top level in AxAppSync, so the store and the layout
// never touch a widget value.
export interface AxAppActions {
  onClickLogo?: () => void
  onClickApps?: () => void
  onClickWorldMap?: () => void
  onClickNotify?: () => void
  onClickAccount?: () => void
  onClickSettings?: () => void
}

const EMPTY_TOPBAR_LABELS: AxTopBarLabels = {
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
//     layout attributes, and top-bar actions. AxAppSync pushes these in group-by-group via useEffect as
//     the Mendix props resolve, so late-arriving values are picked up after mount rather than once.
//
// All prop-derived fields are `observable.ref`: they're arrays / React nodes / Mendix value objects that
// should be tracked by reference (reassignment re-renders observers) without MobX deep-observing their
// guts. AxAppMain and the rail children read everything from this store — never the widget props.
export class AxAppStore {
  // Active view = index into the panel arrays (0 when a side has at least one panel).
  activeLeft = 0
  activeRight = 0
  rightOpen = false
  // The right view index that was showing when the region was last closed. Saved on close so restoring
  // the main panel (or reopening) can bring back exactly that view rather than a default.
  lastRight = 0

  // --- Prop-derived view data (set by AxAppSync) -------------------------------------------------
  name: string = 'axApp1'
  tabIndex?: number
  className: string = ''
  style?: CSSProperties
  labels: AxTopBarLabels = EMPTY_TOPBAR_LABELS
  actions: AxAppActions = {}

  mode: AxLayoutMode = 'SPLIT_VIEW_MULTIPLE'
  headerMenus: AxHeaderMenus = ALL_HEADER_MENUS
  logoUrl?: string
  pageContent?: ReactNode
  leftMenus: AxMenu[] = []
  rightMenus: AxMenu[] = []
  leftPanels: AxPanel[] = []
  rightPanels: AxPanel[] = []

  constructor() {
    // Prop-derived fields are reference-observable (they hold arrays of React nodes / Mendix value
    // objects we reassign wholesale). autoBind so methods can be passed straight as handlers.
    makeAutoObservable<AxAppStore, 'actions'>(
      this,
      {
        style: observable.ref,
        labels: observable.ref,
        actions: observable.ref,
        headerMenus: observable.ref,
        pageContent: observable.ref,
        leftMenus: observable.ref,
        rightMenus: observable.ref,
        leftPanels: observable.ref,
        rightPanels: observable.ref,
      },
      { autoBind: true },
    )
  }

  // --- Mode helpers -------------------------------------------------------------------------------
  // The shell renders the top bar and (for non-fill modes) the rails + bottom bar; these getters keep
  // the mode branching readable in the views.
  get isFill(): boolean {
    return this.mode === 'FILL_CONTENT_PAGE'
  }

  get showSplit(): boolean {
    return this.mode === 'SPLIT_VIEW_SINGLE' || this.mode === 'SPLIT_VIEW_MULTIPLE'
  }

  // --- Rail groups --------------------------------------------------------------------------------
  // Grouped by `no` (ascending) — the rails render these with a divider between groups. Derived from the
  // flat source arrays, so they recompute whenever the lists are reassigned.
  get leftGroups(): AxGroup<AxPanel>[] {
    return groupByNo(this.leftPanels)
  }

  get rightGroups(): AxGroup<AxPanel>[] {
    return groupByNo(this.rightPanels)
  }

  get leftMenuGroups(): AxGroup<AxMenu>[] {
    return groupByNo(this.leftMenus)
  }

  get rightMenuGroups(): AxGroup<AxMenu>[] {
    return groupByNo(this.rightMenus)
  }

  // Normalized left rail buttons for the active mode: view-switching panels in SPLIT_VIEW_MULTIPLE,
  // action menus otherwise (ONE_PANEL_PAGE / SPLIT_VIEW_SINGLE). FILL mode renders no left rail.
  get leftRail(): AxRailGroup[] {
    if (this.mode === 'SPLIT_VIEW_MULTIPLE') {
      return this.leftGroups.map((group) => ({
        no: group.no,
        buttons: group.items.map(({ item, index }) => ({
          key: `panel-${index}`,
          icon: item.icon,
          caption: item.caption,
          active: this.activeLeft === index,
          onClick: () => this.selectLeft(index),
        })),
      }))
    }
    return this.leftMenuGroups.map((group) => ({
      no: group.no,
      buttons: group.items.map(({ item, index }) => ({
        key: `menu-${index}`,
        icon: item.icon,
        caption: item.caption,
        active: false,
        onClick: item.onClick,
      })),
    }))
  }

  // Normalized right rail buttons: view-toggling panels in the split modes (SPLIT_VIEW_SINGLE /
  // SPLIT_VIEW_MULTIPLE), action menus in ONE_PANEL_PAGE. FILL mode renders no right rail.
  get rightRail(): AxRailGroup[] {
    if (this.showSplit) {
      return this.rightGroups.map((group) => ({
        no: group.no,
        buttons: group.items.map(({ item, index }) => ({
          key: `panel-${index}`,
          icon: item.icon,
          caption: item.caption,
          active: this.rightOpen && this.activeRight === index,
          onClick: () => this.toggleRight(index),
        })),
      }))
    }
    return this.rightMenuGroups.map((group) => ({
      no: group.no,
      buttons: group.items.map(({ item, index }) => ({
        key: `menu-${index}`,
        icon: item.icon,
        caption: item.caption,
        active: false,
        onClick: item.onClick,
      })),
    }))
  }

  // Broadcast a per-instance notification on the global bus (for child widgets to react).
  private emit(action: string, payload?: unknown): void {
    emitEvent(`ax:${this.name}`, { action, payload })
  }

  // Broadcast a layout state-change notification on the global bus (for child widgets to react).
  private broadcast(action: string, payload?: unknown): void {
    emitEvent(AX_BROADCAST, { action, payload })
  }

  // --- Setters used by AxAppSync's effects --------------------------------------------------------
  setWidget(name: string, className: string, style: CSSProperties | undefined, tabIndex: number | undefined): void {
    this.name = name
    this.className = className
    this.style = style
    this.tabIndex = tabIndex
  }

  setMode(mode: AxLayoutMode): void {
    this.mode = mode
  }

  setHeaderMenus(headerMenus: AxHeaderMenus): void {
    this.headerMenus = headerMenus
  }

  setTopBarLabels(labels: AxTopBarLabels): void {
    this.labels = labels
  }

  setLogo(logoUrl: string | undefined): void {
    this.logoUrl = logoUrl
  }

  setPageContent(pageContent: ReactNode): void {
    this.pageContent = pageContent
  }

  setLeftMenus(menus: AxMenu[]): void {
    this.leftMenus = menus
  }

  setRightMenus(menus: AxMenu[]): void {
    this.rightMenus = menus
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
  // Top-bar button handlers — pure passthroughs to the callbacks built in AxAppSync. These buttons just
  // fire their action; they carry no active/popover state.
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
