import type { ReactElement } from 'react'
import { Flex, Layout, Space } from 'antd'
import { observer } from 'mobx-react-lite'
import { Icon } from 'mendix/components/web/Icon'
import { useAxAppStore } from '../stores/context'
import { AxMenuBtn } from './views/AxMenuBtn'

// Right icon rail (Layout.Sider). One button per right panel, built from the store's rightPanels list
// (kept in sync with the prpDsRightPanels prop by AxAppSync). Clicking toggles the right region: opens
// it on the clicked panel, or closes it when the active panel is clicked again — all by index.
export const AxAppRight = observer((): ReactElement => {
  const store = useAxAppStore()
  return (
    <Layout.Sider width="2.65rem" className="ax-sim_rail ax-sim_rail_right" style={{ padding: '0.15rem' }}>
      <Flex vertical align="center" justify="space-between" className="ax-sim_rail_inner">
        <Flex vertical align="center" justify="start">
          <Space vertical>
            {store.rightPanels.map((panel, i) => (
              <AxMenuBtn
                key={i}
                title={panel.caption}
                placement="left"
                active={store.rightOpen && store.activeRight === i}
                onClick={() => store.toggleRight(i)}
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
