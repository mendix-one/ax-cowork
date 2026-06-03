import type { CSSProperties, ReactNode } from 'react'
import { makeAutoObservable, observable } from 'mobx'
import { AX_BROADCAST, emitEvent } from '@ax/common'
import type { WebIcon } from 'mendix'

export type PanelType = 'main' | 'sub'

// MobX store for the display panel. It holds prop-derived view data (set by AxDisplayPanelSync via
// effects) and the panel's interaction vocabulary (maximize / restore / close), and it talks to the
// outside world only through the event bus — never through a Mendix value:
//
//  - `emit('ACT_*')` on the widget's private topic asks AxDisplayPanelSync (which holds the Mendix
//    ActionValue + EditableValue) to run the configured action and write the bound attribute.
//  - `broadcast('AX_LAYOUT_*')` tells other widgets (e.g. the ax-simulation host layout) that the panel
//    changed, so they can react.
//
// Maximize state lives in the synchronous `maximized` field so it never lags the Mendix attribute's
// async round-trip; when an attribute is bound (`hasMaxAttr`) the Sync persists it and reconciles its
// value back in. Standalone (no attribute) it just works off the in-memory field.
export class AxDisplayPanelStore {
  // --- Prop-derived view data (set by AxDisplayPanelSync) -----------------------------------------
  name = 'axDisplayPanel1'
  className = ''
  style?: CSSProperties
  tabIndex?: number
  type: PanelType = 'main'
  title = ''
  icon?: WebIcon
  toolbar: ReactNode = null
  content: ReactNode = null

  // Maximize state. `maximized` is the single, synchronous source of truth that drives the UI and the
  // maximize/restore guards — set immediately on every interaction so rapid layout ⇄ panel toggles can
  // never desync on the Mendix attribute's async round-trip. When an attribute is bound it is the
  // persisted value: AxDisplayPanelSync writes it on change and reconciles it back in via setMaximized
  // (which also honours external/attribute-driven changes).
  hasMaxAttr = false
  maximized = false

  constructor() {
    makeAutoObservable(
      this,
      {
        style: observable.ref,
        icon: observable.ref,
        toolbar: observable.ref,
        content: observable.ref,
      },
      { autoBind: true },
    )
  }

  // Emit an action-intent event on this widget's private topic (handled by AxDisplayPanelSync).
  private emit(action: string, payload?: unknown): void {
    emitEvent(`ax:${this.name}`, { action, payload })
  }

  // Broadcast a state-change notification on the global bus (for other widgets to react).
  private broadcast(action: string, payload?: unknown): void {
    emitEvent(AX_BROADCAST, { action, payload })
  }

  // --- Setters used by AxDisplayPanelSync's effects -----------------------------------------------
  setWidget(name: string, className: string, style: CSSProperties | undefined, tabIndex: number | undefined): void {
    this.name = name
    this.className = className
    this.style = style
    this.tabIndex = tabIndex
  }

  setHeader(type: PanelType, title: string, icon: WebIcon | undefined): void {
    this.type = type
    this.title = title
    this.icon = icon
  }

  setToolbar(toolbar: ReactNode): void {
    this.toolbar = toolbar
  }

  setContent(content: ReactNode): void {
    this.content = content
  }

  // Reconcile from the bound attribute: track whether one is bound, and when it is, mirror its value
  // into `maximized` (honours both the round-trip from our own ACT_* writes and external changes).
  setMaximized(hasMaxAttr: boolean, value: boolean): void {
    this.hasMaxAttr = hasMaxAttr
    if (hasMaxAttr) this.maximized = value
  }

  // --- Interaction vocabulary ---------------------------------------------------------------------
  // Only `main` panels maximize/restore. `maximized` flips immediately (synchronous source of truth);
  // the ACT_* intent makes the Sync persist the bound attribute + run the Mendix action. `notify` is
  // false when this change is itself a reaction to the layout's AX_LAYOUT_RIGHT_CHANGED broadcast: we
  // update our state but don't echo AX_LAYOUT_MAXIMIZED back, which would bounce between the panel and
  // the layout forever. The state guards make repeats a no-op so a stray echo can't re-trigger.
  maximize(notify = true): void {
    if (this.type !== 'main' || this.maximized) return
    this.maximized = true
    this.emit('ACT_MAXIMIZE')
    if (notify) this.broadcast('AX_LAYOUT_MAXIMIZED', { name: this.name })
  }

  restore(notify = true): void {
    if (this.type !== 'main' || !this.maximized) return
    this.maximized = false
    this.emit('ACT_RESTORE')
    if (notify) this.broadcast('AX_LAYOUT_RESTORED', { name: this.name })
  }

  toggleMaximize(): void {
    if (this.maximized) {
      this.restore()
    } else {
      this.maximize()
    }
  }

  close(): void {
    this.emit('ACT_CLOSE')
    this.broadcast('AX_LAYOUT_CLOSED', { name: this.name })
  }

  // Header control button: main panels toggle maximize/restore, sub panels close.
  activate(): void {
    if (this.type === 'main') {
      this.toggleMaximize()
    } else {
      this.close()
    }
  }

  // --- Global event bus ---------------------------------------------------------------------------
  // Drive the panel from nanoflows / other widgets. Command names (CMD_*) are distinct from the
  // ACT_* / AX_LAYOUT_* events emitted above, so a command never loops back into itself.
  handleCommand(action: string): void {
    switch (action) {
      case 'CMD_MAXIMIZE':
        this.maximize()
        break
      case 'CMD_MINIMIZE':
      case 'CMD_RESTORE':
        this.restore()
        break
      case 'CMD_TOGGLE':
      case 'CMD_TOGGLE_MAXIMIZE':
        this.toggleMaximize()
        break
      case 'CMD_CLOSE':
        this.close()
        break
      default:
        break
    }
  }

  // React to the host layout's AX_LAYOUT_RIGHT_CHANGED broadcast: when the right region is hidden the
  // main content has more room, so maximize; when it reopens, restore. Reacts silently (notify=false)
  // so it doesn't echo back to the layout. Our own AX_LAYOUT_MAXIMIZED/RESTORED/CLOSED fall through.
  handleLayout(action: string, payload: unknown): void {
    if (action !== 'AX_LAYOUT_RIGHT_CHANGED') return
    const open = (payload as { open?: boolean } | undefined)?.open
    if (open === false) {
      this.maximize(false)
    } else if (open === true) {
      this.restore(false)
    }
  }
}
