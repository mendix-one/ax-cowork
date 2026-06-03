import type { ReactElement } from 'react'
import { Flex, Layout } from 'antd'
import { observer } from 'mobx-react-lite'
import { useAxSimulationStore } from '../stores/context'
import { LEFT_MENU } from './menus'
import { RailButton } from './parts'

// Left icon rail (Layout.Sider). Fixed-width vertical menu; clicking sets the active left view.
export const AxSimulationLeft = observer((): ReactElement => {
  const store = useAxSimulationStore()
  return (
    <Layout.Sider width="2.65rem" className="ax-sim_rail ax-sim_rail__left">
      <Flex vertical align="center" justify="space-between">
        <Flex vertical align="center" justify="start">
          {LEFT_MENU.map((item) => (
            <RailButton key={item.id} item={item} placement="right" active={store.activeLeft === item.id} onClick={() => store.setActiveLeft(item.id)} />
          ))}
        </Flex>
        <Flex vertical align="center" justify="end">
          {LEFT_MENU.map((item) => (
            <RailButton key={item.id} item={item} placement="right" active={store.activeLeft === item.id} onClick={() => store.setActiveLeft(item.id)} />
          ))}
        </Flex>
      </Flex>
    </Layout.Sider>
  )
})
