import type { ReactElement } from 'react'
import type { GanttTemplates, Task, Link, Baseline, Scale } from '@dhx/gantt'

export interface ReactGanttTemplates extends Partial<
  Omit<
    GanttTemplates,
    | 'baseline_text'
    | 'date_grid'
    | 'drag_link'
    | 'drag_link_class'
    | 'format_date'
    | 'grid_blank'
    | 'grid_date_format'
    | 'grid_file'
    | 'grid_folder'
    | 'grid_header_class'
    | 'grid_indent'
    | 'grid_open'
    | 'grid_row_class'
    | 'histogram_cell_allocated'
    | 'histogram_cell_capacity'
    | 'histogram_cell_class'
    | 'histogram_cell_label'
    | 'link_class'
    | 'link_description'
    | 'parse_date'
    | 'progress_text'
    | 'quick_info_class'
    | 'quick_info_content'
    | 'quick_info_date'
    | 'quick_info_title'
    | 'resource_cell_class'
    | 'resource_cell_value'
    | 'scale_cell_class'
    | 'scale_row_class'
    | 'task_class'
    | 'task_date'
    | 'task_end_date'
    | 'task_row_class'
    | 'task_text'
    | 'task_time'
    | 'task_unscheduled_time'
    | 'time_picker'
    | 'timeline_cell_class'
    | 'timeline_cell_content'
    | 'tooltip_date_format'
    | 'tooltip_text'
    | 'rightside_text'
    | 'leftside_text'
    | 'lightbox_header'
    | 'marker_class'
  >
