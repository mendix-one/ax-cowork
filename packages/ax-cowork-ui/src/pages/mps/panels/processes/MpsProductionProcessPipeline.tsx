import { Tag, Tooltip, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../store/mps.context'
import { TECH_ROUTINGS, TOOL_GROUP_CAPACITIES, type ProcessStep, type ProcessStepStage } from '../../data/mock-plan'
import { calcStageGroups, formatCycle, formatYield, stageClockHours, stageProportion, type StageGroup } from './production-process.helpers'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Production Process main panel — vertically-stacked sections, progressive disclosure:
//   1. Summary KPI strip         — answers "is this tech expensive overall?"
//   2. Overall pipeline           — stage-to-stage flow + per-stage rollup table
//   3. FEOL (step by step)        — flow diagram + step detail for this stage only
//   4. MOL (step by step)
//   5. BEOL (step by step)
//   6. Test (step by step)
//   7. Assembly (step by step)
// Each section's header is sticky (inherited from .ax-analysis_scroll), so as the planner scrolls,
// the current section's stage banner stays pinned at top until the next stage takes over.

const STAGE_TAG_COLOR: Record<ProcessStepStage, string> = {
  FEOL: 'geekblue',
  MOL: 'cyan',
  BEOL: 'purple',
  Test: 'gold',
  Assembly: 'green',
}

// Friendly stage names shown in section headers — "FEOL" alone is opaque to anyone outside fab ops.
const STAGE_FULL_NAME: Record<ProcessStepStage, string> = {
  FEOL: 'Front-End Of Line',
  MOL: 'Middle Of Line',
  BEOL: 'Back-End Of Line',
  Test: 'Wafer Test',
  Assembly: 'Assembly & Packaging',
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

const stageYield = (g: StageGroup) => g.steps.reduce((y, s) => y * s.expectedYield, 1)

// ----- KPI card --------------------------------------------------------------------------------
type KpiCardProps = { label: string; value: string; sub?: string; tone?: 'default' | 'warn' | 'good' }
const KpiCard = ({ label, value, sub, tone = 'default' }: KpiCardProps) => (
  <div className={`ax-process_kpi ax-process_kpi__${tone}`}>
    <div className="ax-process_kpi_label">{label}</div>
    <div className="ax-process_kpi_value">{value}</div>
    {sub && <div className="ax-process_kpi_sub">{sub}</div>}
  </div>
)

// ----- Stage overview card (flow diagram tile) ---------------------------------------------------
const StageOverviewCard = ({ group }: { group: StageGroup }) => {
  const clock = stageClockHours(group)
  const p = stageProportion(group)
  return (
    <div className="ax-process_overview_card">
      <div className="ax-process_overview_card_top">
        <Tag color={STAGE_TAG_COLOR[group.stage]} style={{ margin: 0 }}>
          {group.stage}
        </Tag>
        <span className="ax-process_overview_card_steps">
          {group.steps.length} step{group.steps.length === 1 ? '' : 's'}
        </span>
      </div>
      <div className="ax-process_overview_card_clock">{formatCycle(clock)}</div>
      <Tooltip
        title={
          <div style={{ whiteSpace: 'pre-line' }}>
            {[
              `Process · ${formatCycle(group.totalCycleHours)} (${p.process.toFixed(0)}%)`,
              group.totalMoveHours > 0 ? `Move · ${formatCycle(group.totalMoveHours)} (${p.move.toFixed(0)}%)` : null,
              group.totalWaitHours > 0 ? `Wait · ${formatCycle(group.totalWaitHours)} (${p.wait.toFixed(0)}%)` : null,
            ]
              .filter(Boolean)
              .join('\n')}
          </div>
        }
      >
        <div className="ax-process_overview_bar" aria-label="time composition">
          <div className="ax-process_overview_bar_seg ax-process_overview_bar_seg__process" style={{ width: `${p.process}%` }} />
          <div className="ax-process_overview_bar_seg ax-process_overview_bar_seg__move" style={{ width: `${p.move}%` }} />
          <div className="ax-process_overview_bar_seg ax-process_overview_bar_seg__wait" style={{ width: `${p.wait}%` }} />
        </div>
      </Tooltip>
    </div>
  )
}

// ----- Step tile (used by per-stage flow diagrams) ----------------------------------------------
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

// Inter-step / inter-stage transition chip with Move + Wait pills.
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

// ----- Tables ------------------------------------------------------------------------------------

// Stage-level rollup table — one row per stage, used in the Overall pipeline section.
const OverallStageTable = ({ stages }: { stages: StageGroup[] }) => (
  <table className="ax-analysis_table">
    <thead>
      <tr>
        <th>Stage</th>
        <th style={{ textAlign: 'right' }}>Steps</th>
        <th style={{ textAlign: 'right' }}>Cycle</th>
        <th style={{ textAlign: 'right' }}>Move</th>
        <th style={{ textAlign: 'right' }}>Wait</th>
        <th style={{ textAlign: 'right' }}>Clock</th>
        <th style={{ textAlign: 'right' }}>Yield</th>
      </tr>
    </thead>
    <tbody>
      {stages.map((g) => (
        <tr key={g.stage}>
          <td>
            <Tag color={STAGE_TAG_COLOR[g.stage]} style={{ margin: 0 }}>
              {g.stage}
            </Tag>
            <span style={{ marginLeft: 8 }}>{STAGE_FULL_NAME[g.stage]}</span>
          </td>
          <td style={{ textAlign: 'right' }}>{g.steps.length}</td>
          <td style={{ textAlign: 'right' }}>{formatCycle(g.totalCycleHours)}</td>
          <td style={{ textAlign: 'right' }}>{g.totalMoveHours > 0 ? formatCycle(g.totalMoveHours) : <span style={{ color: '#bfbfbf' }}>—</span>}</td>
          <td style={{ textAlign: 'right' }}>{g.totalWaitHours > 0 ? formatCycle(g.totalWaitHours) : <span style={{ color: '#bfbfbf' }}>—</span>}</td>
          <td style={{ textAlign: 'right' }}>
            <b>{formatCycle(stageClockHours(g))}</b>
          </td>
          <td style={{ textAlign: 'right' }}>{formatYield(stageYield(g))}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

// Per-stage step table — one row per step inside the stage, used in each per-stage section.
const StageStepTable = ({ steps, bottleneckStepId }: { steps: ProcessStep[]; bottleneckStepId: string | null }) => (
  <table className="ax-analysis_table">
    <thead>
      <tr>
        <th>#</th>
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
      {steps.map((step) => (
        <tr key={step.id}>
          <td>{step.order}</td>
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
)

// ----- Per-stage section (flow diagram + table) -------------------------------------------------
type StageSectionProps = {
  group: StageGroup
  bottleneckStepId: string | null
  onDrill: (toolGroup: string) => void
}
const StageSection = ({ group, bottleneckStepId, onDrill }: StageSectionProps) => {
  const clock = stageClockHours(group)
  return (
    <div className="ax-analysis_section">
      <div className="ax-analysis_section_header">
        <div className="ax-analysis_section_header_title">
          <Tag color={STAGE_TAG_COLOR[group.stage]} style={{ margin: 0 }}>
            {group.stage}
          </Tag>
          <span>{STAGE_FULL_NAME[group.stage]} · step by step</span>
        </div>
        <Typography.Text type="secondary" className="text-sm">
          {group.steps.length} step{group.steps.length === 1 ? '' : 's'} · {formatCycle(group.totalCycleHours)} process
          {group.totalMoveHours > 0 ? ` · ${formatCycle(group.totalMoveHours)} move` : ''}
          {group.totalWaitHours > 0 ? ` · ${formatCycle(group.totalWaitHours)} wait` : ''}
          {' · '}{formatCycle(clock)} clock · {formatYield(stageYield(group))} yield
        </Typography.Text>
      </div>
      <div className="ax-analysis_section_body">
        {/* Flow diagram — step tiles + inline transitions between steps in this stage */}
        <div className="ax-process_stage_section_row">
          {group.steps.map((step, sIdx) => (
            <div key={step.id} className="ax-process_pipeline_node">
              {renderStepTile(step, step.id === bottleneckStepId, onDrill)}
              {sIdx < group.steps.length - 1 &&
                renderTransition(
                  group.steps[sIdx + 1].movementHours,
                  group.steps[sIdx + 1].waitHours,
                  'inline',
                  `${step.name} → ${group.steps[sIdx + 1].name}`,
                )}
            </div>
          ))}
        </div>
        {/* Detail table for this stage's steps */}
        <div className="ax-process_stage_section_table">
          <StageStepTable steps={group.steps} bottleneckStepId={bottleneckStepId} />
        </div>
      </div>
    </div>
  )
}

// ===== Main panel ===============================================================================
export const MpsProductionProcessPipeline = observer(() => {
  const sim = useMpsContext()
  const process = sim.productionProcess
  const routing = TECH_ROUTINGS.find((t) => t.tech === process.selectedTech) ?? TECH_ROUTINGS[0]
  const drill = (toolGroup: string) => sim.navigateToToolGroup(toolGroup)

  // Bottleneck step = highest-utilisation tool group in this routing.
  let bottleneckStepId: string | null = null
  let bestRatio = 0
  let bottleneckStepName: string | null = null
  for (const step of routing.steps) {
    const r = tgUtil(step.toolGroup)
    if (r > bestRatio) {
      bestRatio = r
      bottleneckStepId = step.id
      bottleneckStepName = step.name
    }
  }

  const totalCycle = routing.steps.reduce((s, st) => s + st.cycleHours, 0)
  const totalMove = routing.steps.reduce((s, st) => s + st.movementHours, 0)
  const totalWait = routing.steps.reduce((s, st) => s + st.waitHours, 0)
  const totalClock = totalCycle + totalMove + totalWait
  const e2eYield = routing.steps.reduce((y, st) => y * st.expectedYield, 1)
  const stages = calcStageGroups(routing)
  const nonProcessPct = totalClock > 0 ? Math.round(((totalMove + totalWait) / totalClock) * 100) : 0

  return (
    <div className="ax-process_pipeline_wrap">
      {/* ===== 1. Summary KPI strip ============================================================ */}
      <div className="ax-process_kpis">
        <KpiCard
          label="End-to-end clock"
          value={formatCycle(totalClock)}
          sub={`Process ${formatCycle(totalCycle)} · +${nonProcessPct}% on top from move/wait`}
        />
        <KpiCard
          label="Stages × steps"
          value={`${stages.length} × ${routing.steps.length}`}
          sub={`${routing.layers}L ${routing.bitDensity} · ${routing.family}`}
        />
        <KpiCard
          label="Move + Wait"
          value={`${formatCycle(totalMove)} · ${formatCycle(totalWait)}`}
          sub="Transport between tools · queueing"
          tone={totalWait > totalMove ? 'warn' : 'default'}
        />
        <KpiCard
          label="End-to-end yield"
          value={formatYield(e2eYield)}
          sub={bottleneckStepName ? `Bottleneck · ${bottleneckStepName}` : undefined}
          tone={e2eYield < 0.9 ? 'warn' : 'good'}
        />
      </div>

      {/* ===== 2. Overall pipeline ============================================================= */}
      <div className="ax-analysis_section">
        <div className="ax-analysis_section_header">
          <div className="ax-analysis_section_header_title">
            <AxMuiIcon icon="mdiViewSequentialOutline" size={18} />
            <span>Overall pipeline · stage to stage</span>
          </div>
          <Typography.Text type="secondary" className="text-sm">
            Cards split process / move / wait. Wide amber = queue-bound stage.
          </Typography.Text>
        </div>
        <div className="ax-analysis_section_body">
          <div className="ax-process_overview">
            {stages.map((g, gIdx) => (
              <div key={g.stage} className="ax-process_overview_cell">
                <StageOverviewCard group={g} />
                {gIdx < stages.length - 1 &&
                  renderTransition(
                    stages[gIdx + 1].steps[0]?.movementHours ?? 0,
                    stages[gIdx + 1].steps[0]?.waitHours ?? 0,
                    'inline',
                    `${g.stage} → ${stages[gIdx + 1].stage}`,
                  )}
              </div>
            ))}
          </div>
          <div className="ax-process_overview_legend">
            <span className="ax-process_overview_legend_item">
              <span className="ax-process_overview_legend_swatch ax-process_overview_legend_swatch__process" />
              Process
            </span>
            <span className="ax-process_overview_legend_item">
              <span className="ax-process_overview_legend_swatch ax-process_overview_legend_swatch__move" />
              Move
            </span>
            <span className="ax-process_overview_legend_item">
              <span className="ax-process_overview_legend_swatch ax-process_overview_legend_swatch__wait" />
              Wait
            </span>
          </div>
          <div className="ax-process_stage_section_table">
            <OverallStageTable stages={stages} />
          </div>
        </div>
      </div>

      {/* ===== 3..N. Per-stage sections (FEOL → Assembly) ======================================= */}
      {stages.map((g) => (
        <StageSection key={g.stage} group={g} bottleneckStepId={bottleneckStepId} onDrill={drill} />
      ))}
    </div>
  )
})
