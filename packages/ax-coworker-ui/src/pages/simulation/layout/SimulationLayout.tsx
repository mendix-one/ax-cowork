import { type CSSProperties, type ReactNode } from 'react'
import { ConfigProvider, Layout, Splitter } from 'antd'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import type { PanelControls } from '@/shared/simple-panel/AxSimplePanel.tsx'
import { useStore } from '@/acore/store/store.context'
import type { PanelId } from '@/acore/store/simulation.store'
import { AIAssistantPanel } from '@/agent/AIAssistantPanel.tsx'
import { WorkerTasksPanel } from '@/worker/WorkerTasksPanel.tsx'
import { SimulationGanttPanel } from '../views/gantt/SimulationGanttPanel.tsx'
import { SimulationLayoutTop } from './SimulationLayoutTop.tsx'
import { SimulationLayoutBottom } from './SimulationLayoutBottom.tsx'
import { SimulationLayoutLeft } from './SimulationLayoutLeft.tsx'
import { SimulationLayoutRight } from './SimulationLayoutRight.tsx'

type PanelRegion = {
  kind: 'panel'
  id: PanelId
  render: (controls: PanelControls) => ReactNode
}

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
}))

function findPanelRegion(region: Region, id: PanelId): PanelRegion | null {
  if (region.kind === 'panel') return region.id === id ? region : null
  for (const child of region.children) {
    const found = findPanelRegion(child.region, id)
    if (found) return found
  }
  return null
}

export const SimulationLayout = observer(() => {
  const { styles } = useStyles()
  const { simulation } = useStore()

  const controlsFor = (id: PanelId): PanelControls => ({
    maximized: simulation.isMaximized(id),
    onMaximize: () => simulation.maximize(id),
    onRestore: () => simulation.restore(id),
    onHide: () => simulation.hide(id),
  })

  const renderRegion = (region: Region): ReactNode | null => {
    if (region.kind === 'panel') {
      if (simulation.isHidden(region.id)) return null
      if (simulation.isMaximized(region.id)) return null
      return region.render(controlsFor(region.id))
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

  const layout: Region = {
    kind: 'splitter',
    children: [
      {
        region: { kind: 'panel', id: 'regionLeft', render: (controls) => <SimulationGanttPanel {...controls} /> },
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
              region: { kind: 'panel', id: 'regionRightTop', render: (controls) => <AIAssistantPanel {...controls} /> },
              defaultSize: '50%',
              min: '15%',
              max: '85%',
            },
            {
              region: { kind: 'panel', id: 'regionRightBottom', render: (controls) => <WorkerTasksPanel {...controls} /> },
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

  const maximizedRegion = simulation.maximizedId ? findPanelRegion(layout, simulation.maximizedId) : null

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
              {maximizedRegion && <div className={styles.maximizedOverlay}>{maximizedRegion.render(controlsFor(maximizedRegion.id))}</div>}
            </div>
          </Layout.Content>
          <SimulationLayoutRight />
        </Layout>
        <SimulationLayoutBottom />
      </Layout>
    </ConfigProvider>
  )
})
