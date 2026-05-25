import { useState, type ReactElement } from 'react'
import * as mdiPaths from '@mdi/js'
import { Avatar, Divider, Flex, Layout, Space, Tooltip } from 'antd'
import { AccountModal } from './modals/AccountModal'
import { NotificationModal } from './modals/NotificationModal'
import { ProductionLineModal } from './modals/ProductionLineModal'
import { SettingsModal } from './modals/SettingsModal'
import { SimulationPlanModal } from './modals/SimulationPlanModal'
import 'antd/dist/reset.css'

type AxAppLayoutTopProps = {
  splitViewActive?: boolean
  onToggleSplitView?: () => void
}

type IconItem = {
  icon: string
  title: string
  modalType?: ModalType
}

type ModalType = 'notification' | 'account' | 'settings' | 'productionLine' | 'simulationPlan'

type SelectableItem = {
  id: string
  name: string
  description?: string
}

type MenuIconProps = {
  icon: string
  title: string
  isActive?: boolean
  onClick?: () => void
}

type MenuBoxProps = {
  icon: string
  label: string
  title: string
  isActive?: boolean
  onClick?: () => void
}

const leftMenu: IconItem[] = [
  { icon: 'mdiApps', title: 'Home' },
  { icon: 'mdiEarth', title: 'World Map' },
]

const productionLines: SelectableItem[] = [
  { id: 'm-soc', name: 'M-SOC', description: 'Mobile SoC line' },
  { id: 'auto-sensor', name: 'Auto Sensor', description: 'Automotive sensor line' },
  { id: 'memory-x', name: 'Memory X', description: 'Memory packaging line' },
]

const simulationPlans: SelectableItem[] = [
  { id: 'plan-a', name: 'Plan A (Simulation)', description: 'Baseline scenario' },
  { id: 'plan-b', name: 'Plan B (Simulation)', description: 'Throughput-optimized' },
  { id: 'plan-c', name: 'Plan C (Simulation)', description: 'Cost-optimized' },
]

const systemMenu: IconItem[] = [
  { icon: 'mdiBellOutline', title: 'Notification', modalType: 'notification' },
  { icon: 'mdiAccountCircleOutline', title: 'User Account', modalType: 'account' },
  { icon: 'mdiCogOutline', title: 'System Settings', modalType: 'settings' },
]

const mdiMap = mdiPaths as Record<string, string>

const resolveIconPath = (icon: string): string => {
  return mdiMap[icon] ?? mdiMap.mdiApps
}

const MenuIcon = (props: MenuIconProps): ReactElement => {
  const path = resolveIconPath(props.icon)
  return (
    <Tooltip title={props.title} placement="bottom">
      <button type="button" className={`ax-menu-icon ${props.isActive ? 'is-active' : ''}`.trim()} onClick={props.onClick}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="ax-menu-icon_icon" width={20} height={20}>
          <path d={path} />
        </svg>
      </button>
    </Tooltip>
  )
}

const MenuBox = (props: MenuBoxProps): ReactElement => {
  const iconPath = resolveIconPath(props.icon)
  const downPath = resolveIconPath('mdiMenuDown')
  return (
    <Tooltip title={props.title} placement="bottom">
      <button type="button" className={`ax-menu-box ${props.isActive ? 'is-active' : ''}`.trim()} onClick={props.onClick}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="ax-menu-box_icon" width={20} height={20}>
          <path d={iconPath} />
        </svg>
        <span className="ax-menu-box_text">{props.label}</span>
        <svg viewBox="0 0 24 24" fill="currentColor" className="ax-menu-box_down" width={16} height={16}>
          <path d={downPath} />
        </svg>
      </button>
    </Tooltip>
  )
}

export function AxAppLayoutTop(props: AxAppLayoutTopProps): ReactElement {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null)
  const [activeProductionLineId, setActiveProductionLineId] = useState<string>(productionLines[0].id)
  const [activeSimulationPlanId, setActiveSimulationPlanId] = useState<string>(simulationPlans[0].id)

  const activeProductionLine = productionLines.find((line) => line.id === activeProductionLineId) ?? productionLines[0]
  const activeSimulationPlan = simulationPlans.find((plan) => plan.id === activeSimulationPlanId) ?? simulationPlans[0]

  const handleMenuClick = (item: IconItem): void => {
    const modalType = item.modalType
    if (!modalType) {
      return
    }

    setActiveModal((current) => {
      return current === modalType ? null : modalType
    })
  }

  const renderModal = (): ReactElement | null => {
    if (activeModal === 'productionLine') {
      return (
        <ProductionLineModal
          items={productionLines}
          activeId={activeProductionLineId}
          onSelect={(id) => setActiveProductionLineId(id)}
          onClose={() => setActiveModal(null)}
        />
      )
    }

    if (activeModal === 'simulationPlan') {
      return (
        <SimulationPlanModal
          items={simulationPlans}
          activeId={activeSimulationPlanId}
          onSelect={(id) => setActiveSimulationPlanId(id)}
          onClose={() => setActiveModal(null)}
        />
      )
    }

    if (activeModal === 'notification') {
      return <NotificationModal onClose={() => setActiveModal(null)} />
    }

    if (activeModal === 'account') {
      return <AccountModal onClose={() => setActiveModal(null)} />
    }

    if (activeModal === 'settings') {
      return <SettingsModal onClose={() => setActiveModal(null)} />
    }

    return null
  }

  return (
    <Layout.Header className="ax-layout-top ax-app-layout-top">
      <Flex align="center" justify="space-between" gap="small" style={{ height: '100%', width: '100%' }}>
        <Flex align="center" justify="start" gap="medium">
          <Space>
            <Flex align="center" justify="center" style={{ width: '24px', height: '24px' }}>
              <Tooltip title="A-MAI" placement="bottomLeft">
                <Avatar size={22}>A</Avatar>
              </Tooltip>
            </Flex>
          </Space>
          <Space size={8}>
            {leftMenu.map((item) => (
              <MenuIcon key={item.icon} icon={item.icon} title={item.title} />
            ))}
          </Space>
          <Space size={8}>
            <MenuBox
              icon="mdiDnsOutline"
              label={activeProductionLine.name}
              title={`Production Line: ${activeProductionLine.name}`}
              isActive={activeModal === 'productionLine'}
              onClick={() => setActiveModal((current) => (current === 'productionLine' ? null : 'productionLine'))}
            />
            <MenuBox
              icon="mdiCardBulletedOutline"
              label={activeSimulationPlan.name}
              title={`Simulation: ${activeSimulationPlan.name}`}
              isActive={activeModal === 'simulationPlan'}
              onClick={() => setActiveModal((current) => (current === 'simulationPlan' ? null : 'simulationPlan'))}
            />
          </Space>
        </Flex>
        <Flex align="center" justify="end" gap="small">
          <Space size={8}>
            <MenuIcon
              icon="mdiBookOpenOutline"
              title="Split View"
              isActive={props.splitViewActive}
              onClick={props.onToggleSplitView}
            />
          </Space>
          <Divider vertical style={{ height: '24px', margin: '0' }} className="ax-menu-divider" />
          <Space size={8}>
            {systemMenu.map((item) => {
              const isActive = item.modalType ? activeModal === item.modalType : false
              return <MenuIcon key={item.icon} icon={item.icon} title={item.title} isActive={isActive} onClick={() => handleMenuClick(item)} />
            })}
          </Space>
        </Flex>
      </Flex>
      {renderModal()}
    </Layout.Header>
  )
}
