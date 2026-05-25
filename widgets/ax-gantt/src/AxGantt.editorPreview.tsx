import type { ReactElement } from 'react'
import type { AxGanttPreviewProps } from '../typings/AxGanttProps'
import './ui/AxGantt.css'

declare const require: (path: string) => string

export function preview(props: AxGanttPreviewProps): ReactElement {
  const height = props.height?.trim() || '280px'
  return (
    <div className={`ax-gantt ${props.class ?? ''}`.trim()} style={props.styleObject}>
      <div className="ax-gantt__preview" style={{ height }}>
        <div className="ax-gantt__preview-title">AX Gantt</div>
        <div>Preview placeholder</div>
        <div>tasksJson: {props.tasksJson?.trim() ? 'Provided' : 'Using default sample data'}</div>
        <div>linksJson: {props.linksJson?.trim() ? 'Provided' : 'Using default sample data'}</div>
        <div>configJson: {props.configJson?.trim() ? 'Provided' : 'Using default config'}</div>
      </div>
    </div>
  )
}

export function getPreviewCss(): string {
  return require('./ui/AxGantt.css')
}
