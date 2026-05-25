/**
 * This file was generated from AxGantt.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from 'react'

export interface AxGanttContainerProps {
  name: string
  class: string
  style?: CSSProperties
  tabIndex?: number
  tasksJson?: string
  linksJson?: string
  configJson?: string
  height?: string
}

export interface AxGanttPreviewProps {
  /**
   * @deprecated Deprecated since version 9.18.0. Please use class property instead.
   */
  className: string
  class: string
  style: string
  styleObject?: CSSProperties
  readOnly: boolean
  renderMode: 'design' | 'xray' | 'structure'
  translate: (text: string) => string
  tasksJson?: string
  linksJson?: string
  configJson?: string
  height?: string
}
