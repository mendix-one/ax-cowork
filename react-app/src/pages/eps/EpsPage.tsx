import { observer } from 'mobx-react-lite'
import { EpsLayout } from '@/pages/eps/layout/EpsLayout.tsx'
import { ProductionLineModal, EpsPlanModal } from '@/pages/eps/modals'
import { EpsContext } from '@/pages/eps/stores/eps.context'
import { epsStore } from '@/pages/eps/stores/eps.store'
import { EpsPreflightModal } from '@/pages/eps/views/EpsPreflightModal'
import { EpsKeyboardShortcuts } from '@/pages/eps/views/EpsKeyboardShortcuts'

export const EpsPage = observer(() => {
  const preflightLabel = epsStore.preflightTarget === 'simulation' ? 'Save Simulation plan' : epsStore.preflightTarget === 'orders' ? 'Save Orders edits' : undefined
  return (
    <EpsContext.Provider value={epsStore}>
      <EpsLayout />
      <ProductionLineModal />
      <EpsPlanModal />
      <EpsPreflightModal
        open={epsStore.preflightTarget !== null}
        actionLabel={preflightLabel}
        onCancel={() => epsStore.closePreflight()}
        onConfirm={() => epsStore.confirmPreflight()}
      />
      <EpsKeyboardShortcuts />
    </EpsContext.Provider>
  )
})
