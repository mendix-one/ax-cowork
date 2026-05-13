import { observer } from 'mobx-react-lite'
import { Navigate, Outlet } from 'react-router-dom'
import { useStore } from '@/acore/store/store.context'

export const RedirectIfAuthed = observer(() => {
  const { auth } = useStore()
  if (auth.isAuthed) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
})
