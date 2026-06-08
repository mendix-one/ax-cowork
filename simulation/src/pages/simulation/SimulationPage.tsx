import { useState } from 'react'
import { Flex, message, Typography } from 'antd'
import { AxAppLayout } from '@axapp/AxAppLayout'
import { AxDisplayPanel } from '@axpanel/AxDisplayPanel'
import type { AxAppLayoutContainerProps, PrpDsLeftPanelsType, PrpDsRightPanelsType } from '../../../../widgets/ax-app/typings/AxAppLayoutProps'
import { action, dynamic, editable, webImage, type DynamicValue, type WebIcon } from '@/mock/mendix'

// Full-page host for the AxAppLayout widget (the layout shell formerly known as AxSimulation). The widget
// owns the chrome (top bar + left/right icon rails + switchable views). In SPLIT_VIEW_MULTIPLE both rails
// are cached panel stacks: each entry of prpDsLeftPanels / prpDsRightPanels supplies a rail icon, a caption
// (tooltip) and the view content. Each view is wrapped in an AxDisplayPanel widget — Main panels (left) get
// a maximize/restore toggle, Sub panels (right) get a close button — exactly what a Mendix modeller would
// compose in Studio Pro.

// The sim doesn't load an icon font, so build a visible rail icon from an emoji via an inline SVG
// data-URI. The mock Icon renders `type: 'image'` WebIcons as an <img>, so this shows up in the rail
// without pulling in a glyph font.
function emojiIcon(emoji: string): DynamicValue<WebIcon> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><text x="50%" y="50%" font-size="15" text-anchor="middle" dominant-baseline="central">${emoji}</text></svg>`
  return dynamic<WebIcon>({ type: 'image', iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` })
}

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
// a Mendix attribute would back it; the control button fires the matching mock action. AxDisplayPanel
// broadcasts AX_LAYOUT_* on maximize/restore/close, which the AxAppLayout host store reacts to.
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

// View descriptors. `no` is the rail group (the rail draws a divider between groups). Each maps to one
// panel entry — a Main view on the left rail or a Sub view on the right rail.
interface ViewDef {
  no: number
  title: string
  subtitle: string
  emoji: string
}

// Left views (9) — Main panels (maximize / restore), grouped into three rail sections.
const LEFT_VIEWS: ViewDef[] = [
  { no: 1, title: 'Simulation', subtitle: 'Gantt schedule & quick analysis for the active plan.', emoji: '📊' },
  { no: 1, title: 'Projects', subtitle: 'Project list and scenario portfolio.', emoji: '📁' },
  { no: 1, title: 'Analysis', subtitle: 'Heatmaps, milestones and routing matrix.', emoji: '🔍' },
  { no: 2, title: 'PM Data', subtitle: 'Preventive-maintenance master data.', emoji: '🛠️' },
  { no: 2, title: 'Tuning Logic', subtitle: 'Rules driving the auto-tuner.', emoji: '🎛️' },
  { no: 2, title: 'Factor Control', subtitle: 'Capacity & demand factors.', emoji: '⚖️' },
  { no: 2, title: 'PM Standard', subtitle: 'Standard PM definitions and templates.', emoji: '📐' },
  { no: 3, title: 'Integration', subtitle: 'Inbound / outbound connectors.', emoji: '🔌' },
  { no: 3, title: 'Setting', subtitle: 'Module configuration.', emoji: '⚙️' },
]

// Right views (4) — Sub panels (close), grouped into two rail sections.
const RIGHT_VIEWS: ViewDef[] = [
  { no: 1, title: 'Compare', subtitle: 'Side-by-side plan comparison.', emoji: '🆚' },
  { no: 1, title: 'AI Assistant', subtitle: 'Ask about the current plan.', emoji: '🤖' },
  { no: 2, title: 'Recommendation', subtitle: 'Suggested reroutes & fixes.', emoji: '💡' },
  { no: 2, title: 'History', subtitle: 'Schedule change log.', emoji: '🕑' },
]

const leftPanels: PrpDsLeftPanelsType[] = LEFT_VIEWS.map((view) => ({
  prpLeftPanelNo: view.no,
  prpLeftPanelIcon: emojiIcon(view.emoji),
  prpLeftPanelCaption: dynamic(view.title),
  prpLeftPanelContent: <SimPanel type="main" title={view.title} subtitle={view.subtitle} />,
}))

const rightPanels: PrpDsRightPanelsType[] = RIGHT_VIEWS.map((view) => ({
  prpRightPanelNo: view.no,
  prpRightPanelIcon: emojiIcon(view.emoji),
  prpRightPanelCaption: dynamic(view.title),
  prpRightPanelContent: <SimPanel type="sub" title={view.title} subtitle={view.subtitle} />,
}))

export function SimulationPage() {
  const props: AxAppLayoutContainerProps = {
    name: 'axapp',
    class: '',

    // Both rails are cached panel stacks driven by their rail buttons.
    prpEnmMode: 'SPLIT_VIEW_MULTIPLE',

    // --- Header logo (top-bar brand image + click action) ---
    prpImgLogo: webImage('/aplanner-light.png'),
    prpActLogo: action(() => message.info('Logo clicked')),

    // --- Header top-bar menu visibility ---
    prpBlnHeaderMenuApps: true,
    prpBlnHeaderMenuWorldMap: true,
    prpBlnHeaderMenuNotify: true,
    prpBlnHeaderMenuAccount: true,
    prpBlnHeaderMenuSettings: true,

    // --- Rail action menus: unused in SPLIT_VIEW_MULTIPLE (the rails render the panel stacks below) ---
    prpDsLeftMenus: [],
    prpDsRightMenus: [],

    // --- Left views (9) / Right views (4) ---
    prpDsLeftPanels: leftPanels,
    prpDsRightPanels: rightPanels,

    // --- Top-bar action callbacks ---
    prpActApps: action(() => message.info('Apps')),
    prpActWorldMap: action(() => message.info('World Map')),
    prpActNotify: action(() => message.info('Notify')),
    prpActAccount: action(() => message.info('Account')),
    prpActSettings: action(() => message.info('Settings')),

    // --- Top-bar tooltip labels (translatable in Studio; defaults mirror AxAppLayout.xml) ---
    prpStrApps: 'Menu',
    prpStrWorldMap: 'World Map',
    prpStrNotify: 'Notify',
    prpStrAccount: 'Account',
    prpStrSettings: 'Settings',
  }

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <AxAppLayout {...props} />
    </div>
  )
}
