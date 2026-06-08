import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { EpsFactorsFilter } from '../../views/EpsFactorsFilter'

// Gantt-side wrapper around the shared factor filters panel — wires the close button to the simulation's own
// sidebar-visibility flag.
export const EpsSimulationFilterSidebar = observer(() => {
  const simulation = useEpsContext().simulation
  return <EpsFactorsFilter onClose={() => simulation.toggleFilterSidebar()} />
})
