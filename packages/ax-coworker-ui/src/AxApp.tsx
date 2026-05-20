import { App as AntApp, ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'
import { StoreContext } from '@/acore/store/store.context'
import { rootStore } from '@/acore/store/root.store'
import { index } from '@/acore/router'
import { axTheme } from '@/acore/theme/theme'

function AxApp() {
  return (
    <StoreContext.Provider value={rootStore}>
      <ConfigProvider theme={axTheme}>
        <AntApp>
          <RouterProvider router={index} />
        </AntApp>
      </ConfigProvider>
    </StoreContext.Provider>
  )
}

export default AxApp
