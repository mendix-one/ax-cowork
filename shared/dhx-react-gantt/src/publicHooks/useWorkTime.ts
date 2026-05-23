import { useMemo } from 'react'
import { Task } from '@dhx/gantt'
import { ReactGanttRef } from '../types/types'

export function useWorkTime(ganttRef: React.RefObject<ReactGanttRef>) {
  return useMemo(
    () => ({
      isWorkTime: ({ date, task, unit }: { date: Date; task?: Task | null; unit?: string }) => {
        const gantt = ganttRef.current?.instance
        if (!gantt) return false
        return gantt.isWorkTime({ date, task, unit })
      },
      calculateEndDate: ({ start, duration, unit, task }: { start: Date; duration: number; unit?: string; task?: Task }) => {
        const gantt = ganttRef.current?.instance
        if (!gantt) return start
        return gantt.calculateEndDate({ start_date: start, unit, duration, task })
      },
      calculateDuration: ({ start, end, task }: { start: Date; end: Date; task?: Task }) => {
        const gantt = ganttRef.current?.instance
        if (!gantt) return 0
        return gantt.calculateDuration({ start_date: start, end_date: end, task })
      },
      getClosestWorkTime: ({ date, task, unit, dir }: { date: Date; task?: Task | null; unit: string; dir?: string }) => {
        const gantt = ganttRef.current?.instance
        if (!gantt) return date
        return gantt.getClosestWorkTime({ date, task, dir, unit })
      },
    }),
    [ganttRef],
  )
}
