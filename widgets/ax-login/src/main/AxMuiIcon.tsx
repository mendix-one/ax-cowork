import * as mdiPaths from '@mdi/js'

// Ported from react-app/src/shared/mui-icon/AxMuiIcon.tsx — renders a Material Design Icon
// (mdi) path as an inline SVG. Icon names are the @mdi/js export keys (e.g. 'mdiAccountOutline').
export type MdiIconName = keyof typeof mdiPaths

export interface AxMuiIconProps {
  icon: MdiIconName
  size?: string | number
  color?: string
  className?: string
}

export function AxMuiIcon({ icon, size, color, className }: AxMuiIconProps) {
  const path = mdiPaths[icon]
  if (!path) return null
  const dimension = size ? (typeof size === 'number' ? `${size}px` : size) : '24px'
  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 24 24"
      className={className}
      fill={color ?? 'currentColor'}
      style={{ display: 'inline-block', width: dimension, height: dimension }}
    >
      <path d={path} />
    </svg>
  )
}
