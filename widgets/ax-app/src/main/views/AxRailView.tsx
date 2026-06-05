import type { ReactElement } from 'react'
import { Fragment } from 'react'
import cn from 'classnames'
import { Divider, Flex, Layout, Space } from 'antd'
import { Icon } from 'mendix/components/web/Icon'
import type { AxRailGroup } from '../../stores/AxAppStore'
import { AxMenuBtn } from './AxMenuBtn'

// Shared icon rail (Layout.Sider) for both sides. Renders the store's normalized rail groups (panels or
// action menus, decided per mode) — one button per item, groups separated by a divider. When the rail has
// no items it collapses to a thin 0.5rem gutter (w-2) so the shell stays balanced. `side` only drives the
// tooltip placement and the side class; all behaviour comes from the rail buttons themselves.
export function AxRailView({ side, groups }: { side: 'left' | 'right'; groups: AxRailGroup[] }): ReactElement {
  const hasItems = groups.some((group) => group.buttons.length > 0)
  const sideClass = side === 'left' ? 'ax-sim_rail_left' : 'ax-sim_rail_right'

  if (!hasItems) {
    return <Layout.Sider width="0.5rem" className={cn('ax-sim_rail ax-sim_rail_empty', sideClass)} />
  }

  return (
    <Layout.Sider width="2.65rem" className={cn('ax-sim_rail', sideClass)} style={{ padding: '0.15rem' }}>
      <Flex vertical align="center" justify="space-between" className="ax-sim_rail_inner">
        <Flex vertical align="center" justify="start">
          {groups.map((group, gi) => (
            <Fragment key={group.no}>
              {gi > 0 && <Divider className="ax-menu-divider" />}
              <Space vertical>
                {group.buttons.map((button) => (
                  <AxMenuBtn
                    key={button.key}
                    title={button.caption}
                    placement={side === 'left' ? 'right' : 'left'}
                    active={button.active}
                    onClick={button.onClick}
                  >
                    <Icon icon={button.icon} altText={button.caption} />
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
}
