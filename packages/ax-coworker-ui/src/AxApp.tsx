import { useEffect } from 'react'
import { App as AntApp, ConfigProvider, Spin } from 'antd'
import { observer } from 'mobx-react-lite'
import { RouterProvider } from 'react-router-dom'
import { StoreContext } from '@/acore/store/store.context'
import { rootStore } from '@/acore/store/root.store'
import { index } from '@/acore/router'
import { axColors, axTheme } from '@/acore/theme/theme'

// Boot screen — shown until `auth.init()` finishes its first call (success or failure).
// Keeps the router from mounting (and thus from firing route guards / page loaders)
// before we know who the caller is.
const AppShell = observer(() => {
  const auth = rootStore.auth

  useEffect(() => {
    void auth.init()
  }, [auth])

  if (!auth.initialized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    )
  }

  return <RouterProvider router={index} />
})

function AxApp() {
  return (
    <StoreContext.Provider value={rootStore}>
      <ConfigProvider
        theme={axTheme}
        form={{
          requiredMark: (labelNode, { required }) => (
            <>
              {labelNode}
              {required && (
                <span aria-hidden="true" style={{ color: axColors.error, marginInlineStart: 4 }}>
                  *
                </span>
              )}
            </>
          ),
        }}
      >
        <AntApp>
          <AppShell />
        </AntApp>
      </ConfigProvider>
    </StoreContext.Provider>
  )
}

export default AxApp
