import type { AxEvent, AxEventHandler } from './types'

const GLOBAL_KEY = '__AX_EVENT_BUS__'

/**
 * Minimal topic-based emitter. Kept dependency-free (no nanobus) so this tsc-built library
 * adds no runtime dependency for consuming widgets to bundle. The API surface
 * (`emit` / `on` / `removeListener`) matches what `useWidgetEvents` expects.
 */
export interface AxEventBus {
  emit(topic: string, event: AxEvent): void
  on(topic: string, handler: AxEventHandler): void
  removeListener(topic: string, handler: AxEventHandler): void
}

function createBus(): AxEventBus {
  const topics = new Map<string, Set<AxEventHandler>>()
  return {
    emit(topic, event) {
      topics.get(topic)?.forEach((handler) => handler(event))
    },
    on(topic, handler) {
      let handlers = topics.get(topic)
      if (!handlers) {
        handlers = new Set()
        topics.set(topic, handlers)
      }
      handlers.add(handler)
    },
    removeListener(topic, handler) {
      topics.get(topic)?.delete(handler)
    },
  }
}

function globalScope(): Record<string, unknown> | undefined {
  return typeof window !== 'undefined' ? (window as unknown as Record<string, unknown>) : undefined
}

/**
 * Initialize the global event bus. Called by layout/host widgets. Idempotent: if a bus already
 * exists on `window` it is returned as-is, so multiple widgets calling this all share one bus.
 */
export function initEventBus(): AxEventBus | undefined {
  const scope = globalScope()
  if (!scope) {
    return undefined
  }
  if (!scope[GLOBAL_KEY]) {
    scope[GLOBAL_KEY] = createBus()
  }
  return scope[GLOBAL_KEY] as AxEventBus
}

/** Get the global event bus, or undefined if no widget has initialized it yet. */
export function getEventBus(): AxEventBus | undefined {
  return globalScope()?.[GLOBAL_KEY] as AxEventBus | undefined
}

/**
 * Emit an event to a topic on the global bus. Safe to call from widget code, Mendix nanoflows,
 * or the browser console:
 *
 * ```js
 * window.__AX_EVENT_BUS__.emit('ax:broadcast', { action: 'theme-changed', payload: { mode: 'dark' } })
 * window.__AX_EVENT_BUS__.emit('ax:AxLogin1', { action: 'reset' })
 * ```
 */
export function emitEvent(topic: string, event: AxEvent): void {
  getEventBus()?.emit(topic, event)
}
