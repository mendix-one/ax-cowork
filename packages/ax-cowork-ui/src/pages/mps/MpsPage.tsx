import { observer } from 'mobx-react-lite'
import { MpsLayout } from '@/pages/mps/layout/MpsLayout.tsx'
import { ProductionLineModal, MpsPlanModal } from '@/pages/mps/modals'
import { MpsContext } from '@/pages/mps/store/mps.context'
import { mpsStore } from '@/pages/mps/store/mps.store'
import { MpsPreflightModal } from '@/pages/mps/components/MpsPreflightModal'
import { MpsKeyboardShortcuts } from '@/pages/mps/components/MpsKeyboardShortcuts'

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