> {
  /**
  
  	 * specifies the text displayed inside the baseline element
  
  	 * @param task the task object associated with the baseline
  
  	 * @param baseline the baseline object
  
  	 * @param index the index of the baseline in the task's baselines array
  
  	*/
  baseline_text?(task: Task, baseline: Baseline, index: number): ReactElement | string | number | void
  /**
  
  	 * specifies the content of columns that show dates (return `Date` values) in grid
  
  	 * @param date the date which needs formatting
  
  	 * @param task the task object
  
  	 * @param column the name of the column that called the template
  
  	*/
  date_grid?(date: Date, task: Task, column: string): ReactElement | string
  /**
  
  	 * specifies the text of tooltips that are displayed when the user creates a new dependency link
  
  	 * @param from the id of the source task
  
  	 * @param from_start <i>true</i>, if the link is being dragged from the start of the  source task, <i>false</i> - if <br> from the end of the task
  
  	 * @param to the id of the target task( 'null' or 'undefined', if the target task isn't specified yet)
  
  	 * @param to_start <i>true</i>, if the link is being dragged to the start of the target task, <i>false</i> - if <br> to the end of the task
  
  	*/
  drag_link?(from: string | number, from_start: boolean, to: string | number, to_start: boolean): ReactElement | string
  /**
  
  	 * specifies the CSS class that will be applied to the pop-up that appears when a user drags a link
  
  	 * @param from the id of the source task
  
  	 * @param from_start <i>true</i>, if the link is being dragged from the start of the  source task, <i>false</i> - if <br> from the end of the task
  
  	 * @param to the id of the target task( 'null' or 'undefined', if the target task isn't specified yet)
  
  	 * @param to_start <i>true</i>, if the link is being dragged to the start of the target task, <i>false</i> - if <br> to the end of the task
  
  	*/
  drag_link_class?(from: string | number, from_start: boolean, to: string | number, to_start: boolean): ReactElement | string | void
  /**
  
  	 * converts a date object to a date string. Used to send data back to the server
  
  	 * @param date the date which needs formatting
  
  	*/
  format_date?(date: Date): ReactElement | string
  /**
  
  	 * specifies the custom content inserted before the labels of child items in the tree column
  
  	 * @param task the task object
  
  	*/
  grid_blank?(task: Task): ReactElement | string
  /**
  
  	 * specifies the format of dates for the columns that show dates (return the `Date` values)
  
  	 * @param date the date which needs formatting
  
  	 * @param column the name of the column that called the template
  
  	*/
  grid_date_format?(date: Date, column?: string): ReactElement | string
  /**
  
  	 * specifies the icon of child items in the tree column
  
  	 * @param task the task object
  
  	*/
  grid_file?(task: Task): ReactElement | string
  /**
  
  	 * specifies the icon of parent items in the tree column
  
  	 * @param task the task object
  
  	*/
  grid_folder?(task: Task): ReactElement | string
  /**
  
  	 * specifies the CSS class that will be applied to the headers of the table's columns
  
  	 * @param columnName the column's name (as specified in the "name" property of the column object)
  
  	 * @param column column object (as specified in the <i>gantt.config.columns</i> config)
  
  	*/
  grid_header_class?(columnName: string, column: any): ReactElement | string | void
  /**
  
  	 * specifies the indent  of the child items in a branch (in the tree column)
  
  	 * @param task the task object
  
  	*/
  grid_indent?(task: Task): ReactElement | string
  /**
  
  	 * specifies the icon of the open/close sign in the tree column
  
  	 * @param task the task object
  
  	*/
  grid_open?(task: Task): ReactElement | string
  /**
  
  	 * specifies the CSS class that will be applied to a grid row
  
  	 * @param start the date when a task is scheduled to begin
  
  	 * @param end the date when a task is scheduled to be completed
  
  	 * @param task the task object
  
  	*/
  grid_row_class?(start: Date, end: Date, task: Task): ReactElement | string | void
  /**
  
  	 * defines the height of the filled area in the resourceHistogram
  
  	 * @param start_date start date of the scale cell
  
  	 * @param end_date end date of the scale cell
  
  	 * @param resource the resource object
  
  	 * @param tasks tasks that are assigned to the specified resource and overlap start/end dates of the cell
  
  	 * @param assignments resource assignments that are assigned to the specified start/end dates of the task
  
  	*/
  histogram_cell_allocated?(start_date: Date, end_date: Date, resource: any, tasks: Array<Task>, assignments: any[]): number | void
  /**
  
  	 * specifies the height of the line that defines the available capacity of the resource
  
  	 * @param start_date start date of the scale cell
  
  	 * @param end_date end date of the scale cell
  
  	 * @param resource the resource object
  
  	 * @param tasks tasks that are assigned to the specified resource and overlap start/end dates of the cell
  
  	 * @param assignments resource assignments that are assigned to the specified start/end dates of the task
  
  	*/
  histogram_cell_capacity?(start_date: Date, end_date: Date, resource: any, tasks: Array<Task>, assignments: any[]): number | void
  /**
  
  	 * defines the CSS class which is applied to a cell of the resource panel
  
  	 * @param start_date start date of the scale cell
  
  	 * @param end_date end date of the scale cell
  
  	 * @param resource the resource object
  
  	 * @param tasks tasks that are assigned to the specified resource and overlap start/end dates of the cell
  
  	 * @param assignments resource assignments that are assigned to the specified start/end dates of the task
  
  	*/
  histogram_cell_class?(start_date: Date, end_date: Date, resource: any, tasks: Array<Task>, assignments: any[]): ReactElement | string | void
  /**
  
  	 * defines the label inside a cell
  
  	 * @param start_date start date of the scale cell
  
  	 * @param end_date end date of the scale cell
  
  	 * @param resource the resource object
  
  	 * @param tasks tasks that are assigned to the specified resource and overlap start/end dates of the cell
  
  	 * @param assignments resource assignments that are assigned to the specified start/end dates of the task
  
  	*/
  histogram_cell_label?(start_date: Date, end_date: Date, resource: any, tasks: Array<Task>, assignments: any[]): ReactElement | string | number | void
  /**
  
  	 * specifies the CSS class that will be applied to a link
  
  	 * @param link the link object
  
  	*/
  link_class?(link: Link): ReactElement | string | void
  /**
  
  	 * specifies the text in the header of the link's "delete" confirm window
  
  	 * @param link the link object
  
  	*/
  link_description?(link: any): ReactElement | string
  /**
  
  	 * converts date string into a Date object
  
  	 * @param date the string which need to be parsed
  
  	*/
  parse_date?(date: string): Date
  /**
  
  	 * specifies the text in the completed part of the task bar
  
  	 * @param start the date when a task is scheduled to begin
  
  	 * @param end the date when a task is scheduled to be completed
  
  	 * @param task the task object
  
  	*/
  progress_text?(start: Date, end: Date, task: Task): ReactElement | string | number | void
  /**
  
  	 * specifies the CSS class that will be applied to  the pop-up edit form
  
  	 * @param start the date when a task is scheduled to begin
  
  	 * @param end the date when a task is scheduled to be completed
  
  	 * @param task the task object
  
  	*/
  quick_info_class?(start: Date, end: Date, task: Task): ReactElement | string | void
  /**
  
  	 * specifies the content of the pop-up edit form
  
  	 * @param start the date when a task is scheduled to begin
  
  	 * @param end the date when a task is scheduled to be completed
  
  	 * @param task the task object
  
  	*/
  quick_info_content?(start: Date, end: Date, task: Task): ReactElement | string
  /**
  
  	 * specifies the date of the pop-up edit form
  
  	 * @param start the date when a task is scheduled to begin
  
  	 * @param end the date when  a task is scheduled to be completed
  
  	 * @param task the task object
  
  	*/
  quick_info_date?(start: Date, end: Date, task: Task): ReactElement | string
  /**
  
  	 * specifies the title of the pop-up edit form
  
  	 * @param start the date when a task is scheduled to begin
  
  	 * @param end the date when a task is scheduled to be completed
  
  	 * @param task the task object
  
  	*/
  quick_info_title?(start: Date, end: Date, task: Task): ReactElement | string | number | void
  /**
  
  	 * defines the CSS class names of cells in the resource timeline cells
  
  	 * @param start_date start date of the scale cell
  
  	 * @param end_date end date of the scale cell
  
  	 * @param resource the resource object
  
  	 * @param tasks tasks that are assigned to specified resource and overlap start/end dates of the cell
  
  	 * @param assignments resource assignments that are assigned to the specified start/end dates of the task
  
  	*/
  resource_cell_class?(start_date: Date, end_date: Date, resource: any, tasks: Array<Task>, assignments: any[]): ReactElement | string | void
  /**
  
  	 * defines the HTML content of resource timeline cells
  
  	 * @param start_date start date of the scale cell
  
  	 * @param end_date end date of the scale cell
  
  	 * @param resource the resource object
  
  	 * @param tasks tasks that are assigned to specified resource and overlap start/end dates of the cell
  
  	 * @param assignments resource assignments that are assigned to the specified start/end dates of the task
  
  	*/
  resource_cell_value?(start_date: Date, end_date: Date, resource: any, tasks: Array<Task>, assignments: any[]): ReactElement | string | number | void
  /**
  
  	 * specifies the CSS class that will be applied to cells of the time scale of the timeline area
  
  	 * @param date the date of a cell
  
  	*/
  scale_cell_class?(date: Date): ReactElement | string | void
  /**
  
  	 * specifies the CSS class that will be applied to the time scale
  
  	 * @param scale the scale's configuration object
  
  	*/
  scale_row_class?(scale: Scale): ReactElement | string | void
  /**
  
  	 * specifies the CSS class that will be applied to task bars
  
  	 * @param start the date when a task is scheduled to begin
  
  	 * @param end the date when a task is scheduled to be completed
  
  	 * @param task the task object
  
  	*/
  task_class?(start: Date, end: Date, task: Task): ReactElement | string | void
  /**
  
  	 * specifies the date format of the label in the 'Time period' section of the lightbox
  
  	 * @param date the date which needs formatting
  
  	*/
  task_date?(date: Date): ReactElement | string
  /**
  
  	 * specifies the format for the end dates of tasks in the lightbox
  
  	 * @param date the date which needs formatting
  
  	*/
  task_end_date?(date: Date): ReactElement | string
  /**
  
  	 * specifies the CSS class that will be applied to the row of the timeline area
  
  	 * @param start the date when a task is scheduled to begin
  
  	 * @param end the date when a task is scheduled to be completed
  
  	 * @param task the task object
  
  	*/
  task_row_class?(start: Date, end: Date, task: Task): ReactElement | string | void
  /**
  
  	 * specifies the text in the task bars and the header of the lightbox
  
  	 * @param start the date when a task is scheduled to begin
  
  	 * @param end the date when a task is scheduled to be completed
  
  	 * @param task the task object
  
  	*/
  task_text?(start: Date, end: Date, task: Task): ReactElement | string | number | void
  /**
  
  	 * specifies the date period in the header of the lightbox
  
  	 * @param start the date when a task is scheduled to begin
  
  	 * @param end the date when a task is scheduled to be completed
  
  	 * @param task the task object
  
  	*/
  task_time?(start: Date, end: Date, task: Task): ReactElement | string
  /**
  
  	 * specifies the dates of unscheduled tasks
  
  	 * @param task the task object
  
  	*/
  task_unscheduled_time?(task: Task): ReactElement | string | void
  /**
  
  	 * specifies the format of the drop-down time selector in the lightbox
  
  	 * @param date the date which needs formatting
  
  	*/
  time_picker?(date: Date): ReactElement | string
  /**
  
  	 * specifies the CSS class that will be applied to the cells of the timeline area
  
  	 * @param item either the task's or resource's object assigned to the row
  
  	 * @param date the date of a cell
  
  	*/
  timeline_cell_class?(item: any, date: Date): ReactElement | string | void
  /**
  
  	 * specifies custom HTML content in the timeline cells
  
  	 * @param task the task's object
  
  	 * @param date the date of a cell
  
  	*/
  timeline_cell_content?(task: Task, date: Date): ReactElement | string | number | void
  /**
  
  	 * specifies the format of start and end dates displayed in the tooltip
  
  	 * @param date the date which needs formatting
  
  	*/
  tooltip_date_format?(date: Date): ReactElement | string
  /**
  
  	 * specifies the text of tooltips
  
  	 * @param start the date when a task is scheduled to begin
  
  	 * @param end the date when a task is scheduled to be completed
  
  	 * @param task the task object
  
  	*/
  tooltip_text?(start: Date, end: Date, task: Task): ReactElement | string | void
  /**
  
  	 * specifies the text assigned to tasks bars on the right side
  
  	 * @param start the date when a task is scheduled to begin
  
  	 * @param end the date when a task is scheduled to be completed
  
  	 * @param task the task object
  
  	*/
  rightside_text?(start: Date, end: Date, task: Task): ReactElement | string | number | void
  /**
  
  	 * specifies the text assigned to tasks bars on the left side
  
  	 * @param start the date when a task is scheduled to begin
  
  	 * @param end the date when a task is scheduled to be completed
  
  	 * @param task the task object
  
  	*/
  leftside_text?(start: Date, end: Date, task: Task): ReactElement | string | number | void
  /**
  
  	 * specifies the lightbox's header
  
  	 * @param start_date the date when a task is scheduled to begin
  
  	 * @param end_date the date when a task is scheduled to be completed
  
  	 * @param task the task's object
  
  	*/
  lightbox_header?(start_date: Date, end_date: Date, task: Task): ReactElement | string
  /**
  
  	 * specifies the CSS class that will be applied to markers
  
  	 * @param marker the marker's configuration object
  
  	*/
  marker_class?(marker: any): void
}
