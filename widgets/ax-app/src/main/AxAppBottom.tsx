import type { ReactElement } from 'react'
import { Layout } from 'antd'

// Bottom bar (Layout.Footer). A single `widgets` drop zone for status / footer content.
export function AxAppBottom(): ReactElement {
  return <Layout.Footer className="ax-sim_bottom">&nbsp;</Layout.Footer>
}
