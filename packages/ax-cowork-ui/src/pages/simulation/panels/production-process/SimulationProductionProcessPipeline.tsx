import { Tag, Tooltip, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { TECH_ROUTINGS, TOOL_GROUP_CAPACITIES, type ProcessStep, type ProcessStepStage } from '../../data/mock-plan'
import { calcStageGroups, formatCycle, formatYield } from './production-process.helpers'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Pipeline view — steps grouped by stage (FEOL → MOL → BEOL → Test → Assembly). Within each stage
// the steps flow left-to-right with small inter-step chips showing move + wait time. Between stages
// a larger arrow shows the stage-transition move time (the first step of the next stage's move).
// Below the pipeline a step-detail table lists every step row-by-row with Cycle / Move / Wait /
// Yield, easy to compare and print.

const STAGE_TAG_COLOR: Record<ProcessStepStage, string> = {
  FEOL: 'geekblue',
  MOL: 'cyan',
  BEOL: 'purple',
  Test: 'gold',
  Assembly: 'green',
}

const tgUtil = (toolGroup: string) => {
  const cap = TOOL_GROUP_CAPACITIES.find((g) => g.name === toolGroup)
  if (!cap || cap.total <= 0) return 0
  return cap.used / cap.total
}

const utilBadge = (ratio: number) => {
  if (ratio > 1) return { color: 'red', label: 'Overload' }
  if (ratio >= 0.85) return { color: 'orange', label: 'Highload' }
  if (ratio >= 0.4) return { color: 'blue', label: 'Normal' }
  return { color: 'default', label: 'Idle' }
}

// `StepTile` was inlined into the body of SimulationProductionProcessPipeline so the file only
// exports React component(s) wrapped in `observer` — react-refresh / fast-refresh requires this in dev.
const renderStepTile = (step: ProcessStep, isBottleneck: boolean, onDrill: (toolGroup: string) => void) => {
  const ratio = tgUtil(step.toolGroup)
  const badge = utilBadge(ratio)
  return (
    <div
      className={`ax-process_step ${isBottleneck ? 'is-bottleneck' : ''}`}
      role="button"
      tabIndex={0}
      title={`Open ${step.toolGroup} in Shop Floor Capacity`}
      onClick={() => onDrill(step.toolGroup)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onDrill(step.toolGroup)
        }
      }}
    >
      <div className="ax-process_step_top">
        <span className="ax-process_step_order">#{step.order}</span>
        <Tag color={STAGE_TAG_COLOR[step.stage]} style={{ margin: 0 }}>
          {step.stage}
        </Tag>
      </div>
      <div className="ax-process_step_name">{step.name}</div>
      <div className="ax-process_step_meta">
        <Tooltip title="Tool group">
          <span className="ax-process_step_chip">
            <AxMuiIcon icon="mdiFactory" size={12} />
            {step.toolGroup}
          </span>
        </Tooltip>
        <Tooltip title={step.qualRequired ? 'Recipe qualification required' : 'No qual gate'}>
          <span className="ax-process_step_chip">
            <AxMuiIcon icon={step.qualRequired ? 'mdiShieldCheckOutline' : 'mdiCheckCircleOutline'} size={12} />
            {step.recipe}
          </span>
        </Tooltip>
      </div>
      <div className="ax-process_step_kpis">
        <div className="ax-process_step_kpi">
          <div className="ax-process_step_kpi_label">Cycle</div>
          <div className="ax-process_step_kpi_value">{formatCycle(step.cycleHours)}</div>
        </div>
        <div className="ax-process_step_kpi">
          <div className="ax-process_step_kpi_label">Yield</div>
          <div className="ax-process_step_kpi_value">{formatYield(step.expectedYield)}</div>
        </div>
      </div>
      <div className="ax-process_step_footer">
        <Tag color={badge.color} style={{ margin: 0 }}>
          {badge.label} · {Math.round(ratio * 100)}%
        </Tag>
        {isBottleneck && (
          <Tag color="orange" style={{ margin: 0 }}>
            Bottleneck
          </Tag>
        )}
      </div>
    </div>
  )
}

// Inter-step / inter-stage arrow with Move + Wait chips. The `large` variant is used between stage
// groups so the planner can see at a glance which stage transitions cost the most clock time.
const renderTransition = (move: number, wait: number, variant: 'inline' | 'large', title: string) => (
  <Tooltip title={title}>
    <div className={`ax-process_transition ax-process_transition__${variant}`}>
      <AxMuiIcon icon="mdiArrowRightThick" size={variant === 'large' ? 22 : 16} className="ax-process_transition_arrow" />
      <div className="ax-process_transition_chips">
        {move > 0 && (
          <span className="ax-process_transition_chip ax-process_transition_chip__move">
            <AxMuiIcon icon="mdiTransitConnectionVariant" size={11} />
            {formatCycle(move)} move
          </span>
        )}
        {wait > 0 && (
          <span className="ax-process_transition_chip ax-process_transition_chip__wait">
            <AxMuiIcon icon="mdiTimerSandEmpty" size={11} />
            {formatCycle(wait)} wait
          </span>
        )}
      </div>
    </div>
  </Tooltip>
)

