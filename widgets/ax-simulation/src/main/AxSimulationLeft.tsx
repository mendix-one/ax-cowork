import type { ReactElement } from 'react'
import { Divider, Flex, Layout, Space } from 'antd'
import { observer } from 'mobx-react-lite'
import { useAxSimulationStore } from '../stores/context'
import { AxMenuBtn } from './views/AxMenuBtn'

// Left icon rail (Layout.Sider). Fixed-width vertical menu; clicking sets the active left view.
export const AxSimulationLeft = observer((): ReactElement => {
  const store = useAxSimulationStore()
  return (
    <Layout.Sider width="2.65rem" className="ax-sim_rail ax-sim_rail__left">
      <Flex vertical align="center" justify="space-between" className="ax-sim_rail_inner">
        <Flex vertical align="center" justify="start">
          <Space vertical>
            <AxMenuBtn
              title="Simulation"
              active={true}
              placement="right"
              onClick={function (): void {
                throw new Error('Function not implemented.')
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>chart-gantt</title>
                <path d="M2,5H10V2H12V22H10V18H6V15H10V13H4V10H10V8H2V5M14,5H17V8H14V5M14,10H19V13H14V10M14,15H22V18H14V15Z" />
              </svg>
            </AxMenuBtn>
            <AxMenuBtn
              title="Projects"
              active={false}
              placement="right"
              onClick={function (): void {
                throw new Error('Function not implemented.')
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>format-list-bulleted-square</title>
                <path d="M3,4H7V8H3V4M9,5V7H21V5H9M3,10H7V14H3V10M9,11V13H21V11H9M3,16H7V20H3V16M9,17V19H21V17H9" />
              </svg>
            </AxMenuBtn>
            <AxMenuBtn
              title="Analysis"
              active={false}
              placement="right"
              onClick={function (): void {
                throw new Error('Function not implemented.')
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>chart-bar</title>
                <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z" />
              </svg>
            </AxMenuBtn>
            <AxMenuBtn
              title="PM Data"
              active={false}
              placement="right"
              onClick={function (): void {
                throw new Error('Function not implemented.')
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>table-large</title>
                <path d="M4,3H20A2,2 0 0,1 22,5V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V5A2,2 0 0,1 4,3M4,7V10H8V7H4M10,7V10H14V7H10M20,10V7H16V10H20M4,12V15H8V12H4M4,20H8V17H4V20M10,12V15H14V12H10M10,20H14V17H10V20M20,20V17H16V20H20M20,12H16V15H20V12Z" />
              </svg>
            </AxMenuBtn>
            <AxMenuBtn
              title="Tuning Logic"
              active={false}
              placement="right"
              onClick={function (): void {
                throw new Error('Function not implemented.')
              }}
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
              title="Tuning Logic"
              active={false}
              placement="right"
              onClick={function (): void {
                throw new Error('Function not implemented.')
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>chart-gantt</title>
                <path d="M2,5H10V2H12V22H10V18H6V15H10V13H4V10H10V8H2V5M14,5H17V8H14V5M14,10H19V13H14V10M14,15H22V18H14V15Z" />
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
