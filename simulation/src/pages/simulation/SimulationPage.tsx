import { useState } from 'react'
import { Flex, message, Typography } from 'antd'
import { AxSimulation } from '@axsimulation/AxSimulation'
import { AxDisplayPanel } from '@axpanel/AxDisplayPanel'
import type { AxSimulationContainerProps } from '../../../../widgets/ax-simulation/typings/AxSimulationProps'
import { action, editable, webImage } from '../../mock/mendix'

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
      prpEnmType={type}
      prpStrTitle={title}
      prpWdgContent={<PanelBody subtitle={subtitle} />}
      prpAttMaximized={editable([maximized, setMaximized])}
      prpActMaximize={action(() => message.info(`Maximize: ${title}`))}
      prpActRestore={action(() => message.info(`Restore: ${title}`))}
      prpActClose={action(() => message.info(`Close: ${title}`))}
    />
  )
}

export function SimulationPage() {
  const props: AxSimulationContainerProps = {
    name: 'axsimulation',
    class: '',

    // --- Header logo (top-bar brand image + click action) ---
    prpImgLogo: webImage('/aplanner-light.png'),
    prpActLogo: action(() => message.info('Logo clicked')),

    // --- Left views (9) — Main panels (maximize / restore) ---
    prpWdgSimulation: <SimPanel type="main" title="Simulation" subtitle="Gantt schedule & quick analysis for the active plan." />,
    prpWdgProjects: <SimPanel type="main" title="Projects" subtitle="Project list and scenario portfolio." />,
    prpWdgAnalysis: <SimPanel type="main" title="Analysis" subtitle="Heatmaps, milestones and routing matrix." />,
    prpWdgPmData: <SimPanel type="main" title="PM Data" subtitle="Preventive-maintenance master data." />,
    prpWdgTuningLogic: <SimPanel type="main" title="Tuning Logic" subtitle="Rules driving the auto-tuner." />,
    prpWdgFactorControl: <SimPanel type="main" title="Factor Control" subtitle="Capacity & demand factors." />,
    prpWdgPmStandard: <SimPanel type="main" title="PM Standard" subtitle="Standard PM definitions and templates." />,
    prpWdgIntegration: <SimPanel type="main" title="Integration" subtitle="Inbound / outbound connectors." />,
    prpWdgSetting: <SimPanel type="main" title="Setting" subtitle="Module configuration." />,

    // --- Right views (4) — Sub panels (close) ---
    prpWdgCompare: <SimPanel type="sub" title="Compare" subtitle="Side-by-side plan comparison." />,
    prpWdgAiAssistant: <SimPanel type="sub" title="AI Assistant" subtitle="Ask about the current plan." />,
    prpWdgRecommendation: <SimPanel type="sub" title="Recommendation" subtitle="Suggested reroutes & fixes." />,
    prpWdgHistory: <SimPanel type="sub" title="History" subtitle="Schedule change log." />,

    // --- Labels (translatable in Studio; defaults mirror AxSimulation.xml) ---
    prpStrSimulation: 'Simulation',
    prpStrProjects: 'Projects',
    prpStrAnalysis: 'Analysis',
    prpStrPmData: 'PM Data',
    prpStrTuningLogic: 'Tuning Logic',
    prpStrSetting: 'Setting',
    prpStrCompare: 'Compare',
    prpStrAiAssistant: 'AI Assistant',
    prpStrRecommendation: 'Recommendation',
    prpStrHistory: 'History',
    prpStrApps: 'Menu',
    prpStrWorldMap: 'World Map',
    prpStrNotify: 'Notify',
    prpStrAccount: 'Account',
    prpStrSettings: 'Settings',
  }

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <AxSimulation {...props} />
    </div>
  )
}
