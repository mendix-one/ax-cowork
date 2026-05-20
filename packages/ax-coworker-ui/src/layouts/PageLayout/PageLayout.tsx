import { Outlet } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

export const PageLayout = observer(() => {
  return <Outlet />
})
