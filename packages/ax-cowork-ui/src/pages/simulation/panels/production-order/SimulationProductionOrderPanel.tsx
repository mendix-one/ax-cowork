import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { SimulationProductionOrderToolbar } from './SimulationProductionOrderToolbar'
import { SimulationProductionOrderFilterSidebar } from './SimulationProductionOrderFilterSidebar'
import { SimulationProductionOrderTable } from './SimulationProductionOrderTable'
import { SimulationProductionOrderInfoPanel } from './SimulationProductionOrderInfoPanel'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const SimulationProductionOrderPanel = observer((props: MainPanelControls) => {
  const po = useSimulationContext().productionOrder
  return (
    <AxDisplayPanel type="main" icon="mdiClipboardListOutline" title="Production Orders" tools={<SimulationProductionOrderToolbar />} {...props}>
      <div className="ax-po">
        <div className="ax-po_body">
          {po.filterSidebarOpen && <SimulationProductionOrderFilterSidebar />}
          <div className="ax-po_body_content">
            <SimulationProductionOrderTable />
            {po.infoPanelOpen && <SimulationProductionOrderInfoPanel />}
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
