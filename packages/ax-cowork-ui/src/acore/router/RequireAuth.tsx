import { observer } from 'mobx-react-lite'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useStore } from '@/acore/store/store.context'
import { buildSigninRedirect } from './redirect-url'

export const RequireAuth = observer(() => {
  const { auth } = useStore()
  const location = useLocation()

  if (!auth.isAuthed) {
    // Encode the full requested URI (pathname + search + hash) into `?next=...` so it
    // survives a full page reload of the signin screen. SignInPage reads it back via
    // readNextFromSearch().
    return <Navigate to={buildSigninRedirect(location)} replace />
  }
  return <Outlet />
})
