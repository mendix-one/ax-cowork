import type { ReactNode } from 'react'
import {
  ApiOutlined,
  BarChartOutlined,
  BulbOutlined,
  ControlOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  DiffOutlined,
  FileDoneOutlined,
  HistoryOutlined,
  LineChartOutlined,
  ProjectOutlined,
  RobotOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import type { LeftPanelId, RightPanelId } from '../stores/AxSimulationStore'

export interface MenuItem<Id> {
  id: Id
  label: string
  icon: ReactNode
}

// Fixed left-rail menu — order defines the rail. Each id maps to a content drop zone in the layout.
export const LEFT_MENU: MenuItem<LeftPanelId>[] = [
  { id: 'simulation', label: 'Simulation', icon: <LineChartOutlined /> },
  { id: 'projects', label: 'Projects', icon: <ProjectOutlined /> },
  { id: 'analysis', label: 'Analysis', icon: <BarChartOutlined /> },
  { id: 'pmData', label: 'PM Data', icon: <DatabaseOutlined /> },
  { id: 'tuningLogic', label: 'Tuning Logic', icon: <ControlOutlined /> },
  { id: 'factorControl', label: 'Factor Control', icon: <DeploymentUnitOutlined /> },
  { id: 'pmStandard', label: 'PM Standard', icon: <FileDoneOutlined /> },
  { id: 'integration', label: 'Integration', icon: <ApiOutlined /> },
  { id: 'setting', label: 'Setting', icon: <SettingOutlined /> },
]

// Fixed right-rail menu.
export const RIGHT_MENU: MenuItem<RightPanelId>[] = [
  { id: 'compare', label: 'Compare', icon: <DiffOutlined /> },
  { id: 'aiAssistant', label: 'AI Assistant', icon: <RobotOutlined /> },
  { id: 'recommendation', label: 'Recommendation', icon: <BulbOutlined /> },
  { id: 'history', label: 'History', icon: <HistoryOutlined /> },
]
