import type { ReactElement, ReactNode } from 'react'
import { Flex, Layout } from 'antd'

// Top bar (Layout.Header). Mirrors MpsLayoutTop: a left cluster (logo, menu, line, plan version) and a
// right cluster (split view, notify, user, setting). Each region is a Mendix `widgets` drop zone.
export interface AxSimulationTopProps {
  logo?: ReactNode
  topMenu?: ReactNode
  line?: ReactNode
  planVersion?: ReactNode
  splitView?: ReactNode
  notify?: ReactNode
  user?: ReactNode
  setting?: ReactNode
}

export function AxSimulationTop(props: AxSimulationTopProps): ReactElement {
  return (
    <Layout.Header className="ax-sim_top">
      <Flex align="center" justify="space-between" gap="small" style={{ height: '100%' }}>
        <Flex align="center" justify="start" gap="middle" className="ax-sim_top_left">
          <div className="ax-sim_top_logo">{props.logo}</div>
          <Flex align="center" gap="small">
            <div className="ax-sim_top_slot">{props.topMenu}</div>
            <div className="ax-sim_top_slot">{props.line}</div>
            <div className="ax-sim_top_slot">{props.planVersion}</div>
          </Flex>
        </Flex>
        <Flex align="center" justify="end" gap="small" className="ax-sim_top_right">
          <div className="ax-sim_top_slot">{props.splitView}</div>
          <div className="ax-sim_top_slot">{props.notify}</div>
          <div className="ax-sim_top_slot">{props.user}</div>
          <div className="ax-sim_top_slot">{props.setting}</div>
        </Flex>
      </Flex>
    </Layout.Header>
  )
}
