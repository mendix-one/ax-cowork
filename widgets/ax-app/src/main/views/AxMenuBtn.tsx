import type { ReactElement, ReactNode } from 'react'
import { Tooltip } from 'antd'
import cn from 'classnames'
import type { TooltipPlacement } from 'antd/es/tooltip'

export type MenuItemProps = {
  title: string
  active: boolean
  placement: TooltipPlacement
  onClick: () => void
  children: ReactNode
}

export function AxMenuBtn({ title, active, placement, onClick, children }: MenuItemProps): ReactElement {
  return (
    <Tooltip title={title} placement={placement}>
      <button type="button" className={cn('ax-menu-button', { 'is-active': active })} aria-label={title} aria-pressed={active} onClick={onClick}>
        <span className="ax-menu-button_icon">{children}</span>
      </button>
    </Tooltip>
  )
}
