import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../stores/mps.context'
import { MpsOrderToolbar } from './MpsOrderToolbar'
import { MpsAdjustmentSidebar } from '../../views/MpsAdjustmentSidebar'
import { MpsOrderTable } from './MpsOrderTable'
import { MpsOrderInfoPanel } from './MpsOrderInfoPanel'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

// Layout: shared Adjustment sidebar (left, open by default — same component the Gantt + Analysis views
// use, so adjustments propagate across views via the shared simulation store) + main column = table on top,
// info panel docked at the bottom (open by default). The visible-orders summary lives inside the info
// panel and is shown whenever no row is selected; selecting a row swaps the panel body to that row's
// detail card.
export const MpsOrderPanel = observer((props: MainPanelControls) => {
  const po = useMpsContext().order
  return (
    <AxDisplayPanel type="main" icon="mdiClipboardListOutline" title="Orders" tools={<MpsOrderToolbar />} {...props}>
      <div className="ax-order">
        <div className="ax-order_body">
          {po.filterSidebarOpen && <MpsAdjustmentSidebar onClose={() => po.toggleFilterSidebar()} />}
          <div className="ax-order_body_content">
            <MpsOrderTable />
            {po.infoPanelOpen && <MpsOrderInfoPanel />}
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
