import type { ReactElement, ReactNode } from 'react'
import cn from 'classnames'
import { Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import type { AxSimulationContainerProps } from '../../typings/AxSimulationProps'
import { useAxSimulationStore } from '../stores/context'
import type { LeftPanelId, RightPanelId } from '../stores/AxSimulationStore'
import { LEFT_MENU, RIGHT_MENU, type MenuItem } from './menus'

// Presentational full-page layout shell — a self-contained port of react-app's MpsLayout. Holds no
// business logic: the container maps Mendix `widgets` drop zones to the slot props below, and the
// store (read via the context) decides which left/right view is visible. Plain divs (not AntD Layout)
// so the shared axTheme's planner-tuned header/sider colours don't leak into this shell.

// A single icon button in one of the vertical rails. Mirrors react-app's AxMenuIcon: tooltip on hover,
// primary-tinted active state.
function RailButton<Id extends string>({
  item,
  active,
  placement,
  onClick,
}: {
  item: MenuItem<Id>
  active: boolean
  placement: 'right' | 'left'
  onClick: () => void
}): ReactElement {
  return (
    <Tooltip title={item.label} placement={placement}>
      <button
        type="button"
        className={cn('ax-sim_rail_btn', { 'is-active': active })}
        aria-label={item.label}
        aria-pressed={active}
        onClick={onClick}
      >
        <span className="ax-sim_rail_btn_icon">{item.icon}</span>
      </button>
    </Tooltip>
  )
}

// One stacked content view. All views are mounted; only the active one is shown (CSS fade). Inactive
// views keep visibility:hidden (not display:none) so a panel's first paint isn't deferred to activation.
function ViewSlot({ active, children }: { active: boolean; children: ReactNode }): ReactElement {
  return <div className={cn('ax-sim_slot', active ? 'is-active' : 'is-inactive')}>{children}</div>
}

export const AxSimulationMain = observer((props: AxSimulationContainerProps): ReactElement => {
  const store = useAxSimulationStore()

  // Map the Mendix drop-zone props onto id-keyed records so the menus drive the content stacks.
  const leftSlots: Record<LeftPanelId, ReactNode> = {
    simulation: props.leftSimulation,
    projects: props.leftProjects,
    analysis: props.leftAnalysis,
    pmData: props.leftPmData,
    tuningLogic: props.leftTuningLogic,
    factorControl: props.leftFactorControl,
    pmStandard: props.leftPmStandard,
    integration: props.leftIntegration,
    setting: props.leftSetting,
  }

  const rightSlots: Record<RightPanelId, ReactNode> = {
    compare: props.rightCompare,
    aiAssistant: props.rightAiAssistant,
    recommendation: props.rightRecommendation,
    history: props.rightHistory,
  }

  return (
    <div className={cn('ax-sim', props.class)} style={props.style} tabIndex={props.tabIndex}>
      <div className="ax-sim_layout">
        <header className="ax-sim_top">
          <div className="ax-sim_top_left">
            <div className="ax-sim_top_logo">{props.logo}</div>
            <div className="ax-sim_top_slot">{props.topMenu}</div>
            <div className="ax-sim_top_slot">{props.line}</div>
            <div className="ax-sim_top_slot">{props.planVersion}</div>
          </div>
          <div className="ax-sim_top_right">
            <div className="ax-sim_top_slot">{props.splitView}</div>
            <div className="ax-sim_top_slot">{props.notify}</div>
            <div className="ax-sim_top_slot">{props.user}</div>
            <div className="ax-sim_top_slot">{props.setting}</div>
          </div>
        </header>

        <div className="ax-sim_middle">
          <nav className="ax-sim_rail ax-sim_rail__left" aria-label="Primary views">
            {LEFT_MENU.map((item) => (
              <RailButton
                key={item.id}
                item={item}
                placement="right"
                active={store.activeLeft === item.id}
                onClick={() => store.setActiveLeft(item.id)}
              />
            ))}
          </nav>

          <main className="ax-sim_main">
            <div className="ax-sim_view ax-sim_view__left">
              {LEFT_MENU.map((item) => (
                <ViewSlot key={item.id} active={store.activeLeft === item.id}>
                  {leftSlots[item.id]}
                </ViewSlot>
              ))}
            </div>
            <div className={cn('ax-sim_view ax-sim_view__right', { 'is-closed': !store.rightOpen })}>
              {RIGHT_MENU.map((item) => (
                <ViewSlot key={item.id} active={store.rightOpen && store.activeRight === item.id}>
                  {rightSlots[item.id]}
                </ViewSlot>
              ))}
            </div>
          </main>

          <nav className="ax-sim_rail ax-sim_rail__right" aria-label="Secondary views">
            {RIGHT_MENU.map((item) => (
              <RailButton
                key={item.id}
                item={item}
                placement="left"
                active={store.rightOpen && store.activeRight === item.id}
                onClick={() => store.toggleRight(item.id)}
              />
            ))}
          </nav>
        </div>

        <footer className="ax-sim_bottom">{props.footer}</footer>
      </div>
    </div>
  )
})
