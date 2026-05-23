import { useEffect } from 'react'
import { GanttStatic } from '@dhx/gantt'
import { isEqual } from 'lodash-es'

export interface Calendar {
  id: string
  hours?: string[]
  days?: CalendarDays
  customWeeks?: Record<string, CustomWeek>
}

interface CalendarDays {
  weekdays?: Partial<Record<WeekDay, string[] | boolean>>
  dates?: Record<string, string[] | boolean>
}

interface CustomWeek {
  from: Date
  to: Date
  hours?: string[]
  days?: CalendarDays
}

type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6

function transformToGanttConfig(calendar: Calendar) {
  const defaultHours = calendar.hours || ['00:00-24:00']

  const config: any = {
    id: calendar.id,
    worktime: {
      hours: defaultHours,
      dates: buildDaysConfig(calendar.days),
    },
  }

  const customWeeks = buildCustomWeeksConfig(calendar.customWeeks, defaultHours)
  if (customWeeks) {
    config.worktime.customWeeks = customWeeks
  }
  return config
}

function buildDaysConfig(days: CalendarDays | undefined) {
  const weekConfig: Record<string | number, string[] | number | boolean> = {}

  for (let i = 0; i < 7; i++) {
    weekConfig[i] = days.weekdays[i]
  }

  if (days?.dates) {
    Object.entries(days.dates).forEach(([date, setting]) => {
      weekConfig[new Date(date).valueOf()] = setting
    })
  }

  return weekConfig
}

function buildCustomWeeksConfig(customWeeks: Record<string, CustomWeek> | undefined, globalHours: string[]) {
  const customWeeksConfig: Record<string, any> = {}
  if (!customWeeks) return undefined

  Object.entries(customWeeks).forEach(([name, week]) => {
    const weekHours = week.hours || globalHours
    customWeeksConfig[name] = {
      from: week.from,
      to: week.to,
      hours: weekHours,
      dates: buildDaysConfig(week.days),
    }
  })

  return customWeeksConfig
}

export function applyCalendars(gantt: GanttStatic, calendars: Calendar[] | null) {
  if (!gantt || !calendars) return

  const existingCalendarIds = new Set(gantt.getCalendars().map((c) => c.id))
  const newCalendarIds = new Set(calendars.map((c) => c.id))

  calendars.forEach((calendar) => {
    const existingCalendar = gantt.getCalendar(calendar.id)
    const newConfig = transformToGanttConfig(calendar)
    const newCalendar = gantt.createCalendar(newConfig as any)

    if (!existingCalendar || !isEqual(existingCalendar._worktime, newCalendar._worktime)) {
      if (existingCalendar) gantt.deleteCalendar(calendar.id)
      newCalendar.id = calendar.id
      gantt.addCalendar(newCalendar)
    }
  })

  existingCalendarIds.forEach((id) => {
    if (!newCalendarIds.has(id)) gantt.deleteCalendar(id)
  })
}

export function useCalendars(ganttRef: React.MutableRefObject<GanttStatic | null>, calendars: Calendar[] | null) {
  useEffect(() => {
    const gantt = ganttRef.current
    applyCalendars(gantt, calendars)
  }, [calendars, ganttRef])
}
