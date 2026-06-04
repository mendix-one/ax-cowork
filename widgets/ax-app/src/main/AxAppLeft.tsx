import type { ReactElement } from 'react'
import { Flex, Layout, Space } from 'antd'
import { observer } from 'mobx-react-lite'
import { Icon } from 'mendix/components/web/Icon'
import { useAxAppStore } from '../stores/context'
import { AxMenuBtn } from './views/AxMenuBtn'

// Left icon rail (Layout.Sider). Fixed-width vertical menu; one button per left panel, built from the
// store's leftPanels list (kept in sync with the prpDsLeftPanels prop by AxAppSync). Clicking selects
// that panel's view by index — the rail and the content stack in AxAppMain stay in sync off store state.
export const AxAppLeft = observer((): ReactElement => {
  const store = useAxAppStore()
  return (
    <Layout.Sider width="2.65rem" className="ax-sim_rail ax-sim_rail_left" style={{ padding: '0.15rem' }}>
      <Flex vertical align="center" justify="space-between" className="ax-sim_rail_inner">
        <Flex vertical align="center" justify="start">
          <Space vertical>
            {store.leftPanels.map((panel, i) => (
              <AxMenuBtn
                key={i}
                title={panel.caption}
                placement="right"
                active={store.activeLeft === i}
                onClick={() => store.selectLeft(i)}
              >
                <Icon icon={panel.icon} altText={panel.caption} />
              </AxMenuBtn>
            ))}
          </Space>
        </Flex>
        <Flex vertical align="center" justify="end">
          <Space>&nbsp;</Space>
        </Flex>
      </Flex>
    </Layout.Sider>
  )
})
