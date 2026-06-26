import { Layout } from 'antd'
import { HOME_FRAME } from './home-frame.ts'

// Intentionally empty rail — the landing page has nothing to dock. Sized to the bottom-bar height so it
// reads as a thin frame gutter rather than a navigation rail.
export const HomeLayoutRight = () => {
  return <Layout.Sider width={HOME_FRAME} />
}
