import type { ReactElement } from 'react'
import { Divider, Flex, Layout, Space } from 'antd'
import { observer } from 'mobx-react-lite'
import { useAxSimulationStore } from '../stores/context'
import { AxMenuBtn } from './views/AxMenuBtn'

// Tooltip labels for the left rail buttons — sourced from widget props (translatable in Studio).
export interface AxSimulationLeftProps {
  labels: {
    simulation: string
    projects: string
    analysis: string
    pmData: string
    tuningLogic: string
    setting: string
  }
}

// Left icon rail (Layout.Sider). Fixed-width vertical menu; clicking sets the active left view. Active
// state reflects store.activeLeft so the rail and the content stack in AxSimulationMain stay in sync.
export const AxSimulationLeft = observer((props: AxSimulationLeftProps): ReactElement => {
  const store = useAxSimulationStore()
  const { labels } = props
  return (
    <Layout.Sider width="2.65rem" className="ax-sim_rail ax-sim_rail_left">
      <Flex vertical align="center" justify="space-between" className="ax-sim_rail_inner">
        <Flex vertical align="center" justify="start">
          <Space vertical>
            <AxMenuBtn
              title={labels.simulation}
              placement="right"
              active={store.activeLeft === 'simulation'}
              onClick={() => store.setActiveLeft('simulation')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>chart-gantt</title>
                <path d="M2,5H10V2H12V22H10V18H6V15H10V13H4V10H10V8H2V5M14,5H17V8H14V5M14,10H19V13H14V10M14,15H22V18H14V15Z" />
              </svg>
            </AxMenuBtn>
            <AxMenuBtn
              title={labels.projects}
              placement="right"
              active={store.activeLeft === 'projects'}
              onClick={() => store.setActiveLeft('projects')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>format-list-bulleted-square</title>
                <path d="M3,4H7V8H3V4M9,5V7H21V5H9M3,10H7V14H3V10M9,11V13H21V11H9M3,16H7V20H3V16M9,17V19H21V17H9" />
              </svg>
            </AxMenuBtn>
            <AxMenuBtn
              title={labels.analysis}
              placement="right"
              active={store.activeLeft === 'analysis'}
              onClick={() => store.setActiveLeft('analysis')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>chart-bar</title>
                <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z" />
              </svg>
            </AxMenuBtn>
            <AxMenuBtn
              title={labels.pmData}
              placement="right"
              active={store.activeLeft === 'pmData'}
              onClick={() => store.setActiveLeft('pmData')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>table-large</title>
                <path d="M4,3H20A2,2 0 0,1 22,5V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V5A2,2 0 0,1 4,3M4,7V10H8V7H4M10,7V10H14V7H10M20,10V7H16V10H20M4,12V15H8V12H4M4,20H8V17H4V20M10,12V15H14V12H10M10,20H14V17H10V20M20,20V17H16V20H20M20,12H16V15H20V12Z" />
              </svg>
            </AxMenuBtn>
            <AxMenuBtn
              title={labels.tuningLogic}
              placement="right"
              active={store.activeLeft === 'tuningLogic'}
              onClick={() => store.setActiveLeft('tuningLogic')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>ticket-percent-outline</title>
                <path d="M14.8 8L16 9.2L9.2 16L8 14.8L14.8 8M4 4H20C21.11 4 22 4.89 22 6V10C20.9 10 20 10.9 20 12C20 13.11 20.9 14 22 14V18C22 19.11 21.11 20 20 20H4C2.9 20 2 19.11 2 18V14C3.11 14 4 13.11 4 12C4 10.9 3.11 10 2 10V6C2 4.89 2.9 4 4 4M4 6V8.54C5.24 9.26 6 10.57 6 12C6 13.43 5.24 14.75 4 15.46V18H20V15.46C18.76 14.75 18 13.43 18 12C18 10.57 18.76 9.26 20 8.54V6H4M9.5 8C10.33 8 11 8.67 11 9.5C11 10.33 10.33 11 9.5 11C8.67 11 8 10.33 8 9.5C8 8.67 8.67 8 9.5 8M14.5 13C15.33 13 16 13.67 16 14.5C16 15.33 15.33 16 14.5 16C13.67 16 13 15.33 13 14.5C13 13.67 13.67 13 14.5 13Z" />
              </svg>
            </AxMenuBtn>
          </Space>
          <Divider className="ax-menu-divider" />
          <Space vertical>
            <AxMenuBtn
              title={labels.setting}
              placement="right"
              active={store.activeLeft === 'setting'}
              onClick={() => store.setActiveLeft('setting')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>cog-outline</title>
                <path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z" />
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
