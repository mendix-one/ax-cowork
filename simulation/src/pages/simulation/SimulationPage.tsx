import type { ReactNode } from 'react'
import { Avatar, Card, Flex, message, Space, Typography } from 'antd'
import { AppstoreOutlined } from '@ant-design/icons'
import { AxSimulation } from '@axsimulation/AxSimulation'
import type { AxSimulationContainerProps } from '../../../../widgets/ax-simulation/typings/AxSimulationProps'
import { action } from '../../mock/mendix'

// Full-page host for the AxSimulation layout widget. The widget owns the chrome (top bar, rails,
// switchable views); this page supplies mock content for every `widgets` drop zone, the translatable
// label props, and mock top-bar actions — exactly what a Mendix modeller would configure in Studio Pro.

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

export function SimulationPage() {
  const props: AxSimulationContainerProps = {
    name: 'axsimulation',
    class: '',

    // --- Header logo (the only top-bar drop zone; the rest are widget-owned icon buttons) ---
    logo: (
      <Space size={8} align="center">
        <Avatar size={24} style={{ background: '#3F51B5' }} icon={<AppstoreOutlined />} />
        <Typography.Text strong style={{ color: '#3F51B5', whiteSpace: 'nowrap' }}>
          AX Simulation
        </Typography.Text>
      </Space>
    ),

    // --- Left views (9) ---
    propSimulation: <MockPanel title="Simulation" subtitle="Gantt schedule & quick analysis for the active plan." />,
    propProjects: <MockPanel title="Projects" subtitle="Project list and scenario portfolio." />,
    propAnalysis: <MockPanel title="Analysis" subtitle="Heatmaps, milestones and routing matrix." />,
    propPmData: <MockPanel title="PM Data" subtitle="Preventive-maintenance master data." />,
    propTuningLogic: <MockPanel title="Tuning Logic" subtitle="Rules driving the auto-tuner." />,
    propFactorControl: <MockPanel title="Factor Control" subtitle="Capacity & demand factors." />,
    propPmStandard: <MockPanel title="PM Standard" subtitle="Standard PM definitions and templates." />,
    propIntegration: <MockPanel title="Integration" subtitle="Inbound / outbound connectors." />,
    propSetting: <MockPanel title="Setting" subtitle="Module configuration." />,

    // --- Right views (4) ---
    propCompare: <MockPanel title="Compare" subtitle="Side-by-side plan comparison." />,
    propAiAssistant: <MockPanel title="AI Assistant" subtitle="Ask about the current plan." />,
    propRecommendation: <MockPanel title="Recommendation" subtitle="Suggested reroutes & fixes." />,
    propHistory: <MockPanel title="History" subtitle="Schedule change log." />,

    // --- Top-bar actions (mocked; a Mendix modeller wires these to microflows / nanoflows) ---
    actionApps: action(() => message.info('Apps')),
    actionWorldMap: action(() => message.info('World Map')),
    actionNotify: action(() => message.info('Notifications')),
    actionAccount: action(() => message.info('Account')),
    actionSettings: action(() => message.info('Settings')),

    // --- Labels (translatable in Studio; defaults mirror AxSimulation.xml) ---
    labelSimulation: 'Simulation',
    labelProjects: 'Projects',
    labelAnalysis: 'Analysis',
    labelPmData: 'PM Data',
    labelTuningLogic: 'Tuning Logic',
    labelSetting: 'Setting',
    labelCompare: 'Compare',
    labelAiAssistant: 'AI Assistant',
    labelRecommendation: 'Recommendation',
    labelHistory: 'History',
    labelApps: 'Menu',
    labelWorldMap: 'World Map',
    labelNotify: 'Notify',
    labelAccount: 'Account',
    labelSettings: 'Settings',
  }

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <AxSimulation {...props} />
    </div>
  )
}
