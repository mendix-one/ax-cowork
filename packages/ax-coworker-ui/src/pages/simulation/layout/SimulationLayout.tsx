import { type CSSProperties, type ComponentType, type ReactNode } from 'react'
import { ConfigProvider, Layout, Splitter } from 'antd'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import type { MainPanelControls, SubPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { AIAssistantPanel } from '@/agent/AIAssistantPanel.tsx'
import { WorkerTasksPanel } from '@/worker/WorkerTasksPanel.tsx'
import { simulationStore, type MainPanelId, type PanelId } from '../store/simulation.store.ts'
import { SimulationAnalysisPanel } from '../views/analysis/SimulationAnalysisPanel.tsx'
import { SimulationDatasetPanel } from '../views/dataset/SimulationDatasetPanel.tsx'
import { SimulationFactorPanel } from '../views/factor/SimulationFactorPanel.tsx'
import { SimulationGanttPanel } from '../views/gantt/SimulationGanttPanel.tsx'
import { SimulationIntegrationPanel } from '../views/integration/SimulationIntegrationPanel.tsx'
import { SimulationProjectPanel } from '../views/project/SimulationProjectPanel.tsx'
import { SimulationSchemaPanel } from '../views/schema/SimulationSchemaPanel.tsx'
import { SimulationSettingPanel } from '../views/setting/SimulationSettingPanel.tsx'
import { SimulationStandardPanel } from '../views/standard/SimulationStandardPanel.tsx'
import { SimulationTuningPanel } from '../views/tuning/SimulationTuningPanel.tsx'
import { SimulationLayoutTop } from './SimulationLayoutTop.tsx'
import { SimulationLayoutBottom } from './SimulationLayoutBottom.tsx'
import { SimulationLayoutLeft } from './SimulationLayoutLeft.tsx'
import { SimulationLayoutRight } from './SimulationLayoutRight.tsx'

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
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  maximizedOverlay: {
    position: 'absolute',
    inset: 0,
    background: token.colorBgLayout,
    zIndex: 10,
  },
  mainSlot: {
    height: '100%',
    width: '100%',
  },
}))

function findPanelRegion(region: Region, id: PanelId): PanelRegion | null {
  if (region.kind === 'panel') return region.id === id ? region : null
  for (const child of region.children) {
    const found = findPanelRegion(child.region, id)
    if (found) return found
  }
  return null
}

const MainPanelStack = observer(({ controls, slotClassName }: { controls: MainPanelControls; slotClassName: string }) => {
  const active = simulationStore.activeMainPanel
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

export const SimulationLayout = observer(() => {
  const { styles } = useStyles()

  const mainControlsFor = (id: PanelId): MainPanelControls => ({
    maximized: simulationStore.isMaximized(id),
    onMaximize: () => simulationStore.maximize(id),
    onRestore: () => simulationStore.restore(id),
  })

  const subControlsFor = (id: PanelId): SubPanelControls => ({
    onClose: () => simulationStore.hide(id),
  })

  const renderPanelRegion = (region: PanelRegion): ReactNode =>
    region.type === 'main' ? region.render(mainControlsFor(region.id)) : region.render(subControlsFor(region.id))

  const renderRegion = (region: Region): ReactNode | null => {
    if (region.kind === 'panel') {
      if (simulationStore.isHidden(region.id)) return null
      if (simulationStore.isMaximized(region.id)) return null
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

  const layout: Region = {
    kind: 'splitter',
    children: [
      {
        region: { kind: 'panel', id: 'regionLeft', type: 'main', render: renderMain },
        defaultSize: '70%',
        min: '20%',
        max: '90%',
      },
      {
        region: {
          kind: 'splitter',
          vertical: true,
          children: [
            {
              region: { kind: 'panel', id: 'regionRightTop', type: 'sub', render: (controls) => <AIAssistantPanel {...controls} /> },
              defaultSize: '50%',
              min: '15%',
              max: '85%',
            },
            {
              region: { kind: 'panel', id: 'regionRightBottom', type: 'sub', render: (controls) => <WorkerTasksPanel {...controls} /> },
              defaultSize: '50%',
              min: '15%',
              max: '85%',
            },
          ],
        },
        defaultSize: '30%',
        min: '10%',
        max: '80%',
      },
    ],
  }

  const maximizedRegion = simulationStore.maximizedId ? findPanelRegion(layout, simulationStore.maximizedId) : null

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
            <div className={styles.root}>
              {renderRegion(layout)}
              {maximizedRegion && <div className={styles.maximizedOverlay}>{renderPanelRegion(maximizedRegion)}</div>}
            </div>
          </Layout.Content>
          <SimulationLayoutRight />
        </Layout>
        <SimulationLayoutBottom />
      </Layout>
    </ConfigProvider>
  )
})
