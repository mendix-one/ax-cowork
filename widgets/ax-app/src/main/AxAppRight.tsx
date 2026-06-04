import type { ReactElement } from 'react'
import { Fragment } from 'react'
import { Divider, Flex, Layout, Space } from 'antd'
import { observer } from 'mobx-react-lite'
import { Icon } from 'mendix/components/web/Icon'
import { useAxAppStore } from '../stores/context'
import { AxMenuBtn } from './views/AxMenuBtn'

// Right icon rail (Layout.Sider). One button per right panel, built from the store's rightGroups (the
// rightPanels list grouped by panel-no, kept in sync with the prpDsRightPanels prop by AxAppSync).
// Panels sharing a panel-no form a group; groups are separated by a divider. Clicking toggles the right
// region: opens it on the clicked panel, or closes it when the active panel is clicked again — by index.
export const AxAppRight = observer((): ReactElement => {
  const store = useAxAppStore()
  return (
    <Layout.Sider width="2.65rem" className="ax-sim_rail ax-sim_rail_right" style={{ padding: '0.15rem' }}>
      <Flex vertical align="center" justify="space-between" className="ax-sim_rail_inner">
        <Flex vertical align="center" justify="start">
          {store.rightGroups.map((group, gi) => (
            <Fragment key={group.no}>
              {gi > 0 && <Divider className="ax-menu-divider" />}
              <Space vertical>
                {group.items.map(({ panel, index }) => (
                  <AxMenuBtn
                    key={index}
                    title={panel.caption}
                    placement="left"
                    active={store.rightOpen && store.activeRight === index}
                    onClick={() => store.toggleRight(index)}
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
