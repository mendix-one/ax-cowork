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
        <AxMuiIcon icon={props.icon} size="20px" className="ax-menu-box_icon" />
        <p className="ax-menu-box_text">{props.label}</p>
        <AxMuiIcon icon="mdiMenuDown" size="16px" className="ax-menu-box_down" />
      </button>
    </Tooltip>
  )
}
