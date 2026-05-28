import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../store/mps.context'
import { MpsAdjustmentSidebar } from '../../components/MpsAdjustmentSidebar'

// Gantt-side wrapper around the shared adjustment sidebar — wires the close button to the gantt's own
// sidebar-visibility flag while the rest of the panel (tree, apply/reset) is shared with other views.
export const MpsGanttFilterSidebar = observer(() => {
  const gantt = useMpsContext().gantt
  return <MpsAdjustmentSidebar onClose={() => gantt.toggleFilterSidebar()} />
})
