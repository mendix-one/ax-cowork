/**
 * Public API surface for the React (and other) wrappers.
 *
 * The gantt runtime is plain JavaScript and is exposed to consumers as `any`
 * (see `gantt` in the entry files). These named types give the wrappers stable
 * import targets without pretending to fully describe the untyped runtime, so
 * every shape keeps a permissive index signature to mirror the loose `any`
 * runtime while still allowing the known fields to be referenced by name.
 */

export interface GanttStatic {
  [key: string]: any
}

export interface Task {
  [key: string]: any
  id: TaskID
  text?: string
  start_date?: Date
  end_date?: Date
  duration?: number
  parent?: TaskID
  progress?: number
  type?: TaskType
  open?: boolean
}

export interface Link {
  [key: string]: any
  id: LinkID
  source?: TaskID
  target?: TaskID
  type?: string
}

export interface Baseline {
  [key: string]: any
  id?: TaskID
  start_date?: Date
  end_date?: Date
}

export interface Scale {
  [key: string]: any
  unit?: string
  step?: number
  format?: any
}

export interface GroupConfig {
  [key: string]: any
}

export interface GanttConfigOptions {
  [key: string]: any
}

export interface GanttTemplates {
  [key: string]: any
}

export type GanttPlugins = {
  [key: string]: any
}

export type RouterFunction = (...args: any[]) => any

export type GanttEventCallback = (...args: any[]) => any
