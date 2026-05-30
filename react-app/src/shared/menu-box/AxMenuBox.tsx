import { Tooltip } from 'antd'
import type { TooltipPlacement } from 'antd/es/tooltip'
import { AxMuiIcon, type MdiIconName } from '../mui-icon/AxMuiIcon.tsx'

export type AxMenuBoxProps = {
  icon: MdiIconName
  label: string
  title?: string
  placement?: TooltipPlacement
  onClick?: () => void
}

export const AxMenuBox = (props: AxMenuBoxProps) => {
  return (
    <Tooltip title={props.title} placement={props.placement}>
      <button className="ax-menu-box" onClick={props.onClick}>
        <AxMuiIcon icon={props.icon} size="1.715rem" className="ax-menu-box_icon" />
        <span className="ax-menu-box_text">{props.label}</span>
        <AxMuiIcon icon="mdiMenuDown" size="1.15rem" className="ax-menu-box_down" />
      </button>
    </Tooltip>
  )
}
