import { makeAutoObservable } from 'mobx'
import { AX_BROADCAST, emitEvent, executeAction } from '@ax/common'
import type { AxDisplayPanelContainerProps } from '../../typings/AxDisplayPanelProps'

// Thin, non-observable bridge to the latest Mendix-bound values/actions the store reads at action
// time. Rebuilt by the container on every render (the EditableValue/ActionValue instances are new
// each render) and pushed in via `syncBridge`. The store's own observable state (the local maximize
// fallback) drives re-renders when no attribute is bound; when an attribute IS bound it is the source
// of truth and the container re-renders from props.
export interface AxDisplayPanelBridge {
  type: 'main' | 'sub'
  /** Current maximized value from the bound attribute (false when unbound). */
  maximized: boolean
  /** Whether a `maximized` attribute is actually bound. */
  hasMaxAttr: boolean
  setMaximized(value: boolean): void
  onMaximize(): void
  onRestore(): void
  onClose(): void
  /** Broadcast a state-change notification on the global bus (for the host layout to react). */
  notify(action: string): void
}

// Glue between Mendix container props and the store. Wires the optional attribute + actions, and the
// global-bus notification, behind the bridge so the store itself stays platform-agnostic.
export function buildBridge(props: AxDisplayPanelContainerProps): AxDisplayPanelBridge {
  return {
    type: props.type,
    maximized: props.maximized?.value === true,
    hasMaxAttr: props.maximized !== undefined,
    setMaximized: (value) => props.maximized?.setValue(value),
    onMaximize: () => executeAction(props.onMaximize),
    onRestore: () => executeAction(props.onRestore),
    onClose: () => executeAction(props.onClose),
    notify: (action) => emitEvent(AX_BROADCAST, { action, payload: { name: props.name } }),
  }
}

// MobX store owning the panel's interaction state + the action vocabulary (maximize / restore /
// toggle / close) shared by the header control button and the global event bus. Maximize state lives
// in the bound Mendix attribute when present; otherwise it falls back to `localMaximized` here so the
// panel still works standalone.
export class AxDisplayPanelStore {
  localMaximized = false

  private bridge: AxDisplayPanelBridge

  constructor(bridge: AxDisplayPanelBridge) {
    this.bridge = bridge
    // `bridge` excluded from observability (it's reassigned every render with fresh Mendix values);
    // autoBind so actions can be passed straight as handlers (onClick={store.activate}).
    makeAutoObservable<AxDisplayPanelStore, 'bridge'>(this, { bridge: false }, { autoBind: true })
  }

  syncBridge(bridge: AxDisplayPanelBridge): void {
    this.bridge = bridge
  }

  // Read/write the effective maximize state (attribute when bound, local fallback otherwise).
  private current(): boolean {
    return this.bridge.hasMaxAttr ? this.bridge.maximized : this.localMaximized
  }

  private apply(value: boolean): void {
    if (this.bridge.hasMaxAttr) {
      this.bridge.setMaximized(value)
    } else {
      this.localMaximized = value
    }
  }

  maximize(): void {
    if (this.bridge.type !== 'main') return
    this.apply(true)
    this.bridge.onMaximize()
    this.bridge.notify('panel-maximized')
  }

  restore(): void {
    if (this.bridge.type !== 'main') return
    this.apply(false)
    this.bridge.onRestore()
    this.bridge.notify('panel-restored')
  }

  toggleMaximize(): void {
    if (this.current()) {
      this.restore()
    } else {
      this.maximize()
    }
  }

  close(): void {
    this.bridge.onClose()
    this.bridge.notify('panel-closed')
  }

  // Header control button: main panels toggle maximize/restore, sub panels close.
  activate(): void {
    if (this.bridge.type === 'main') {
      this.toggleMaximize()
    } else {
      this.close()
    }
  }

  // Dispatch a global-bus action to this panel. Commands are distinct from the `panel-*`
  // notifications emitted above, so a broadcast command never loops back into itself.
  handleEvent(action: string): void {
    switch (action) {
      case 'maximize':
        this.maximize()
        break
      case 'minimize':
      case 'restore':
        this.restore()
        break
      case 'toggle':
      case 'toggle-maximize':
        this.toggleMaximize()
        break
      case 'close':
        this.close()
        break
      default:
        break
    }
  }
}
