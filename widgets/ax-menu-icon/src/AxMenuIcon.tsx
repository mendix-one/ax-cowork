import type { MouseEvent, ReactElement } from 'react'
import * as mdiPaths from '@mdi/js'
import type { AxMenuIconContainerProps } from '../typings/AxMenuIconProps'
import './ui/AxMenuIcon.css'

const DEFAULT_ICON = 'mdiApps'
const DEFAULT_SIZE = 20

type MdiDictionary = Record<string, string>

const mdi = mdiPaths as MdiDictionary

const resolvePath = (iconName?: string): string | null => {
  const key = iconName?.trim() || DEFAULT_ICON
  return mdi[key] ?? null
}

export function AxMenuIcon(props: AxMenuIconContainerProps): ReactElement {
  const path = resolvePath(props.iconName)

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!props.onClick?.canExecute) {
      event.preventDefault()
      return
    }
    props.onClick.execute?.()
  }

  if (!path) {
    return <span className={props.class} style={props.style}>Unknown icon: {props.iconName}</span>
  }

  return (
    <button
      type="button"
      className={`ax-menu-icon ${props.class ?? ''}`.trim()}
      style={props.style}
      tabIndex={props.tabIndex}
      onClick={onClick}
      disabled={props.onClick ? props.onClick.canExecute === false : false}
      aria-label={props.iconName || DEFAULT_ICON}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="ax-menu-icon__svg" width={DEFAULT_SIZE} height={DEFAULT_SIZE}>
        <path d={path} />
      </svg>
    </button>
  )
}
