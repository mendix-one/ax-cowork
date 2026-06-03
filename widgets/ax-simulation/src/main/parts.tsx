import type { ReactElement, ReactNode } from 'react'
import cn from 'classnames'
import { Tooltip } from 'antd'
import type { MenuItem } from './menus'

// A single icon button in one of the vertical rails. Mirrors react-app's AxMenuIcon: tooltip on hover,
// primary-tinted active state.
export function RailButton<Id extends string>({
  item,
  active,
  placement,
  onClick,
}: {
  item: MenuItem<Id>
  active: boolean
  placement: 'right' | 'left'
  onClick: () => void
}): ReactElement {
  return (
    <Tooltip title={item.label} placement={placement}>
      <button
        type="button"
        className={cn('ax-sim_rail_btn', { 'is-active': active })}
        aria-label={item.label}
        aria-pressed={active}
        onClick={onClick}
      >
        <span className="ax-sim_rail_btn_icon">{item.icon}</span>
      </button>
    </Tooltip>
  )
}

// One stacked content view. All views are mounted; only the active one is shown (CSS fade). Inactive
// views keep visibility:hidden (not display:none) so a panel's first paint isn't deferred to activation,
// and so the resizable Splitter never remounts its children when the active view changes.
export function ViewSlot({ active, children }: { active: boolean; children: ReactNode }): ReactElement {
  return <div className={cn('ax-sim_slot', active ? 'is-active' : 'is-inactive')}>{children}</div>
}
