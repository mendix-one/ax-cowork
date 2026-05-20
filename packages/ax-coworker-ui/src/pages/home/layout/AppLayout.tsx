import { Suspense } from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { PageFallback } from '@/acore/router/PageFallback.tsx'
import { AppLayoutTop } from './AppLayoutTop.tsx'
import { AppLayoutBottom } from './AppLayoutBottom.tsx'
import { AppLayoutLeft } from './AppLayoutLeft.tsx'
import { AppLayoutRight } from './AppLayoutRight.tsx'

export const AppLayout = observer(() => {
  return (
    <Layout className="ax-layout">
      <AppLayoutTop />
      <Layout className="ax-layout_middle">
        <AppLayoutLeft />
        <Layout.Content className="ax-layout_main">
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </Layout.Content>
        <AppLayoutRight />
      </Layout>
      <AppLayoutBottom />
    </Layout>
  )
})
