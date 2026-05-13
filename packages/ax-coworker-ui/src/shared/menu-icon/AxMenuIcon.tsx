import { Tooltip } from 'antd'
import type { TooltipPlacement } from 'antd/es/tooltip'
import { AxMuiIcon, type MdiIconName } from '../mui-icon/AxMuiIcon.tsx'

export type AxMenuIconProps = {
  icon: MdiIconName
  title?: string
  placement?: TooltipPlacement
  onClick?: () => void
}

export const AxMenuIcon = (props: AxMenuIconProps) => {
  return (
    <Tooltip title={props.title} placement={props.placement}>
      <button className="ax-menu-icon" onClick={props.onClick}>
        <AxMuiIcon icon={props.icon} size="20px" className="ax-menu-icon_icon" />
      </button>
    </Tooltip>
  )
}
