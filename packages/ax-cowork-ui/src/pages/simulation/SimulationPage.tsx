import { observer } from 'mobx-react-lite'
import { SimulationLayout } from '@/pages/simulation/layout/SimulationLayout.tsx'
import { ProductionLineModal, SimulationPlanModal } from '@/pages/simulation/modals'
import { SimulationContext } from '@/pages/simulation/store/simulation.context'
import { simulationStore } from '@/pages/simulation/store/simulation.store'
import { SimulationPreflightModal } from '@/pages/simulation/components/SimulationPreflightModal'

export const SimulationPage = observer(() => {
  const preflightLabel = simulationStore.preflightTarget === 'gantt' ? 'Save Gantt plan' : simulationStore.preflightTarget === 'productionOrder' ? 'Save Production Order edits' : undefined
  return (
    <SimulationContext.Provider value={simulationStore}>
      <SimulationLayout />
      <ProductionLineModal />
      <SimulationPlanModal />
      <SimulationPreflightModal
        open={simulationStore.preflightTarget !== null}
        actionLabel={preflightLabel}
        onCancel={() => simulationStore.closePreflight()}
        onConfirm={() => simulationStore.confirmPreflight()}
      />
    </SimulationContext.Provider>
  )
})
