import type { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { useAxAppStore } from '../stores/context'
import { AxRailView } from './views/AxRailView'

// Right icon rail (Layout.Sider). Renders the store's normalized right rail — view-toggling panels in the
// split modes (SPLIT_VIEW_SINGLE / SPLIT_VIEW_MULTIPLE), action menus in ONE_PANEL_PAGE (kept in sync with
// the prpDsRightPanels / prpDsRightMenus props by AxAppSync). Collapses to a thin gutter when there's
// nothing to show. FILL_CONTENT_PAGE renders no right rail (AxAppMain skips it).
export const AxAppRight = observer((): ReactElement => {
  const store = useAxAppStore()
  return <AxRailView side="right" groups={store.rightRail} />
})
