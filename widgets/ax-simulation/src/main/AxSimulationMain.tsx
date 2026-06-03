import type { ReactElement, ReactNode } from 'react'
import { useCallback, useState } from 'react'
import cn from 'classnames'
import { Layout, Splitter } from 'antd'
import { observer } from 'mobx-react-lite'
import type { AxSimulationContainerProps } from '../../typings/AxSimulationProps'
import { useAxSimulationStore } from '../stores/context'
import type { LeftPanelId, RightPanelId } from '../stores/AxSimulationStore'
import { LEFT_MENU, RIGHT_MENU } from './menus'
import { AxSimulationTop } from './AxSimulationTop'
import { AxSimulationLeft } from './AxSimulationLeft'
import { AxSimulationRight } from './AxSimulationRight'
import { AxSimulationBottom } from './AxSimulationBottom'
import { ViewSlot } from './parts'

// Full-page layout shell — a self-contained port of react-app's MpsLayout. AntD Layout for the
// top / left / right / bottom frame; an AntD Splitter for the resizable main (left view | right view).
// Holds no business logic: the container maps Mendix `widgets` drop zones to the slots below, and the
// store decides which left/right view is visible. Every view stays mounted (CSS fade on switch), so
// neither the Splitter nor its children remount when the active view changes.
export const AxSimulationMain = observer((props: AxSimulationContainerProps): ReactElement => {
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

  // Map the Mendix drop-zone props onto id-keyed records so the menus drive the content stacks.
  const leftSlots: Record<LeftPanelId, ReactNode> = {
    simulation: props.leftSimulation,
    projects: props.leftProjects,
    analysis: props.leftAnalysis,
    pmData: props.leftPmData,
    tuningLogic: props.leftTuningLogic,
    factorControl: props.leftFactorControl,
    pmStandard: props.leftPmStandard,
    integration: props.leftIntegration,
    setting: props.leftSetting,
  }

  const rightSlots: Record<RightPanelId, ReactNode> = {
    compare: props.rightCompare,
    aiAssistant: props.rightAiAssistant,
    recommendation: props.rightRecommendation,
    history: props.rightHistory,
  }

  return (
    <Layout className={cn('ax-sim', props.class)} style={props.style} tabIndex={props.tabIndex}>
      <AxSimulationTop
        logo={props.logo}
        topMenu={props.topMenu}
        line={props.line}
        planVersion={props.planVersion}
        splitView={props.splitView}
        notify={props.notify}
        user={props.user}
        setting={props.setting}
      />

      <Layout className="ax-sim_middle">
        <AxSimulationLeft />
        <Layout.Content className="ax-sim_main">
          <Splitter
            className="ax-sim_splitter"
            onResize={onResize}
            classNames={{ dragger: { default: 'ax-sim_splitter_dragger', active: 'ax-sim_splitter_dragger_active' } }}
          >
            <Splitter.Panel min="25%" className="ax-sim_splitter_panel ax-sim_splitter_panel_left">
              <div className="ax-sim_view ax-sim_view_left">
                {LEFT_MENU.map((item) => (
                  <ViewSlot key={item.id} active={store.activeLeft === item.id}>
                    {leftSlots[item.id]}
                  </ViewSlot>
                ))}
              </div>
            </Splitter.Panel>
            <Splitter.Panel
              className="ax-sim_splitter_panel ax-sim_splitter_panel_right"
              size={store.rightOpen ? rightSize : 0}
              min={store.rightOpen ? 240 : 0}
              resizable={store.rightOpen}
            >
              <div className="ax-sim_view ax-sim_view_right">
                {RIGHT_MENU.map((item) => (
                  <ViewSlot key={item.id} active={store.rightOpen && store.activeRight === item.id}>
                    {rightSlots[item.id]}
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
