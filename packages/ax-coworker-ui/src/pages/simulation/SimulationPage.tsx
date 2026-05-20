import { observer } from 'mobx-react-lite'
import { SimulationLayout } from '@/pages/simulation/layout/SimulationLayout.tsx'
import { SimulationContext } from '@/pages/simulation/store/simulation.context'
import { simulationStore } from '@/pages/simulation/store/simulation.store'

export const SimulationPage = observer(() => {
  return (
    <SimulationContext.Provider value={simulationStore}>
      <SimulationLayout />
    </SimulationContext.Provider>
  )
})
