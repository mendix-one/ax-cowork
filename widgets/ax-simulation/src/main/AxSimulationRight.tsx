import type { ReactElement } from 'react'
import { Flex, Layout, Space } from 'antd'
import { observer } from 'mobx-react-lite'
import { useAxSimulationStore } from '../stores/context'
import { AxMenuBtn } from './views/AxMenuBtn'

// Tooltip labels for the right rail buttons — sourced from widget props (translatable in Studio).
export interface AxSimulationRightProps {
  labels: {
    compare: string
    aiAssistant: string
    recommendation: string
    history: string
  }
}

// Right icon rail (Layout.Sider). Clicking toggles the right region: opens it on the clicked view, or
// closes it when the active view is clicked again. Active state reflects the open right view.
export const AxSimulationRight = observer((props: AxSimulationRightProps): ReactElement => {
  const store = useAxSimulationStore()
  const { labels } = props
  return (
    <Layout.Sider width="2.65rem" className="ax-sim_rail ax-sim_rail_right">
      <Flex vertical align="center" justify="space-between" className="ax-sim_rail_inner">
        <Flex vertical align="center" justify="start">
          <Space vertical>
            <AxMenuBtn
              title={labels.compare}
              placement="left"
              active={store.rightOpen && store.activeRight === 'compare'}
              onClick={() => store.toggleRight('compare')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>book-open-outline</title>
                <path d="M21,4H3A2,2 0 0,0 1,6V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V6A2,2 0 0,0 21,4M3,19V6H11V19H3M21,19H13V6H21V19M14,9.5H20V11H14V9.5M14,12H20V13.5H14V12M14,14.5H20V16H14V14.5Z" />
              </svg>
            </AxMenuBtn>
            <AxMenuBtn
              title={labels.aiAssistant}
              placement="left"
              active={store.rightOpen && store.activeRight === 'aiAssistant'}
              onClick={() => store.toggleRight('aiAssistant')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>creation-outline</title>
                <path d="M9 4L11.5 9.5L17 12L11.5 14.5L9 20L6.5 14.5L1 12L6.5 9.5L9 4M9 8.83L8 11L5.83 12L8 13L9 15.17L10 13L12.17 12L10 11L9 8.83M19 9L17.74 6.26L15 5L17.74 3.75L19 1L20.25 3.75L23 5L20.25 6.26L19 9M19 23L17.74 20.26L15 19L17.74 17.75L19 15L20.25 17.75L23 19L20.25 20.26L19 23Z" />
              </svg>
            </AxMenuBtn>
            <AxMenuBtn
              title={labels.recommendation}
              placement="left"
              active={store.rightOpen && store.activeRight === 'recommendation'}
              onClick={() => store.toggleRight('recommendation')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>lightbulb-on-outline</title>
                <path d="M20,11H23V13H20V11M1,11H4V13H1V11M13,1V4H11V1H13M4.92,3.5L7.05,5.64L5.63,7.05L3.5,4.93L4.92,3.5M16.95,5.63L19.07,3.5L20.5,4.93L18.37,7.05L16.95,5.63M12,6A6,6 0 0,1 18,12C18,14.22 16.79,16.16 15,17.2V19A1,1 0 0,1 14,20H10A1,1 0 0,1 9,19V17.2C7.21,16.16 6,14.22 6,12A6,6 0 0,1 12,6M14,21V22A1,1 0 0,1 13,23H11A1,1 0 0,1 10,22V21H14M11,18H13V15.87C14.73,15.43 16,13.86 16,12A4,4 0 0,0 12,8A4,4 0 0,0 8,12C8,13.86 9.27,15.43 11,15.87V18Z" />
              </svg>
            </AxMenuBtn>
            <AxMenuBtn
              title={labels.history}
              placement="left"
              active={store.rightOpen && store.activeRight === 'history'}
              onClick={() => store.toggleRight('history')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>history</title>
                <path d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3" />
              </svg>
            </AxMenuBtn>
          </Space>
        </Flex>
        <Flex vertical align="center" justify="end">
          <Space>&nbsp;</Space>
        </Flex>
      </Flex>
    </Layout.Sider>
  )
})
