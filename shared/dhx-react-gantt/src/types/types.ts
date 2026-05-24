import { GanttStatic, Task, Link, Baseline } from '../GanttCore'
import { ReactElement } from 'react'

export interface ReactGanttRef {
  instance: GanttStatic | null
}

export interface DataCallbackChange {
  entity: string
  action: string
  data: any
  id: number | string
}

export interface BatchChanges {
  tasks?: DataCallbackChange[]
  links?: DataCallbackChange[]
  resources?: DataCallbackChange[]
  resourceAssignments?: DataCallbackChange[]
}

export interface OnBeforeTaskDeleteConfirmArgs {
  task: Task
  callback: () => void
  message: string
  title: string
  ganttInstance: GanttStatic
}
export interface OnBeforeLinkDeleteConfirmArgs {
  link: Link
  callback: () => void
  message: string
  title: string
  ganttInstance: GanttStatic
}

export type OnBeforeTaskDeleteConfirm = (args: OnBeforeTaskDeleteConfirmArgs) => void
export type OnBeforeLinkDeleteConfirm = (args: OnBeforeLinkDeleteConfirmArgs) => void

export interface GanttModals {
  onBeforeTaskDelete?: OnBeforeTaskDeleteConfirm
  onBeforeLinkDelete?: OnBeforeLinkDeleteConfirm
}

export interface Marker {
  /**
   * the marker id
   */
  id?: string | number
  /**
   * a Date object that sets the marker's start date
   */
  start_date: Date
  /**
   * a Date object that sets the marker's end date
   */
  end_date?: Date

  /**
   * a CSS class applied to the marker
   */
  css?: string
  /**
   * the marker title
   */
  text?: ReactElement | (() => ReactElement) | string | number
  /**
   * the marker's tooltip
   */
  title?: string | number
}

export interface SerializedTask {
  /**
   * The task id, auto-generated if not set
   */
  id: string | number

  /**
   * The date when a task is scheduled to begin. If not specified, Gantt will calculate it based on the end_date and duration properties.The property becomes optional when setting unscheduled: true.
   */
  start_date?: Date | string

  /**
   * The date when a task is scheduled to be completed. If not specified, Gantt will calculate it based on the start_date and duration properties.The property becomes optional when setting unscheduled: true.
   */
  end_date?: Date | string

  /**
   * The task duration. If not specified, Gantt will calculate it based on the start_date and end_date properties.
   */
  duration?: number

  /**
   * Defines whether gantt should do auto-scheduling of the task (true or not specified) or not (false)
   */
  auto_scheduling?: boolean

  /**
   * Sets the height of the DOM element of the task in the timeline area
   */
  bar_height?: number

  /**
   * An array with the baselines
   */
  baselines?: Baseline[]

  /**
   * Sets the id of the custom calendar to be assigned to the task. The name of the property depends on the value of the calendar_property option
   */
  calendar_id?: number | string

  /**
   * Sets the color of the task in the timeline area (i.e. sets background-color for the gantt_task_line element of the task)
   */
  color?: string

  /**
   * The date of the task constraint. It is added to the task object when auto-scheduling with time constraints is enabled. The property isn't used if auto_scheduling_compatibility is enabled.
   */
  constraint_date?: Date

  /**
   * The type of the task constraint ("asap", "alap", "snet", "snlt", "fnet", "fnlt", "mso", "mfo"). It is added to the task object when auto-scheduling with time constraints is enabled. The property isn't used if auto_scheduling_compatibility is enabled.
   */
  constraint_type?: string

  /**
   * Specifies the deadline date for the task. A [visual indicator](desktop/inbuilt_baselines.md#deadlinesandconstraints) is displayed in the timeline when this property is set.
   */
  deadline?: Date

  /**
   * Defines whether the task can be editable in the read-only Gantt chart. The name of the property depends on the value of the editable_property option
   */
  editable?: boolean

  /**
   * The group's id. It is added to the tasks grouped by some criterion if the property used for grouping tasks (relation_property in the groupBy() method) is specified as an object.
   */
  group_id?: string | number

  /**
   * Defines whether a task (type:"task") or milestone (type:"milestone") should be hidden in the timeline area
   */
  hide_bar?: boolean

  /**
   * The key of the group. It is added to the tasks grouped by some criterion if the property used for grouping tasks (relation_property in the groupBy() method) is specified as an array.It is also added to the tasks with the name of the group (for example, to the "High", "Normal", "Low" tasks if you've grouped tasks by priority. Check the example).
   */
  key?: string | number

  /**
   * The label of the group. It is added to the tasks with the name of the group (for example, if you've grouped tasks by priority, the property will be added to the tasks with "High", "Normal", "Low" names. Check the example).
   */
  label?: string

  /**
   * Specifies whether the task branch will be opened initially (to show child tasks). To close/open the branch after Gantt initialization, use the related methods: close() and open()
   */
  open?: boolean

  /**
   * The id of the parent task. If the specified parent doesn't exist, the task won't be rendered in the Gantt. The id of the root task is specified by the axios/gantt_root_id_config.md config.
   */
  parent?: number | string

  /**
   * The task's progress (from 0 to 1)
   */
  progress?: number

  /**
   * The color of the task progress in the timeline area (i.e. sets background-color for the gantt_task_progress element of the task progress)
   */
  progressColor?: string

  /**
   * Defines whether the task must be readonly. The name of the property depends on the value of the readonly_property option
   */
  readonly?: boolean

  /**
   * Defines how subtasks of the task must be displayed. Values: "split" | "". If set to "split", the subtasks will be displayed in one row. In addition, if you enable the open_split_tasks property, the subtasks will be rendered in one row only if the task is collapsed.
   */
  render?: string

  /**
   * An array with resources assigned to the task. It is added to the task object when importing data from MS Project/Primavera
   */
  resource?: Array<string>

  /**
   * Specifies whether a task (type:"task") or milestone (type:"milestone") should appear on the parent projects.
   */
  rollup?: boolean

  /**
   * Sets the height for the task's row
   */
  row_height?: number

  /**
   * The id of the target task. The property displays the same value as the $drop_target property. The property is added to the task object only if Data Processor is enabled, after the task is updated and data is sent to the server.
   */
  target?: string

  /**
   * The name of the task. If necessary you may use any other name for this property.The property is used in default configurations of different parts of Gantt.
   */
  text?: any

  /**
   * The color of the task's text in the timeline area (i.e. sets color for the gantt_task_line element of the task)
   */
  textColor?: string

  /**
	 * the task type. The available values are stored in the axios/gantt_types_config.md object:
				"task" -  a regular task (default value).
				"project" -  a task that starts, when its earliest child task starts, and ends, when its latest child ends.
				The start_date, end_date, duration properties are ignored for such tasks.
				"milestone" -  a zero-duration task that is used to mark out important dates of the project.
				The duration, progress, end_date properties are ignored for such tasks.
	*/
  type?: string

  /**
   * Defines whether the task must be unscheduled. By default, the unscheduled task isn't displayed in the timeline area, empty values are displayed in the grid instead of the start and end dates.
   */
  unscheduled?: boolean

  [customProperty: string]: any
}
