import { type ComponentType, type ReactNode } from 'react'
import { Layout } from 'antd'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../stores/eps.context'
import type { MainPanelId, SubPanelId } from '../stores/eps.store'

import { EpsLayoutTop } from './EpsLayoutTop.tsx'
import { EpsLayoutLeft } from './EpsLayoutLeft.tsx'
import { EpsLayoutRight } from './EpsLayoutRight.tsx'
import { EpsLayoutBottom } from './EpsLayoutBottom.tsx'

import { AxSplitPane } from '@/shared/split-pane/AxSplitPane.tsx'
import type { MainPanelControls, SubPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

import { EpsSimulationPanel } from '@/pages/eps/panels/simulation/EpsSimulationPanel.tsx'
import { EpsAnalysisPanel } from '@/pages/eps/panels/analysis/EpsAnalysisPanel.tsx'
import { EpsOrderPanel } from '@/pages/eps/panels/orders/EpsOrderPanel.tsx'
import { EpsProcessPanel } from '@/pages/eps/panels/processes/EpsProcessPanel.tsx'
import { EpsCapacityPanel } from '@/pages/eps/panels/capacity/EpsCapacityPanel.tsx'
import { EpsProcessTuningPanel } from '@/pages/eps/panels/process-tuning/EpsProcessTuningPanel.tsx'
import { EpsCapacityTuningPanel } from '@/pages/eps/panels/capacity-tuning/EpsCapacityTuningPanel.tsx'
import { EpsIntegrationPanel } from '@/pages/eps/panels/integration/EpsIntegrationPanel.tsx'

import { EpsComparePanel } from '@/pages/eps/panels/compare/EpsComparePanel.tsx'
import { EpsAIChatPanel } from '@/pages/eps/panels/ai-chat/EpsAIChatPanel.tsx'
import { EpsBackgroundPanel } from '@/pages/eps/panels/background/EpsBackgroundPanel.tsx'
import { EpsHistoryPanel } from '@/pages/eps/panels/history/EpsHistoryPanel.tsx'
import { EpsRecommendationsPanel } from '@/pages/eps/panels/recommendations/EpsRecommendationsPanel.tsx'

const MAIN_PANELS: Record<MainPanelId, ComponentType<MainPanelControls>> = {
  simulation: EpsSimulationPanel,
  analysis: EpsAnalysisPanel,
  orders: EpsOrderPanel,
  processes: EpsProcessPanel,
  capacity: EpsCapacityPanel,
  processTuning: EpsProcessTuningPanel,
  capacityTuning: EpsCapacityTuningPanel,
  integration: EpsIntegrationPanel,
}

const SUB_PANELS: Record<SubPanelId, ComponentType<SubPanelControls>> = {
  compare: EpsComparePanel,
  aiChat: EpsAIChatPanel,
  background: EpsBackgroundPanel,
  history: EpsHistoryPanel,
  recommendations: EpsRecommendationsPanel,
}

const useStyles = createStyles(() => ({
  root: {
    height: '100%',
    width: '100%',
  },
  slot: {
    height: '100%',
    width: '100%',
  },
}))

// Both main panels and sub-panels are mounted simultaneously, only the active one is visible. This means
// switching panels is a CSS-driven fade (no remount, no scroll loss) and the AxSplitPane animates open/close
// without remounting the right-region child either.
const MainPanelStack = observer(({ controls, slotClassName }: { controls: MainPanelControls; slotClassName: string }) => {
  const simulation = useEpsContext()
  const active = simulation.activeMainPanel
  return (
    <>
      {(Object.keys(MAIN_PANELS) as MainPanelId[]).map((id) => {
        const Panel = MAIN_PANELS[id]
        const isActive = id === active
        return (
          <div
            key={id}
            className={`${slotClassName} ax-panel-slot ${isActive ? 'is-active' : 'is-inactive'}`}
            // visibility:hidden (vs display:none) keeps inactive panels measurable, which the Gantt's dhx
            // chart needs for correct sizing on first activation. The CSS handles fade + pointer-events.
          >
            <Panel {...controls} />
          </div>
        )
      })}
    </>
  )
})

const SubPanelStack = observer(({ controls, slotClassName }: { controls: SubPanelControls; slotClassName: string }) => {
  const simulation = useEpsContext()
  const active = simulation.activeSubPanel
  return (
    <>
      {(Object.keys(SUB_PANELS) as SubPanelId[]).map((id) => {
        const Panel = SUB_PANELS[id]
        const isActive = id === active
        return (
          <div key={id} className={`${slotClassName} ax-panel-slot ${isActive ? 'is-active' : 'is-inactive'}`}>
            <Panel {...controls} />
          </div>
        )
      })}
    </>
  )
})

export const EpsLayout = observer(() => {
  const { styles } = useStyles()
  const simulation = useEpsContext()

  const mainControls: MainPanelControls = {
    maximized: simulation.isMaximized('regionLeft'),
    onMaximize: () => simulation.maximize('regionLeft'),
    onRestore: () => simulation.restore('regionLeft'),
  }

  const subControls: SubPanelControls = {
    onClose: () => simulation.hide('regionRight'),
  }

  const isSplitMode = simulation.activeSubPanel === 'compare' && !simulation.isHidden('regionRight')
  const subVisible = !simulation.isHidden('regionRight')
  // Default right-pane width — 50% in compare mode (the user wants a side-by-side), 30% otherwise.
  const rightDefault = isSplitMode ? 50 : 30

  const mainNode: ReactNode = <MainPanelStack controls={mainControls} slotClassName={styles.slot} />
  const subNode: ReactNode = <SubPanelStack controls={subControls} slotClassName={styles.slot} />

  return (
    <Layout className="ax-layout">
      <EpsLayoutTop />
      <Layout className="ax-layout_middle">
        <EpsLayoutLeft />
        <Layout.Content className="ax-layout_main">
          <div className={styles.root}>
            <AxSplitPane
              first={mainNode}
              second={subNode}
              secondVisible={subVisible}
              defaultRightPercent={rightDefault}
              minRightPercent={12}
              maxRightPercent={80}
            />
          </div>
        </Layout.Content>
        <EpsLayoutRight />
      </Layout>
      <EpsLayoutBottom />
    </Layout>
  )
})
