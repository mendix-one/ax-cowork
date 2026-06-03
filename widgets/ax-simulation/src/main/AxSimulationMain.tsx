import type { ReactElement } from 'react'
import { useCallback, useState } from 'react'
import cn from 'classnames'
import { Layout, Splitter } from 'antd'
import { observer } from 'mobx-react-lite'
import { useAxSimulationStore } from '../stores/context'
import { LEFT_MENU, RIGHT_MENU } from './menus'
import { AxSimulationTop } from './AxSimulationTop'
import { AxSimulationLeft } from './AxSimulationLeft'
import { AxSimulationRight } from './AxSimulationRight'
import { AxSimulationBottom } from './AxSimulationBottom'
import { ViewSlot } from './parts'

// Full-page layout shell — a self-contained port of react-app's MpsLayout. AntD Layout for the
// top / left / right / bottom frame; an AntD Splitter for the resizable main (left view | right view).
// Holds no business logic and touches no widget props: every drop zone, label, and action is read from
// the store (kept in sync with Mendix props by AxSimulationSync). The store decides which left/right
// view is visible; every view stays mounted (CSS fade on switch), so neither the Splitter nor its
// children remount when the active view changes.
export const AxSimulationMain = observer((): ReactElement => {
  const store = useAxSimulationStore()

  // Remember the right region's width (px) so closing → reopening restores the user's drag, mirroring
  // MpsLayout's persisted right pane. Controlled size on the right panel only; the left panel fills.
  const [rightSize, setRightSize] = useState<number | string>('32%')
  const onResize = useCallback(
    (sizes: number[]) => {
      if (store.rightOpen && sizes.length > 1) setRightSize(sizes[1])
    },
    [store],
  )

  return (
    <Layout className={cn('ax-sim', store.className)} style={store.style} tabIndex={store.tabIndex}>
      <AxSimulationTop />

      <Layout className="ax-sim_middle">
        <AxSimulationLeft />
        <Layout.Content className="ax-sim_main">
          <Splitter
            className={cn('ax-sim_splitter', { 'ax-maximize-main': !store.rightOpen })}
            onResize={onResize}
            classNames={{ dragger: { default: 'ax-sim_splitter_dragger', active: 'ax-sim_splitter_dragger_active' } }}
          >
            <Splitter.Panel min="25%" className="ax-sim_splitter_panel ax-sim_splitter_panel_left" style={{ paddingRight: `${store.rightOpen ? '3px' : '0'}` }}>
              <div className="ax-sim_view ax-sim_view_left">
                {LEFT_MENU.map((item) => (
                  <ViewSlot key={item.id} active={store.activeLeft === item.id}>
                    {store.leftSlots[item.id]}
                  </ViewSlot>
                ))}
              </div>
            </Splitter.Panel>
            <Splitter.Panel
              className="ax-sim_splitter_panel ax-sim_splitter_panel_right"
              size={store.rightOpen ? rightSize : 0}
              min={store.rightOpen ? 480 : 0}
              resizable={store.rightOpen}
              style={{ paddingLeft: store.rightOpen ? '3px' : '0' }}
            >
              <div className="ax-sim_view ax-sim_view_right">
                {RIGHT_MENU.map((item) => (
                  <ViewSlot key={item.id} active={store.rightOpen && store.activeRight === item.id}>
                    {store.rightSlots[item.id]}
                  </ViewSlot>
                ))}
              </div>
            </Splitter.Panel>
          </Splitter>
        </Layout.Content>
        <AxSimulationRight />
      </Layout>
      <AxSimulationBottom />
    </Layout>
  )
})
