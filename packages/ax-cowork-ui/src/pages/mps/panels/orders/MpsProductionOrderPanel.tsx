import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../store/mps.context'
import { MpsProductionOrderToolbar } from './MpsProductionOrderToolbar'
import { MpsAdjustmentSidebar } from '../../components/MpsAdjustmentSidebar'
import { MpsProductionOrderTable } from './MpsProductionOrderTable'
import { MpsProductionOrderInfoPanel } from './MpsProductionOrderInfoPanel'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

// Layout: shared Adjustment sidebar (left, open by default — same component the Gantt + Analysis views
// use, so adjustments propagate across views via the shared gantt store) + main column = table on top,
// info panel docked at the bottom (open by default). The visible-orders summary lives inside the info
// panel and is shown whenever no row is selected; selecting a row swaps the panel body to that row's
// detail card.
export const MpsProductionOrderPanel = observer((props: MainPanelControls) => {
  const po = useMpsContext().productionOrder
  return (
    <AxDisplayPanel type="main" icon="mdiClipboardListOutline" title="Orders" tools={<MpsProductionOrderToolbar />} {...props}>
      <div className="ax-po">
        <div className="ax-po_body">
          {po.filterSidebarOpen && <MpsAdjustmentSidebar onClose={() => po.toggleFilterSidebar()} />}
          <div className="ax-po_body_content">
            <MpsProductionOrderTable />
            {po.infoPanelOpen && <MpsProductionOrderInfoPanel />}
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
