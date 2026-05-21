import { useEffect } from 'react'

export type ResourceFilter = (resource: any) => boolean

export function useResourceFilters(ganttRef: any | null, prevResourceFilterRef: any, filter: ResourceFilter | null, debounceRender: () => void) {
  useEffect(() => {
    const gantt = ganttRef.current

    if (!gantt) return

    const store = gantt.getDatastore(gantt.config.resource_store)
    if (!store) return

    if (!(store as any)._resourceFilterAttached) {
      ;(store as any)._resourceFilterAttached = true
      store.attachEvent('onFilterItem', function (_id: string | number, item: any) {
        if (prevResourceFilterRef.current) {
          return prevResourceFilterRef.current(item)
        }
        return true
      })
    }

    const oldFilter = prevResourceFilterRef.current
    let renderNeeded = false
    if (oldFilter !== filter) {
      renderNeeded = true
    }

    prevResourceFilterRef.current = filter

    if (renderNeeded) {
      //store.refresh();
      debounceRender()
    }
  }, [ganttRef, filter])
}
