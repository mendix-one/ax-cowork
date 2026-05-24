import { observer } from 'mobx-react-lite'
import { SimulationLayout } from '@/pages/simulation/layout/SimulationLayout.tsx'
import { ProductionLineModal, SimulationPlanModal } from '@/pages/simulation/modals'
import { SimulationContext } from '@/pages/simulation/store/simulation.context'
import { simulationStore } from '@/pages/simulation/store/simulation.store'

export const SimulationPage = observer(() => {
  return (
    <SimulationContext.Provider value={simulationStore}>
      <SimulationLayout />
      <ProductionLineModal />
      <SimulationPlanModal />
    </SimulationContext.Provider>
  )
})
