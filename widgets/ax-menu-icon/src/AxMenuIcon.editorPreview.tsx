import type { ReactElement } from 'react'
import * as mdiPaths from '@mdi/js'
import type { AxMenuIconPreviewProps } from '../typings/AxMenuIconProps'
import './ui/AxMenuIcon.css'

declare const require: (path: string) => string

type MdiDictionary = Record<string, string>

const mdi = mdiPaths as MdiDictionary

const resolvePath = (iconName?: string): string | null => {
  const key = iconName?.trim() || 'mdiApps'
  return mdi[key] ?? null
}

export function preview(props: AxMenuIconPreviewProps): ReactElement {
  const path = resolvePath(props.iconName)

  if (!path) {
    return <span className={props.class} style={props.styleObject}>Unknown icon: {props.iconName}</span>
  }

  return (
    <span className={`ax-menu-icon ${props.class ?? ''}`.trim()} style={props.styleObject}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="ax-menu-icon__svg" width={20} height={20}>
        <path d={path} />
      </svg>
    </span>
  )
}

export function getPreviewCss(): string {
  return require('./ui/AxMenuIcon.css')
}
