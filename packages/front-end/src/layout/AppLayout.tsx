import { Layout, theme } from 'antd'
import { Outlet } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { AppLayoutTop } from './AppLayoutTop.tsx'
import { AppLayoutBottom } from './AppLayoutBottom.tsx'
import { AppLayoutLeft } from './AppLayoutLeft.tsx'
import { AppLayoutRight } from './AppLayoutRight.tsx'

export const AppLayout = observer(() => {
  const { token } = theme.useToken()
  console.log('token', token)
  return (
    <Layout className="ax-layout">
      <AppLayoutTop />
      <Layout className="ax-layout_middle">
        <AppLayoutLeft />
        <Layout.Content className="ax-layout_main">
          <Outlet />
        </Layout.Content>
        <AppLayoutRight />
      </Layout>
      <AppLayoutBottom />
    </Layout>
  )
})
