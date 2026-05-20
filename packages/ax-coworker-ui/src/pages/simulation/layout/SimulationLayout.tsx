import { type CSSProperties, type ComponentType, type ReactNode } from 'react'
import { ConfigProvider, Layout, Splitter } from 'antd'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../store/simulation.context'
import type { MainPanelId, PanelId, SubPanelId } from '../store/simulation.store'

import { SimulationLayoutTop } from './SimulationLayoutTop.tsx'
import { SimulationLayoutLeft } from './SimulationLayoutLeft.tsx'
import { SimulationLayoutRight } from './SimulationLayoutRight.tsx'
import { SimulationLayoutBottom } from './SimulationLayoutBottom.tsx'

import type { MainPanelControls, SubPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

import { AIAssistantPanel } from '@/agent/AIAssistantPanel.tsx'
import { WorkerTasksPanel } from '@/worker/WorkerTasksPanel.tsx'
import { SplitRightView } from '@/pages/simulation/views/SplitRightView.tsx'
import { SimulationAnalysisPanel } from '@/pages/simulation/panels/analysis/SimulationAnalysisPanel.tsx'
import { SimulationDatasetPanel } from '@/pages/simulation/panels/dataset/SimulationDatasetPanel.tsx'
import { SimulationFactorPanel } from '@/pages/simulation/panels/factor/SimulationFactorPanel.tsx'
import { SimulationGanttPanel } from '@/pages/simulation/panels/gantt/SimulationGanttPanel.tsx'
import { SimulationIntegrationPanel } from '@/pages/simulation/panels/integration/SimulationIntegrationPanel.tsx'
import { SimulationProjectPanel } from '@/pages/simulation/panels/project/SimulationProjectPanel.tsx'
import { SimulationSchemaPanel } from '@/pages/simulation/panels/schema/SimulationSchemaPanel.tsx'
import { SimulationSettingPanel } from '@/pages/simulation/panels/setting/SimulationSettingPanel.tsx'
import { SimulationStandardPanel } from '@/pages/simulation/panels/standard/SimulationStandardPanel.tsx'
import { SimulationTuningPanel } from '@/pages/simulation/panels/tuning/SimulationTuningPanel.tsx'

type PanelRegion =
  | { kind: 'panel'; id: PanelId; type: 'main'; render: (controls: MainPanelControls) => ReactNode }
  | { kind: 'panel'; id: PanelId; type: 'sub'; render: (controls: SubPanelControls) => ReactNode }

type SplitterChild = {
  region: Region
  defaultSize: string
  min: string
  max: string
}

type SplitterRegion = {
  kind: 'splitter'
  vertical?: boolean
  splitterKey?: string
  children: [SplitterChild, SplitterChild]
}

type Region = PanelRegion | SplitterRegion

const MAIN_PANELS: Record<MainPanelId, ComponentType<MainPanelControls>> = {
  gantt: SimulationGanttPanel,
  analysis: SimulationAnalysisPanel,
  project: SimulationProjectPanel,
  dataset: SimulationDatasetPanel,
  tuning: SimulationTuningPanel,
  factor: SimulationFactorPanel,
  standard: SimulationStandardPanel,
  setting: SimulationSettingPanel,
  integration: SimulationIntegrationPanel,
  schema: SimulationSchemaPanel,
}

const SUB_PANELS: Record<SubPanelId, ComponentType<SubPanelControls>> = {
  splitView: SplitRightView,
  aiAssistant: AIAssistantPanel,
  progress: WorkerTasksPanel,
}

const useStyles = createStyles(({ token }) => ({
  dragger: {
    '&::before': {
      background: `${token.colorBgLayout} !important`,
    },
    '&:hover::before': {
      background: `${token.colorBgLayout} !important`,
    },
  },
  draggerActive: {
    '&::before': {
      background: `${token.colorBgLayout} !important`,
    },
  },
  root: {
    height: '100%',
    width: '100%',
  },
  mainSlot: {
    height: '100%',
    width: '100%',
  },
  subSlot: {
    height: '100%',
    width: '100%',
  },
}))

const MainPanelStack = observer(({ controls, slotClassName }: { controls: MainPanelControls; slotClassName: string }) => {
  const simulation = useSimulationContext()
  const active = simulation.activeMainPanel
  return (
    <>
      {(Object.keys(MAIN_PANELS) as MainPanelId[]).map((id) => {
        const Panel = MAIN_PANELS[id]
        const isActive = id === active
        return (
          <div key={id} className={slotClassName} style={{ display: isActive ? 'block' : 'none' }}>
            <Panel {...controls} />
          </div>
        )
      })}
    </>
  )
})

const SubPanelStack = observer(({ controls, slotClassName }: { controls: SubPanelControls; slotClassName: string }) => {
  const simulation = useSimulationContext()
  const active = simulation.activeSubPanel
  return (
    <>
      {(Object.keys(SUB_PANELS) as SubPanelId[]).map((id) => {
        const Panel = SUB_PANELS[id]
        const isActive = id === active
        return (
          <div key={id} className={slotClassName} style={{ display: isActive ? 'block' : 'none' }}>
            <Panel {...controls} />
          </div>
        )
      })}
    </>
  )
})

export const SimulationLayout = observer(() => {
  const { styles } = useStyles()
  const simulation = useSimulationContext()

  const mainControlsFor = (id: PanelId): MainPanelControls => ({
    maximized: simulation.isMaximized(id),
    onMaximize: () => simulation.maximize(id),
    onRestore: () => simulation.restore(id),
  })

  const subControlsFor = (id: PanelId): SubPanelControls => ({
    onClose: () => simulation.hide(id),
  })

  const renderPanelRegion = (region: PanelRegion): ReactNode =>
    region.type === 'main' ? region.render(mainControlsFor(region.id)) : region.render(subControlsFor(region.id))

  const renderRegion = (region: Region): ReactNode | null => {
    if (region.kind === 'panel') {
      if (simulation.isHidden(region.id)) return null
      return renderPanelRegion(region)
    }

    const [first, second] = region.children
    const firstNode = renderRegion(first.region)
    const secondNode = renderRegion(second.region)

    if (!firstNode && !secondNode) return null
    if (!firstNode) return secondNode
    if (!secondNode) return firstNode

    const vertical = region.vertical === true
    const firstPad: CSSProperties = vertical ? { paddingBottom: 2 } : { paddingRight: 2 }
    const secondPad: CSSProperties = vertical ? { paddingTop: 2 } : { paddingLeft: 2 }

    return (
      <Splitter
        key={region.splitterKey}
        vertical={vertical}
        draggerIcon={null}
        style={{ height: '100%', width: '100%' }}
        classNames={{ dragger: { default: styles.dragger, active: styles.draggerActive } }}
      >
        <Splitter.Panel style={{ padding: 0, ...firstPad }} defaultSize={first.defaultSize} min={first.min} max={first.max}>
          {firstNode}
        </Splitter.Panel>
        <Splitter.Panel style={{ padding: 0, ...secondPad }} defaultSize={second.defaultSize} min={second.min} max={second.max}>
          {secondNode}
        </Splitter.Panel>
      </Splitter>
    )
  }

  const renderMain = (controls: MainPanelControls) => <MainPanelStack controls={controls} slotClassName={styles.mainSlot} />
  const renderSub = (controls: SubPanelControls) => <SubPanelStack controls={controls} slotClassName={styles.subSlot} />

  const isSplitMode = simulation.activeSubPanel === 'splitView'
  const layout: Region = {
    kind: 'splitter',
    splitterKey: isSplitMode ? 'split' : 'normal',
    children: [
      {
        region: { kind: 'panel', id: 'regionLeft', type: 'main', render: renderMain },
        defaultSize: isSplitMode ? '50%' : '75%',
        min: '20%',
        max: '90%',
      },
      {
        region: { kind: 'panel', id: 'regionRight', type: 'sub', render: renderSub },
        defaultSize: isSplitMode ? '50%' : '25%',
        min: '10%',
        max: '80%',
      },
    ],
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Splitter: { splitBarSize: 4, splitTriggerSize: 16 },
        },
      }}
    >
      <Layout className="ax-layout">
        <SimulationLayoutTop />
        <Layout className="ax-layout_middle">
          <SimulationLayoutLeft />
          <Layout.Content className="ax-layout_main">
            <div className={styles.root}>{renderRegion(layout)}</div>
          </Layout.Content>
          <SimulationLayoutRight />
        </Layout>
        <SimulationLayoutBottom />
      </Layout>
    </ConfigProvider>
  )
})
