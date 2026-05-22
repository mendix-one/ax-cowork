import { Outlet } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { AccountModal } from '@/modals/account'
import { GuidesModal } from '@/modals/guides'
import { NotifyModal } from '@/modals/notify'
import { SettingModal } from '@/modals/setting'
import { SupportModal } from '@/modals/support'

export const PageLayout = observer(() => {
  return (
    <>
      <Outlet />
      <SettingModal />
      <AccountModal />
      <NotifyModal />
      <GuidesModal />
      <SupportModal />
    </>
  )
})
