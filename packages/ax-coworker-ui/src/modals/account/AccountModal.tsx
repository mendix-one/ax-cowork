import { useEffect, useMemo } from 'react'
import { Avatar, Button, Card, Flex, Menu, Modal, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useStore } from '@/acore/store/store.context'
import { AccountStore, type AccountMenuKey } from './store/account.store'
import { AccountStoreContext, useAccountStore } from './store/account.context'
import { AccountProfileView } from './views/AccountProfileView'
import { AccountSettingView } from './views/AccountSettingView'
import { ActiveSessionView } from './views/ActiveSessionView'
import { ApplicationRolesView } from './views/ApplicationRolesView'

// Modal vertical metrics. The body fills the remaining space after the title bar so the
// modal occupies ~80% of the viewport regardless of screen height. ~56px is AntD's title
// strip height — close enough; the body uses min-height-0 so any small rounding doesn't
// produce a stray scrollbar on the modal shell itself.
const MODAL_BODY_HEIGHT = 'calc(80vh - 56px)'

export const AccountModal = observer(() => {
  const { app, auth } = useStore()

  // Modal-local store — instantiated once and kept stable for the modal's lifetime.
  // `destroyOnHidden` on <Modal> means the children unmount on close but `store` survives
  // across opens; the sync effect below refreshes it on each open.
  const store = useMemo(() => new AccountStore(), [])

  // On open: seed from the auth snapshot so the modal paints instantly, then fire the
  // GraphQL profile fetch to refresh against fresh SSO data (which also brings the sessions
  // list back). On close: reset so the next open starts from a clean state.
  useEffect(() => {
    if (app.accountModalOpen) {
      store.syncFromAuth(auth.currentAccount)
      void store.init()
    } else {
      store.reset()
    }
  }, [app.accountModalOpen, auth.currentAccount, store])

  const { t } = useTranslation('app')

  return (
    <Modal
      title={t('account.title')}
      open={app.accountModalOpen}
      onCancel={() => app.closeAccountModal()}
      footer={null}
      destroyOnHidden
      centered
      width={880}
      // Body padding 0 so the two columns hug the modal edges; overflow hidden so the body
      // shell itself never scrolls — the main view inside owns its scroll.
      styles={{ body: { padding: 0, height: MODAL_BODY_HEIGHT, overflow: 'hidden' } }}
    >
      <AccountStoreContext.Provider value={store}>
        <AccountModalBody />
      </AccountStoreContext.Provider>
    </Modal>
  )
})

// Split into a child so observer() re-renders independently of the outer open observable
// and can read the AccountStore context.
const AccountModalBody = observer(() => {
  const store = useAccountStore()

  return (
    <Flex gap={12} style={{ height: '100%' }}>
      <AccountSidebar />
      {/* Main view — only this region scrolls. */}
      <div style={{ flex: 1, height: '100%', overflowY: 'auto' }}>
        {store.activeMenu === 'profile' && <AccountProfileView />}
        {store.activeMenu === 'setting' && <AccountSettingView />}
        {store.activeMenu === 'roles' && <ApplicationRolesView />}
        {store.activeMenu === 'session' && <ActiveSessionView />}
      </div>
    </Flex>
  )
})

const AccountSidebar = observer(() => {
  const { app, auth } = useStore()
  const store = useAccountStore()
  const { t } = useTranslation('app')

  const account = store.account
  const display = account?.display ?? t('account.guest')
  const username = account?.username ?? '—'
  const initial = (account?.display ?? 'G').charAt(0).toUpperCase()

  const menuItems: MenuProps['items'] = [
    { key: 'profile', label: t('account.menu.profile') },
    { key: 'setting', label: t('account.menu.setting') },
    { key: 'roles', label: t('account.menu.roles') },
    { key: 'session', label: t('account.menu.session') },
  ]

  const handleSignOut = async () => {
    await auth.signout()
    app.closeAccountModal()
  }

  return (
    <Card
      variant="outlined"
      style={{ width: 240, height: '100%', flexShrink: 0 }}
      styles={{ body: { padding: 0, height: '100%', display: 'flex', flexDirection: 'column' } }}
    >
      {/* Header — compact: avatar on the left, display + @username stacked on the right. */}
      <Flex align="center" gap={12} style={{ padding: 12 }}>
        <Avatar size={40} src={account?.avatar}>
          {initial}
        </Avatar>
        <Flex vertical style={{ minWidth: 0, flex: 1 }}>
          <Typography.Text strong ellipsis>
            {display}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }} ellipsis>
            @{username}
          </Typography.Text>
        </Flex>
      </Flex>

      {/* Action menu — sidebar has no scroll; menu fills available space and pushes the signout
          button down naturally via flex layout. */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <Menu
          mode="inline"
          selectedKeys={[store.activeMenu]}
          items={menuItems}
          onClick={({ key }) => store.setActiveMenu(key as AccountMenuKey)}
          style={{ background: 'transparent', borderInlineEnd: 'none' }}
        />
      </div>

      {/* Sign out — fixed at the bottom of the sidebar. */}
      <div style={{ padding: 12 }}>
        <Button block danger disabled={!account || auth.isLoading} loading={auth.isLoading} onClick={() => void handleSignOut()}>
          {t('account.signOut')}
        </Button>
      </div>
    </Card>
  )
})
