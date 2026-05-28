import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../stores/mps.context'
import { MpsAdjustmentSidebar } from '../../views/MpsAdjustmentSidebar'

// Gantt-side wrapper around the shared adjustment sidebar — wires the close button to the simulation's own
// sidebar-visibility flag while the rest of the panel (tree, apply/reset) is shared with other views.
export const MpsSimulationFilterSidebar = observer(() => {
  const simulation = useMpsContext().simulation
  return <MpsAdjustmentSidebar onClose={() => simulation.toggleFilterSidebar()} />
})
