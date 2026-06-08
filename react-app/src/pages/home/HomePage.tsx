import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/acore/store/store.context'
import { HomeContext } from '@/pages/home/stores/home.context'
import { homeStore } from '@/pages/home/stores/home.store'
import { HomeLayout } from '@/pages/home/layout/HomeLayout.tsx'

// HomePage mirrors the eps / mps module wiring: it provides the per-page HomeStore through a React context
// and renders the shell layout. The shared (persisted) production-line selection is bridged into the store
// here, so the layout components read line data only from HomeStore. The notify / account / settings modals
// are mounted globally by PageLayout.
export const HomePage = observer(() => {
  const { productionLine } = useStore()

  useEffect(() => {
    homeStore.bind(productionLine)
  }, [productionLine])

  return (
    <HomeContext.Provider value={homeStore}>
      <HomeLayout />
    </HomeContext.Provider>
  )
})
