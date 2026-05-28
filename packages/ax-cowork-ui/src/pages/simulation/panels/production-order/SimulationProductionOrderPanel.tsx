import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { SimulationProductionOrderToolbar } from './SimulationProductionOrderToolbar'
import { SimulationAdjustmentSidebar } from '../../components/SimulationAdjustmentSidebar'
import { SimulationProductionOrderTable } from './SimulationProductionOrderTable'
import { SimulationProductionOrderInfoPanel } from './SimulationProductionOrderInfoPanel'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

// Layout: shared Adjustment sidebar (left, open by default — same component the Gantt + Analysis views
// use, so adjustments propagate across views via the shared gantt store) + main column = table on top,
// info panel docked at the bottom (open by default). The visible-orders summary lives inside the info
// panel and is shown whenever no row is selected; selecting a row swaps the panel body to that row's
// detail card.
export const SimulationProductionOrderPanel = observer((props: MainPanelControls) => {
  const po = useSimulationContext().productionOrder
  return (
    <AxDisplayPanel type="main" icon="mdiClipboardListOutline" title="Production Orders" tools={<SimulationProductionOrderToolbar />} {...props}>
      <div className="ax-po">
        <div className="ax-po_body">
          {po.filterSidebarOpen && <SimulationAdjustmentSidebar onClose={() => po.toggleFilterSidebar()} />}
          <div className="ax-po_body_content">
            <SimulationProductionOrderTable />
            {po.infoPanelOpen && <SimulationProductionOrderInfoPanel />}
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
