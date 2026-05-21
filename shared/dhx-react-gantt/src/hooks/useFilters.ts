import { useEffect } from 'react'
import { Task } from '@dhx/gantt'

export type TaskFilter = ((Task) => boolean) | null
export function useFilters(ganttRef: any | null, prevFilterRef: any, filter: TaskFilter, debounceRender: () => void) {
  useEffect(() => {
    if (!ganttRef.current) return
    const gantt = ganttRef.current

    if (!gantt.$_filterAttached) {
      gantt.$_filterAttached = true
      gantt.attachEvent('onBeforeTaskDisplay', function (id: string, task: Task) {
        if (prevFilterRef.current) {
          return prevFilterRef.current(task)
        }
        return true
      })
    }

    const oldFilter = prevFilterRef.current
    let renderNeeded = false
    if (oldFilter !== filter) {
      renderNeeded = true
    }
    prevFilterRef.current = filter

    if (renderNeeded) {
      debounceRender()
    }
  }, [filter])
}
