import { observer } from 'mobx-react-lite'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useStore } from '@/acore/store/store.context'

export const RequireAuth = observer(() => {
  const { auth } = useStore()
  const location = useLocation()

  if (!auth.isAuthed) {
    return <Navigate to="/auth/signin" state={{ from: location.pathname }} replace />
  }
  return <Outlet />
})
