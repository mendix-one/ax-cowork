import type { ReactElement, ReactNode } from 'react'
import cn from 'classnames'

// One stacked content view. All views are mounted; only the active one is shown (CSS fade). Inactive
// views keep visibility:hidden (not display:none) so a panel's first paint isn't deferred to activation,
// and so the resizable Splitter never remounts its children when the active view changes.
export function ViewSlot({ active, children }: { active: boolean; children: ReactNode }): ReactElement {
  return <div className={cn('ax-sim_slot', active ? 'is-active' : 'is-inactive')}>{children}</div>
}
