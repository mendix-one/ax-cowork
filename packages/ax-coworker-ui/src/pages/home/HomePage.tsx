import { type CSSProperties, type ReactNode, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { ConfigProvider, Splitter } from 'antd'
import { createStyles } from 'antd-style'
import { AxSimplePanel } from '../../shared/simple-panel/AxSimplePanel.tsx'
import type { MdiIconName } from '../../shared/mui-icon/AxMuiIcon.tsx'
import { TaskInfoView } from './views/TaskInfoView.tsx'
import { ConsoleView } from './views/ConsoleView.tsx'
import { ProgressView } from './views/ProgressView.tsx'
import { GenerativeAIView } from './views/GenerativeAIView.tsx'
import { DocumentView } from './views/DocumentView.tsx'

type PanelId = 'task-info' | 'document' | 'console' | 'generative-ai' | 'progress'
type PanelState = 'normal' | 'minimized' | 'maximized' | 'closed'
type PanelStates = Record<PanelId, PanelState>

// Matches `.ax-simple-panel_header { h-9 }` (36px) in _ax-shared.scss — collapsed minimized panels show only the header.
const PANEL_HEADER_PX = 36

type PanelRegion = {
  kind: 'panel'
  id: PanelId
  icon: MdiIconName
  title: string
  content: ReactNode
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

const initialStates: PanelStates = {
  'task-info': 'closed',
  document: 'normal',
  console: 'closed',
  'generative-ai': 'closed',
  progress: 'closed',
}

export const HomePage = observer(() => {
  const { styles } = useStyles()
  const [panelStates, setPanelStates] = useState<PanelStates>(initialStates)

  const setPanelState = (id: PanelId, next: PanelState) => {
    setPanelStates((prev) => {
      const updated: PanelStates = { ...prev, [id]: next }
      if (next === 'maximized') {
        for (const k of Object.keys(updated) as PanelId[]) {
          if (k !== id && updated[k] === 'maximized') updated[k] = 'normal'
        }
      }
      return updated
    })
  }

  const renderPanel = (region: PanelRegion): ReactNode => {
    const state = panelStates[region.id]
    return (
      <AxSimplePanel
        icon={region.icon}
        title={region.title}
        minimized={state === 'minimized'}
        maximized={state === 'maximized'}
        onMinimize={() => setPanelState(region.id, 'minimized')}
        onMaximize={() => setPanelState(region.id, 'maximized')}
        onRestore={() => setPanelState(region.id, 'normal')}
        onClose={() => setPanelState(region.id, 'closed')}
      >
        {region.content}
      </AxSimplePanel>
    )
  }

  const renderRegion = (region: Region): ReactNode | null => {
    if (region.kind === 'panel') {
      const state = panelStates[region.id]
      if (state === 'closed') return null
      if (state === 'maximized') return null
      return renderPanel(region)
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
    const firstSize = minimizedSize(first.region, panelStates, vertical)
    const secondSize = minimizedSize(second.region, panelStates, vertical)

    return (
      <Splitter
        vertical={vertical}
        draggerIcon={null}
        style={{ height: '100%', width: '100%' }}
        classNames={{ dragger: { default: styles.dragger, active: styles.draggerActive } }}
      >
        <Splitter.Panel
          style={{ padding: 0, ...firstPad }}
          defaultSize={first.defaultSize}
          min={first.min}
          max={first.max}
          {...(firstSize !== undefined ? { size: firstSize } : {})}
        >
          {firstNode}
        </Splitter.Panel>
        <Splitter.Panel
          style={{ padding: 0, ...secondPad }}
          defaultSize={second.defaultSize}
          min={second.min}
          max={second.max}
          {...(secondSize !== undefined ? { size: secondSize } : {})}
        >
          {secondNode}
        </Splitter.Panel>
      </Splitter>
    )
  }

  const layout: Region = {
    kind: 'splitter',
    children: [
      {
        region: {
          kind: 'splitter',
          vertical: true,
          children: [
            {
              region: {
                kind: 'splitter',
                children: [
                  {
                    region: { kind: 'panel', id: 'task-info', icon: 'mdiCardTextOutline', title: 'Task Info', content: <TaskInfoView /> },
                    defaultSize: '15%',
                    min: '10%',
                    max: '80%',
                  },
                  {
                    region: { kind: 'panel', id: 'document', icon: 'mdiFileDocumentOutline', title: 'Document Name', content: <DocumentView /> },
                    defaultSize: '70%',
                    min: '10%',
                    max: '80%',
                  },
                ],
              },
              defaultSize: '75%',
              min: '15%',
              max: '85%',
            },
            {
              region: { kind: 'panel', id: 'console', icon: 'mdiConsole', title: 'Console', content: <ConsoleView /> },
              defaultSize: '25%',
              min: '15%',
              max: '85%',
            },
          ],
        },
        defaultSize: '75%',
        min: '20%',
        max: '90%',
      },
      {
        region: {
          kind: 'splitter',
          vertical: true,
          children: [
            {
              region: { kind: 'panel', id: 'generative-ai', icon: 'mdiCreationOutline', title: 'Generative AI', content: <GenerativeAIView /> },
              defaultSize: '50%',
              min: '15%',
              max: '85%',
            },
            {
              region: { kind: 'panel', id: 'progress', icon: 'mdiProgressStarFourPoints', title: 'Progress', content: <ProgressView /> },
              defaultSize: '50%',
              min: '15%',
              max: '85%',
            },
          ],
        },
        defaultSize: '25%',
        min: '10%',
        max: '80%',
      },
    ],
  }

  const maximizedId = (Object.keys(panelStates) as PanelId[]).find((id) => panelStates[id] === 'maximized')
  const maximizedRegion = maximizedId ? findPanelRegion(layout, maximizedId) : null

  return (
    <ConfigProvider
      theme={{
        components: {
          Splitter: { splitBarSize: 4, splitTriggerSize: 16 },
        },
      }}
    >
      <div className={styles.root}>
        {renderRegion(layout)}
        {maximizedRegion && <div className={styles.maximizedOverlay}>{renderPanel(maximizedRegion)}</div>}
      </div>
    </ConfigProvider>
  )
})

// Collapse a minimized panel only when its splitter is vertical — collapsing width on a horizontal splitter would hide the
// header controls and trap the user in minimized state.
function minimizedSize(region: Region, states: PanelStates, parentVertical: boolean): number | undefined {
  if (region.kind !== 'panel') return undefined
  if (states[region.id] !== 'minimized') return undefined
  return parentVertical ? PANEL_HEADER_PX : undefined
}

function findPanelRegion(region: Region, id: PanelId): PanelRegion | null {
  if (region.kind === 'panel') return region.id === id ? region : null
  for (const child of region.children) {
    const found = findPanelRegion(child.region, id)
    if (found) return found
  }
  return null
}
