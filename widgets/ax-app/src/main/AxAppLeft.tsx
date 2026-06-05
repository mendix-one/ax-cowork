import type { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { useAxAppStore } from '../stores/context'
import { AxRailView } from './views/AxRailView'

// Left icon rail (Layout.Sider). Renders the store's normalized left rail — view-switching panels in
// SPLIT_VIEW_MULTIPLE, action menus in ONE_PANEL_PAGE / SPLIT_VIEW_SINGLE (kept in sync with the
// prpDsLeftPanels / prpDsLeftMenus props by AxAppSync). Collapses to a thin gutter when there's nothing to
// show. FILL_CONTENT_PAGE renders no left rail (AxAppMain skips it).
export const AxAppLeft = observer((): ReactElement => {
  const store = useAxAppStore()
  return <AxRailView side="left" groups={store.leftRail} />
})
