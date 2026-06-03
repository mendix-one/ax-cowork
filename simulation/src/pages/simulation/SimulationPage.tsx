import { useState } from 'react'
import { Avatar, Flex, message, Space, Typography } from 'antd'
import { AppstoreOutlined } from '@ant-design/icons'
import { AxSimulation } from '@axsimulation/AxSimulation'
import { AxDisplayPanel } from '@axpanel/AxDisplayPanel'
import type { AxSimulationContainerProps } from '../../../../widgets/ax-simulation/typings/AxSimulationProps'
import { action, editable } from '../../mock/mendix'

// Full-page host for the AxSimulation layout widget. The widget owns the chrome (top bar, rails,
// switchable views); each left/right view is wrapped in the AxDisplayPanel widget — Main panels (left)
// get a maximize/restore toggle, Sub panels (right) get a close button — exactly what a Mendix modeller
// would compose in Studio Pro.

// Placeholder body content for a panel, so switching menus / panels is obvious.
function PanelBody({ subtitle }: { subtitle?: string }) {
  return (
    <div style={{ padding: 8, height: '100%', boxSizing: 'border-box', overflow: 'auto' }}>
      {subtitle && (
        <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
          {subtitle}
        </Typography.Paragraph>
      )}
      <Flex vertical gap={8}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ height: 40, borderRadius: 6, background: '#f0f1f6' }} />
        ))}
      </Flex>
    </div>
  )
}

// One AxDisplayPanel instance. Owns its own `maximized` state via the mock EditableValue, mirroring how
// a Mendix attribute would back it; the control button fires the matching mock action.
function SimPanel({ type, title, subtitle }: { type: 'main' | 'sub'; title: string; subtitle?: string }) {
  const [maximized, setMaximized] = useState(false)
  return (
    <AxDisplayPanel
      name={`panel-${title}`}
      class=""
      type={type}
      title={title}
      content={<PanelBody subtitle={subtitle} />}
      maximized={editable([maximized, setMaximized])}
      onMaximize={action(() => message.info(`Maximize: ${title}`))}
      onRestore={action(() => message.info(`Restore: ${title}`))}
      onClose={action(() => message.info(`Close: ${title}`))}
    />
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

    // --- Left views (9) — Main panels (maximize / restore) ---
    propSimulation: <SimPanel type="main" title="Simulation" subtitle="Gantt schedule & quick analysis for the active plan." />,
    propProjects: <SimPanel type="main" title="Projects" subtitle="Project list and scenario portfolio." />,
    propAnalysis: <SimPanel type="main" title="Analysis" subtitle="Heatmaps, milestones and routing matrix." />,
    propPmData: <SimPanel type="main" title="PM Data" subtitle="Preventive-maintenance master data." />,
    propTuningLogic: <SimPanel type="main" title="Tuning Logic" subtitle="Rules driving the auto-tuner." />,
    propFactorControl: <SimPanel type="main" title="Factor Control" subtitle="Capacity & demand factors." />,
    propPmStandard: <SimPanel type="main" title="PM Standard" subtitle="Standard PM definitions and templates." />,
    propIntegration: <SimPanel type="main" title="Integration" subtitle="Inbound / outbound connectors." />,
    propSetting: <SimPanel type="main" title="Setting" subtitle="Module configuration." />,

    // --- Right views (4) — Sub panels (close) ---
    propCompare: <SimPanel type="sub" title="Compare" subtitle="Side-by-side plan comparison." />,
    propAiAssistant: <SimPanel type="sub" title="AI Assistant" subtitle="Ask about the current plan." />,
    propRecommendation: <SimPanel type="sub" title="Recommendation" subtitle="Suggested reroutes & fixes." />,
    propHistory: <SimPanel type="sub" title="History" subtitle="Schedule change log." />,

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
