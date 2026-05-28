import { type ComponentType, type ReactNode } from 'react'
import { Layout } from 'antd'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../store/mps.context'
import type { MainPanelId, SubPanelId } from '../store/mps.store'

import { MpsLayoutTop } from './MpsLayoutTop.tsx'
import { MpsLayoutLeft } from './MpsLayoutLeft.tsx'
import { MpsLayoutRight } from './MpsLayoutRight.tsx'
import { MpsLayoutBottom } from './MpsLayoutBottom.tsx'

import { AxSplitPane } from '@/shared/split-pane/AxSplitPane.tsx'
import type { MainPanelControls, SubPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

import { MpsGanttPanel } from '@/pages/mps/panels/simulation/MpsGanttPanel.tsx'
import { MpsAnalysisPanel } from '@/pages/mps/panels/analysis/MpsAnalysisPanel.tsx'
import { MpsProductionOrderPanel } from '@/pages/mps/panels/orders/MpsProductionOrderPanel.tsx'
import { MpsProductionProcessPanel } from '@/pages/mps/panels/processes/MpsProductionProcessPanel.tsx'
import { MpsShopFloorPanel } from '@/pages/mps/panels/capacity/MpsShopFloorPanel.tsx'
import { MpsProcessTuningPanel } from '@/pages/mps/panels/process-tuning/MpsProcessTuningPanel.tsx'
import { MpsCapacityTuningPanel } from '@/pages/mps/panels/capacity-tuning/MpsCapacityTuningPanel.tsx'
import { MpsDataIntegrationPanel } from '@/pages/mps/panels/integration/MpsDataIntegrationPanel.tsx'

import { MpsComparePanel } from '@/pages/mps/panels/compare/MpsComparePanel.tsx'
import { MpsAIChatPanel } from '@/pages/mps/panels/ai-chat/MpsAIChatPanel.tsx'
import { MpsBackgroundPanel } from '@/pages/mps/panels/background/MpsBackgroundPanel.tsx'
import { MpsHistoryPanel } from '@/pages/mps/panels/history/MpsHistoryPanel.tsx'
import { MpsRecommendationsPanel } from '@/pages/mps/panels/recommendations/MpsRecommendationsPanel.tsx'

const MAIN_PANELS: Record<MainPanelId, ComponentType<MainPanelControls>> = {
  simulation: MpsGanttPanel,
  analysis: MpsAnalysisPanel,
  orders: MpsProductionOrderPanel,
  processes: MpsProductionProcessPanel,
  capacity: MpsShopFloorPanel,
  processTuning: MpsProcessTuningPanel,
  capacityTuning: MpsCapacityTuningPanel,
  integration: MpsDataIntegrationPanel,
}

const SUB_PANELS: Record<SubPanelId, ComponentType<SubPanelControls>> = {
  compare: MpsComparePanel,
  aiChat: MpsAIChatPanel,
  background: MpsBackgroundPanel,
  history: MpsHistoryPanel,
  recommendations: MpsRecommendationsPanel,
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
  const simulation = useMpsContext()
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
  const simulation = useMpsContext()
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

export const MpsLayout = observer(() => {
  const { styles } = useStyles()
  const simulation = useMpsContext()

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
      <MpsLayoutTop />
      <Layout className="ax-layout_middle">
        <MpsLayoutLeft />
        <Layout.Content className="ax-layout_main">
          <div className={styles.root}>
            <AxSplitPane first={mainNode} second={subNode} secondVisible={subVisible} defaultRightPercent={rightDefault} minRightPercent={12} maxRightPercent={80} />
          </div>
        </Layout.Content>
        <MpsLayoutRight />
      </Layout>
      <MpsLayoutBottom />
    </Layout>
  )
})
