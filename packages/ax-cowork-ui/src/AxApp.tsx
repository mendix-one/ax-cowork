import { useEffect } from 'react'
import { ApolloProvider } from '@apollo/client/react'
import { App as AntApp, ConfigProvider } from 'antd'
import { observer } from 'mobx-react-lite'
import { RouterProvider } from 'react-router-dom'
import { apolloClient } from '@/acore/apollo'
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
  })

  useEffect(() => {
    if (auth.isInterrupted) {
      window.location.href = '/system-error'
    }
  }, [auth.isInterrupted])

  if (!auth.isInitialized) {
    return (
      <div className="ax-loading-container">
        <div className="ax-app-loader">&nbsp;</div>
      </div>
    )
  }

  return (
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
        <RouterProvider router={index} />
      </AntApp>
    </ConfigProvider>
  )
})

function AxApp() {
  return (
    <ApolloProvider client={apolloClient}>
      <StoreContext.Provider value={rootStore}>
        <AppShell />
      </StoreContext.Provider>
    </ApolloProvider>
  )
}

export default AxApp
