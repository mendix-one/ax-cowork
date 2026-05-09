import { observer } from 'mobx-react-lite'
import * as mdiPaths from '@mdi/js'

export type MuiIconProps = {
  icon: string
  size?: string | number
  color?: string
  className?: string
}

const paths = mdiPaths as unknown as Record<string, string>

export const AxMuiIcon = observer((props: MuiIconProps) => {
  const path = paths[props.icon]
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
})
