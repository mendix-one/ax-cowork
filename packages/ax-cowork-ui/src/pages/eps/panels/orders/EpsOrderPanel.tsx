import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { EpsOrderToolbar } from './EpsOrderToolbar'
import { EpsAdjustmentSidebar } from '../../views/EpsAdjustmentSidebar'
import { EpsOrderTable } from './EpsOrderTable'
import { EpsOrderInfoPanel } from './EpsOrderInfoPanel'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

// Layout: shared Adjustment sidebar (left, open by default — same component the Gantt + Analysis views
// use, so adjustments propagate across views via the shared simulation store) + main column = table on top,
// info panel docked at the bottom (open by default). The visible-orders summary lives inside the info
// panel and is shown whenever no row is selected; selecting a row swaps the panel body to that row's
// detail card.
export const EpsOrderPanel = observer((props: MainPanelControls) => {
  const po = useEpsContext().order
  return (
    <AxDisplayPanel type="main" icon="mdiClipboardListOutline" title="Production Requirements" tools={<EpsOrderToolbar />} {...props}>
      <div className="ax-eps-order">
        <div className="ax-eps-order_body">
          {po.filterSidebarOpen && <EpsAdjustmentSidebar onClose={() => po.toggleFilterSidebar()} />}
          <div className="ax-eps-order_body_content">
            <EpsOrderTable />
            {po.infoPanelOpen && <EpsOrderInfoPanel />}
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
