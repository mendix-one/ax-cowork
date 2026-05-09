import { observer } from 'mobx-react-lite'
import { cloneElement, isValidElement, type ReactElement } from 'react'
import { Tooltip } from 'antd'
import type { TooltipPlacement } from 'antd/es/tooltip'
import { AxMuiIcon } from '../mui-icon/AxMuiIcon.tsx'

export type AxMenuIconProps = {
  icon: string | ReactElement
  label: string
  title?: string
  placement?: TooltipPlacement
  onClick?: () => void
}

export const AxMenuBox = observer((props: AxMenuIconProps) => {
  const myIcon = isValidElement(props.icon) ? (
    cloneElement(props.icon, { size: '20px', className: 'ax-menu-box_icon' } as never)
  ) : (
    <AxMuiIcon icon={props.icon} size="20px" className="ax-menu-box_icon" />
  )
  return (
    <Tooltip title={props.title} placement={props.placement}>
      <button className="ax-menu-box" onClick={props.onClick}>
        {myIcon}
        <p className="ax-menu-box_text">{props.label}</p>
        <AxMuiIcon icon="mdiMenuDown" size="16px" className="ax-menu-box_down" />
      </button>
    </Tooltip>
  )
})
