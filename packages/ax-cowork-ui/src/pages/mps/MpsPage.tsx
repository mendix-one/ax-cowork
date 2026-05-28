import { observer } from 'mobx-react-lite'
import { MpsLayout } from '@/pages/mps/layout/MpsLayout.tsx'
import { ProductionLineModal, MpsPlanModal } from '@/pages/mps/modals'
import { MpsContext } from '@/pages/mps/stores/mps.context'
import { mpsStore } from '@/pages/mps/stores/mps.store'
import { MpsPreflightModal } from '@/pages/mps/views/MpsPreflightModal'
import { MpsKeyboardShortcuts } from '@/pages/mps/views/MpsKeyboardShortcuts'

export const MpsPage = observer(() => {
  const preflightLabel = mpsStore.preflightTarget === 'simulation' ? 'Save Simulation plan' : mpsStore.preflightTarget === 'orders' ? 'Save Orders edits' : undefined
  return (
    <MpsContext.Provider value={mpsStore}>
      <MpsLayout />
      <ProductionLineModal />
      <MpsPlanModal />
      <MpsPreflightModal
        open={mpsStore.preflightTarget !== null}
        actionLabel={preflightLabel}
        onCancel={() => mpsStore.closePreflight()}
        onConfirm={() => mpsStore.confirmPreflight()}
      />
      <MpsKeyboardShortcuts />
    </MpsContext.Provider>
  )
})
