import { Tag, Tooltip, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { TECH_ROUTINGS, TOOL_GROUP_CAPACITIES, type ProcessStep, type ProcessStepStage } from '../../data/mock-plan'
import { formatCycle, formatYield } from './production-process.helpers'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Pipeline view — horizontal flow of step tiles (FEOL → MOL → BEOL → Test → Assembly).
// Each tile shows the step name, tool group, recipe, cycle time, yield, and (if applicable) a bottleneck pill.
// Below the pipeline a step-detail table lists the same info row-by-row for easy comparison and printing.

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

// Note: `StepTile` was inlined into the body of SimulationProductionProcessPipeline so the file only
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
  const e2eYield = routing.steps.reduce((y, st) => y * st.expectedYield, 1)

  return (
    <div className="ax-process_pipeline_wrap">
      <div className="ax-analysis_section">
        <div className="ax-analysis_section_header">
          <div className="ax-analysis_section_header_title">
            <AxMuiIcon icon="mdiSitemapOutline" size={18} />
            <span>{routing.tech} · {routing.family} pipeline</span>
          </div>
          <Typography.Text type="secondary" className="text-sm">
            {routing.layers}L {routing.bitDensity} · {routing.steps.length} steps · {formatCycle(totalCycle)} end-to-end · {formatYield(e2eYield)} expected yield
          </Typography.Text>
        </div>
        <div className="ax-analysis_section_body">
          <div className="ax-process_pipeline">
            {routing.steps.map((step, idx) => (
              <div key={step.id} className="ax-process_pipeline_node">
                {renderStepTile(step, step.id === bottleneckStepId, drill)}
                {idx < routing.steps.length - 1 && <AxMuiIcon icon="mdiChevronRight" size={20} className="ax-process_pipeline_arrow" />}
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
