import * as mdiPaths from '@mdi/js'

export type MdiIconName = keyof typeof mdiPaths

export type MuiIconProps = {
  icon: MdiIconName
  size?: string | number
  color?: string
  className?: string
}

export const AxMuiIcon = (props: MuiIconProps) => {
  const path = mdiPaths[props.icon]
  if (!path) return null
  const size = props.size ? (typeof props.size === 'number' ? `${props.size}px` : props.size) : '24px'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={props.className}
      fill={props.color ?? 'currentColor'}
      style={{ display: 'inline-block', width: size, height: size }}
    >
      <path d={path} />
    </svg>
  )
}
