import { observer } from 'mobx-react-lite'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useStore } from '@/acore/store/store.context'

const SYSTEM_ERROR_PATH = '/system-error'

export const InterruptionGuard = observer(() => {
  const { auth } = useStore()
  const location = useLocation()

  if (auth.isInterrupted && location.pathname !== SYSTEM_ERROR_PATH) {
    return <Navigate to={SYSTEM_ERROR_PATH} replace />
  }
  return <Outlet />
})
