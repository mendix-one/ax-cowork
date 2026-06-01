import { createContext, type ReactNode, useContext, useMemo } from 'react'

/**
 * Creates a typed React context + Provider + useStore hook for a per-widget store
 * (typically a MobX store, but the helper is store-agnostic).
 *
 * Usage:
 * ```ts
 * class MyWidgetStore { ... }
 * const { Provider, useStore } = createWidgetContext<MyWidgetStore>('MyWidget')
 * ```
 *
 * The Provider builds the store exactly once (per mount) via `createStore`, so the same
 * instance is shared by the whole subtree and survives re-renders.
 */
export function createWidgetContext<T>(displayName?: string) {
  const Context = createContext<T | null>(null)
  if (displayName) {
    Context.displayName = displayName
  }

  function Provider({ createStore, children }: { createStore: () => T; children: ReactNode }) {
    const store = useMemo(createStore, [])
    return <Context.Provider value={store}>{children}</Context.Provider>
  }

  function useStore(): T {
    const store = useContext(Context)
    if (!store) {
      throw new Error(`useStore must be used within <${displayName ?? 'Widget'}Provider>`)
    }
    return store
  }

  return { Provider, useStore } as const
}
