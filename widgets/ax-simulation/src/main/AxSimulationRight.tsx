import type { ReactElement } from 'react'
import { Layout } from 'antd'
import { observer } from 'mobx-react-lite'
import { useAxSimulationStore } from '../stores/context'
import { RIGHT_MENU } from './menus'
import { RailButton } from './parts'

// Right icon rail (Layout.Sider). Clicking toggles the right region: opens it on the clicked view, or
// closes it when the active view is clicked again.
export const AxSimulationRight = observer((): ReactElement => {
  const store = useAxSimulationStore()
  return (
    <Layout.Sider width="2.65rem" className="ax-sim_rail ax-sim_rail__right">
      <div className="ax-sim_rail_inner">
        {RIGHT_MENU.map((item) => (
          <RailButton
            key={item.id}
            item={item}
            placement="left"
            active={store.rightOpen && store.activeRight === item.id}
            onClick={() => store.toggleRight(item.id)}
          />
        ))}
      </div>
    </Layout.Sider>
  )
})
