import type { ReactElement } from 'react'

// Mock of Mendix's `mendix/components/web/Icon`. Aliased in vite.config so widgets that import the
// real component (e.g. AxDisplayPanel) resolve here in the simulation host. Renders the WebIcon shape:
// image icons as <img>, glyph/icon-font icons as a <span> carrying the icon CSS class.
type WebIcon =
  | { type: 'glyph'; iconClass: string }
  | { type: 'icon'; iconClass: string }
  | { type: 'image'; iconUrl: string }
  | undefined

export interface IconProps {
  icon?: WebIcon
  altText?: string
}

export function Icon({ icon, altText }: IconProps): ReactElement | null {
  if (!icon) return null
  if (icon.type === 'image') {
    return <img src={icon.iconUrl} alt={altText ?? ''} style={{ width: '1em', height: '1em' }} />
  }
  return <span className={icon.iconClass} aria-label={altText} role="img" />
}
