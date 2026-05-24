import { Tooltip } from 'antd'
import type { TooltipPlacement } from 'antd/es/tooltip'
import { AxMuiIcon, type MdiIconName } from '../mui-icon/AxMuiIcon.tsx'

export type AxBreadcrumbProps = {
  icon: MdiIconName
  label: string
  title?: string
  placement?: TooltipPlacement
  onClick?: () => void
}

export const AxBreadcrumb = (props: AxBreadcrumbProps) => {
  return (
    <Tooltip title={props.title} placement={props.placement}>
      <button className="ax-breadcrumb" onClick={props.onClick}>
        <AxMuiIcon icon={props.icon} size="16px" className="ax-breadcrumb_icon" />
        <p className="ax-breadcrumb_text">{props.label}</p>
      </button>
    </Tooltip>
  )
}
