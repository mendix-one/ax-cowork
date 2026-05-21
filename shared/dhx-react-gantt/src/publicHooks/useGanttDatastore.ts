import { useMemo } from 'react'
import { ReactGanttRef } from '../types/types'

export function useGanttDatastore<T>(ganttRef: React.RefObject<ReactGanttRef>, storeName: string) {
  return useMemo(() => {
    return {
      getItem: (id: string | number): T => {
        const gantt = ganttRef.current?.instance
        const store = gantt ? gantt.getDatastore(storeName) : null
        return store?.getItem(id) as T
      },
      getItems: (): T[] => {
        const gantt = ganttRef.current?.instance
        const store = gantt ? gantt.getDatastore(storeName) : null
        return (store?.getItems() || []) as T[]
      },
      hasChild: (id: string | number): boolean => {
        const gantt = ganttRef.current?.instance
        const store = gantt ? gantt.getDatastore(storeName) : null
        return !!store?.hasChild(id)
      },
      getChildren: (id: string | number): (string | number)[] => {
        const gantt = ganttRef.current?.instance
        const store = gantt ? gantt.getDatastore(storeName) : null
        return (store?.getChildren(id) || []) as (string | number)[]
      },
    }
  }, [ganttRef, storeName])
}
