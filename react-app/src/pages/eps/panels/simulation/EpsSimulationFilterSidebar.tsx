import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { EpsAdjustmentSidebar } from '../../views/EpsAdjustmentSidebar'

// Gantt-side wrapper around the shared adjustment sidebar — wires the close button to the simulation's own
// sidebar-visibility flag while the rest of the panel (tree, apply/reset) is shared with other views.
export const EpsSimulationFilterSidebar = observer(() => {
  const simulation = useEpsContext().simulation
  return <EpsAdjustmentSidebar onClose={() => simulation.toggleFilterSidebar()} />
})
