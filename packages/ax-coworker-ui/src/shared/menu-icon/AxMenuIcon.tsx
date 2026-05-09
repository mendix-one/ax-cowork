import { observer } from 'mobx-react-lite'
import { cloneElement, type ReactElement, isValidElement } from 'react'
import { Tooltip } from 'antd'
import type { TooltipPlacement } from 'antd/es/tooltip'
import { AxMuiIcon } from '../mui-icon/AxMuiIcon.tsx'

export type AxMenuIconProps = {
  icon: string | ReactElement
  title?: string
  placement?: TooltipPlacement
  onClick?: () => void
}

export const AxMenuIcon = observer((props: AxMenuIconProps) => {
  const myIcon = isValidElement(props.icon) ? (
    cloneElement(props.icon, { size: '20px', className: 'ax-menu-icon_icon' } as never)
  ) : (
    <AxMuiIcon icon={props.icon} size="20px" className="ax-menu-icon_icon" />
  )
  return (
    <Tooltip title={props.title} placement={props.placement}>
      <button className="ax-menu-icon" onClick={props.onClick}>
        {myIcon}
      </button>
    </Tooltip>
  )
})
