import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { SimulationAdjustmentSidebar } from '../../components/SimulationAdjustmentSidebar'

// Gantt-side wrapper around the shared adjustment sidebar — wires the close button to the gantt's own
// sidebar-visibility flag while the rest of the panel (tree, apply/reset) is shared with other views.
export const SimulationGanttFilterSidebar = observer(() => {
  const gantt = useSimulationContext().gantt
  return <SimulationAdjustmentSidebar onClose={() => gantt.toggleFilterSidebar()} />
})
