import type { ReactElement } from 'react'
import { Fragment } from 'react'
import { Divider, Flex, Layout, Space } from 'antd'
import { observer } from 'mobx-react-lite'
import { Icon } from 'mendix/components/web/Icon'
import { useAxAppStore } from '../stores/context'
import { AxMenuBtn } from './views/AxMenuBtn'

// Left icon rail (Layout.Sider). Fixed-width vertical menu; one button per left panel, built from the
// store's leftGroups (the leftPanels list grouped by panel-no, kept in sync with the prpDsLeftPanels
// prop by AxAppSync). Panels sharing a panel-no form a group; groups are separated by a divider.
// Clicking selects that panel's view by its original index — the rail and the content stack in
// AxAppMain stay in sync off store state.
export const AxAppLeft = observer((): ReactElement => {
  const store = useAxAppStore()
  return (
    <Layout.Sider width="2.65rem" className="ax-sim_rail ax-sim_rail_left" style={{ padding: '0.15rem' }}>
      <Flex vertical align="center" justify="space-between" className="ax-sim_rail_inner">
        <Flex vertical align="center" justify="start">
          {store.leftGroups.map((group, gi) => (
            <Fragment key={group.no}>
              {gi > 0 && <Divider className="ax-menu-divider" />}
              <Space vertical>
                {group.items.map(({ panel, index }) => (
                  <AxMenuBtn
                    key={index}
                    title={panel.caption}
                    placement="right"
                    active={store.activeLeft === index}
                    onClick={() => store.selectLeft(index)}
                  >
                    <Icon icon={panel.icon} altText={panel.caption} />
                  </AxMenuBtn>
                ))}
              </Space>
            </Fragment>
          ))}
        </Flex>
        <Flex vertical align="center" justify="end">
          <Space>&nbsp;</Space>
        </Flex>
      </Flex>
    </Layout.Sider>
  )
})
