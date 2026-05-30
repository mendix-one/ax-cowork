import { Tooltip } from 'antd'
import type { TooltipPlacement } from 'antd/es/tooltip'
import { AxMuiIcon, type MdiIconName } from '../mui-icon/AxMuiIcon.tsx'

export type AxMenuIconBadge = {
  count?: number
  severity: 'warning' | 'critical'
  reason?: string
}

export type AxMenuIconProps = {
  icon: MdiIconName
  isActive?: boolean
  title?: string
  placement?: TooltipPlacement
  onClick?: () => void
  // Optional badge: small dot (+optional count) in the corner of the icon, used to surface unattended risk.
  badge?: AxMenuIconBadge | null
}

export const AxMenuIcon = (props: AxMenuIconProps) => {
  const tooltipTitle = props.badge?.reason ? (
    <>
      {props.title}
      <div style={{ marginTop: 4, opacity: 0.85 }}>{props.badge.reason}</div>
    </>
  ) : (
    props.title
  )
  return (
    <Tooltip title={tooltipTitle} placement={props.placement}>
      <button className={`ax-menu-icon ${props.isActive ? 'is-active' : ''}`} onClick={props.onClick}>
        <AxMuiIcon icon={props.icon} size="20px" className="ax-menu-icon_icon" />
        {props.badge && (
          <span className={`ax-menu-icon_badge ax-menu-icon_badge__${props.badge.severity}`}>
            {props.badge.count !== undefined && props.badge.count > 0 ? props.badge.count : ''}
          </span>
        )}
      </button>
    </Tooltip>
  )
}
