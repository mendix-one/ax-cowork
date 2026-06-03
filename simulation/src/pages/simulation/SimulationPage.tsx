import type { ReactNode } from 'react'
import { Avatar, Button, Card, Flex, Space, Tag, Tooltip, Typography } from 'antd'
import {
  AppstoreOutlined,
  BellOutlined,
  BookOutlined,
  DownOutlined,
  GlobalOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { AxSimulation } from '@axsimulation/AxSimulation'
import type { AxSimulationContainerProps } from '../../../../widgets/ax-simulation/typings/AxSimulationProps'

// Full-page host for the AxSimulation layout widget. The widget owns the chrome (top bar, rails,
// switchable views); this page supplies mock content for every `widgets` drop zone — exactly what a
// Mendix modeller would drop into each region in Studio Pro.

// A placeholder content panel that fills its view slot, so switching left/right menus is obvious.
function MockPanel({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div style={{ width: '100%', height: '100%', boxSizing: 'border-box' }}>
      <Card title={title} size="small" style={{ height: '100%' }} styles={{ body: { height: 'calc(100% - 38px)', overflow: 'auto' } }}>
        {subtitle && (
          <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
            {subtitle}
          </Typography.Paragraph>
        )}
        {children ?? (
          <Flex vertical gap={8}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ height: 40, borderRadius: 6, background: '#f0f1f6' }} />
            ))}
          </Flex>
        )}
      </Card>
    </div>
  )
}

// A compact top-bar icon control (notify / user / setting / split view).
function TopIcon({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <Tooltip title={title} placement="bottom">
      <Button type="text" size="small" icon={icon} aria-label={title} />
    </Tooltip>
  )
}

export function SimulationPage() {
  const props: AxSimulationContainerProps = {
    name: 'axsimulation',
    class: '',

    // --- Header: left cluster ---
    logo: (
      <Space size={8} align="center">
        <Avatar size={24} style={{ background: '#3F51B5' }} icon={<AppstoreOutlined />} />
        <Typography.Text strong style={{ color: '#3F51B5', whiteSpace: 'nowrap' }}>
          AX Simulation
        </Typography.Text>
      </Space>
    ),
    topMenu: (
      <Space size={4}>
        <TopIcon icon={<AppstoreOutlined />} title="Apps" />
        <TopIcon icon={<GlobalOutlined />} title="World map" />
      </Space>
    ),
    line: (
      <Button size="small" icon={<DownOutlined />} iconPlacement="end">
        M-SOC
      </Button>
    ),
    planVersion: (
      <Space size={6} align="center">
        <Button size="small" icon={<DownOutlined />} iconPlacement="end">
          Plan A
        </Button>
        <Tag color="purple" style={{ margin: 0 }}>
          DRAFT
        </Tag>
      </Space>
    ),

    // --- Header: right cluster ---
    splitView: <TopIcon icon={<BookOutlined />} title="Split view" />,
    notify: <TopIcon icon={<BellOutlined />} title="Notifications" />,
    user: <TopIcon icon={<UserOutlined />} title="User account" />,
    setting: <TopIcon icon={<SettingOutlined />} title="Settings" />,

    // --- Left views (9) ---
    leftSimulation: <MockPanel title="Simulation" subtitle="Gantt schedule & quick analysis for the active plan." />,
    leftProjects: <MockPanel title="Projects" subtitle="Project list and scenario portfolio." />,
    leftAnalysis: <MockPanel title="Analysis" subtitle="Heatmaps, milestones and routing matrix." />,
    leftPmData: <MockPanel title="PM Data" subtitle="Preventive-maintenance master data." />,
    leftTuningLogic: <MockPanel title="Tuning Logic" subtitle="Rules driving the auto-tuner." />,
    leftFactorControl: <MockPanel title="Factor Control" subtitle="Capacity & demand factors." />,
    leftPmStandard: <MockPanel title="PM Standard" subtitle="Standard PM definitions and templates." />,
    leftIntegration: <MockPanel title="Integration" subtitle="Inbound / outbound connectors." />,
    leftSetting: <MockPanel title="Setting" subtitle="Module configuration." />,

    // --- Right views (4) ---
    rightCompare: <MockPanel title="Compare" subtitle="Side-by-side plan comparison." />,
    rightAiAssistant: <MockPanel title="AI Assistant" subtitle="Ask about the current plan." />,
    rightRecommendation: <MockPanel title="Recommendation" subtitle="Suggested reroutes & fixes." />,
    rightHistory: <MockPanel title="History" subtitle="Schedule change log." />,

    // --- Footer ---
    footer: (
      <Flex align="center" justify="space-between" style={{ width: '100%' }}>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Ready
        </Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          M-SOC · Plan A · 0 unsaved edits
        </Typography.Text>
      </Flex>
    ),
  }

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <AxSimulation {...props} />
    </div>
  )
}
