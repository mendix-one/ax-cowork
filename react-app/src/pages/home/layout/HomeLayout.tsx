import { Layout } from 'antd'
import { observer } from 'mobx-react-lite'
import { HomeLayoutTop } from './HomeLayoutTop.tsx'
import { HomeLayoutLeft } from './HomeLayoutLeft.tsx'
import { HomeLayoutRight } from './HomeLayoutRight.tsx'
import { HomeLayoutBottom } from './HomeLayoutBottom.tsx'
import { HomeLineSelector } from '@/pages/home/views/HomeLineSelector.tsx'

// Home landing shell — the same top / left / right / bottom frame the EPS and MPS workspaces use. The
// left/right rails are intentionally empty (the landing page has nothing to dock); the only docked region
// is the production-line selector in the main content.
export const HomeLayout = observer(() => {
  return (
    <Layout className="ax-layout">
      <HomeLayoutTop />
      <Layout className="ax-layout_middle">
        <HomeLayoutLeft />
        <Layout.Content className="ax-layout_main" style={{ overflow: 'auto' }}>
          <HomeLineSelector />
        </Layout.Content>
        <HomeLayoutRight />
      </Layout>
      <HomeLayoutBottom />
    </Layout>
  )
})