export const SimulationProductionProcessPipeline = observer(() => {
  const sim = useSimulationContext()
  const process = sim.productionProcess
  const routing = TECH_ROUTINGS.find((t) => t.tech === process.selectedTech) ?? TECH_ROUTINGS[0]
  const drill = (toolGroup: string) => sim.navigateToToolGroup(toolGroup)

  // Highest-utilisation tool group among the steps is the bottleneck of this tech.
  let bottleneckStepId: string | null = null
  let bestRatio = 0
  for (const step of routing.steps) {
    const r = tgUtil(step.toolGroup)
    if (r > bestRatio) {
      bestRatio = r
      bottleneckStepId = step.id
    }
  }

  const totalCycle = routing.steps.reduce((s, st) => s + st.cycleHours, 0)
  const totalMove = routing.steps.reduce((s, st) => s + st.movementHours, 0)
  const totalWait = routing.steps.reduce((s, st) => s + st.waitHours, 0)
  const totalClock = totalCycle + totalMove + totalWait
  const e2eYield = routing.steps.reduce((y, st) => y * st.expectedYield, 1)
  const stages = calcStageGroups(routing)

  return (
    <div className="ax-process_pipeline_wrap">
      <div className="ax-analysis_section">
        <div className="ax-analysis_section_header">
          <div className="ax-analysis_section_header_title">
            <AxMuiIcon icon="mdiSitemapOutline" size={18} />
            <span>{routing.tech} · {routing.family} pipeline</span>
          </div>
          <Typography.Text type="secondary" className="text-sm">
            {routing.layers}L {routing.bitDensity} · {routing.steps.length} steps · Process {formatCycle(totalCycle)} · Move {formatCycle(totalMove)} · Wait {formatCycle(totalWait)} · End-to-end {formatCycle(totalClock)} · {formatYield(e2eYield)} yield
          </Typography.Text>
        </div>
        <div className="ax-analysis_section_body">
          <div className="ax-process_pipeline">
            {stages.map((group, gIdx) => (
              <div key={group.stage} className="ax-process_pipeline_stage">
                {/* Stage banner */}
                <div className="ax-process_stage_banner">
                  <Tag color={STAGE_TAG_COLOR[group.stage]} style={{ margin: 0 }}>
                    {group.stage}
                  </Tag>
                  <span className="ax-process_stage_banner_meta">
                    {group.steps.length} step{group.steps.length === 1 ? '' : 's'} · {formatCycle(group.totalCycleHours)} process
                    {group.totalMoveHours > 0 ? ` · ${formatCycle(group.totalMoveHours)} move` : ''}
                    {group.totalWaitHours > 0 ? ` · ${formatCycle(group.totalWaitHours)} wait` : ''}
                  </span>
                </div>
                {/* Step tiles + inline inter-step transitions */}
                <div className="ax-process_pipeline_row">
                  {group.steps.map((step, sIdx) => (
                    <div key={step.id} className="ax-process_pipeline_node">
                      {renderStepTile(step, step.id === bottleneckStepId, drill)}
                      {sIdx < group.steps.length - 1 &&
                        renderTransition(
                          group.steps[sIdx + 1].movementHours,
                          group.steps[sIdx + 1].waitHours,
                          'inline',
                          `Between ${step.name} → ${group.steps[sIdx + 1].name}`,
                        )}
                    </div>
                  ))}
                </div>
                {/* Stage-transition arrow (only between stage groups, never after the last stage) */}
                {gIdx < stages.length - 1 && (
                  <div className="ax-process_stage_transition">
                    {renderTransition(
                      stages[gIdx + 1].steps[0]?.movementHours ?? 0,
                      stages[gIdx + 1].steps[0]?.waitHours ?? 0,
                      'large',
                      `Stage transition: ${group.stage} → ${stages[gIdx + 1].stage}`,
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ax-analysis_section">
        <div className="ax-analysis_section_header">
          <div className="ax-analysis_section_header_title">
            <AxMuiIcon icon="mdiTableLargePlus" size={18} />
            <span>Step detail</span>
          </div>
        </div>
        <div className="ax-analysis_section_body">
          <table className="ax-analysis_table">
            <thead>
              <tr>
                <th>#</th>
                <th>Stage</th>
                <th>Step</th>
                <th>Tool group</th>
                <th>Recipe</th>
                <th>Qual</th>
                <th style={{ textAlign: 'right' }}>Cycle</th>
                <th style={{ textAlign: 'right' }}>Move</th>
                <th style={{ textAlign: 'right' }}>Wait</th>
                <th style={{ textAlign: 'right' }}>Yield</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {routing.steps.map((step) => (
                <tr key={step.id}>
                  <td>{step.order}</td>
                  <td>
                    <Tag color={STAGE_TAG_COLOR[step.stage]} style={{ margin: 0 }}>
                      {step.stage}
                    </Tag>
                  </td>
                  <td>
                    <b>{step.name}</b>
                    {step.id === bottleneckStepId && (
                      <Tag color="orange" style={{ marginLeft: 6 }}>
                        Bottleneck
                      </Tag>
                    )}
                  </td>
                  <td>{step.toolGroup}</td>
                  <td>{step.recipe}</td>
                  <td>{step.qualRequired ? <Tag color="purple">Required</Tag> : <Tag>—</Tag>}</td>
                  <td style={{ textAlign: 'right' }}>{formatCycle(step.cycleHours)}</td>
                  <td style={{ textAlign: 'right' }}>{step.movementHours > 0 ? formatCycle(step.movementHours) : <span style={{ color: '#bfbfbf' }}>—</span>}</td>
                  <td style={{ textAlign: 'right' }}>{step.waitHours > 0 ? formatCycle(step.waitHours) : <span style={{ color: '#bfbfbf' }}>—</span>}</td>
                  <td style={{ textAlign: 'right' }}>{formatYield(step.expectedYield)}</td>
                  <td>{step.note ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
})
