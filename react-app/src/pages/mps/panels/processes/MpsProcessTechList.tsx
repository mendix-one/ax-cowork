import { Tag, Tooltip, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../stores/mps.context'
import { calcTechSummaries, formatCycle, formatYield } from '../../helpers/process.helpers'

// Left rail — list of techs with rollup figures driven by the current Adjustment selection.
// Selecting a tech drives the pipeline + step detail on the right.
export const MpsProcessTechList = observer(() => {
  const sim = useMpsContext()
  const process = sim.process
  const summaries = calcTechSummaries(sim.simulation.filteredOrders)

  return (
    <div className="ax-mps-process_tech_list">
      <div className="ax-mps-process_tech_list_header">
        <span>Technology routings</span>
      </div>
      <div className="ax-mps-process_tech_list_body">
        {summaries.map((s) => {
          const isActive = s.tech === process.selectedTech
          return (
            <button key={s.tech} type="button" className={`ax-mps-process_tech_card ${isActive ? 'is-active' : ''}`} onClick={() => process.selectTech(s.tech)}>
              <div className="ax-mps-process_tech_card_top">
                <div className="ax-mps-process_tech_card_title">{s.tech}</div>
                <Tag color={s.bitDensity === 'QLC' ? 'purple' : 'blue'} style={{ margin: 0 }}>
                  {s.bitDensity}
                </Tag>
              </div>
              <Typography.Text type="secondary" className="text-sm">
                {s.family} · {s.layers}L
              </Typography.Text>
              <div className="ax-mps-process_tech_card_stats">
                <div>
                  <div className="ax-mps-process_tech_card_stat_label">POs in plan</div>
                  <div className="ax-mps-process_tech_card_stat_value">{s.poCount}</div>
                </div>
                <div>
                  <div className="ax-mps-process_tech_card_stat_label">Wafers</div>
                  <div className="ax-mps-process_tech_card_stat_value">{s.totalWafers.toLocaleString()}</div>
                </div>
                <div>
                  <Tooltip
                    title={`Processing ${formatCycle(s.totalCycleHours)} · Move ${formatCycle(s.totalMoveHours)} · Wait ${formatCycle(s.totalWaitHours)}`}
                  >
                    <div className="ax-mps-process_tech_card_stat_label">End-to-end</div>
                    <div className="ax-mps-process_tech_card_stat_value">{formatCycle(s.totalClockHours)}</div>
                  </Tooltip>
                </div>
                <div>
                  <div className="ax-mps-process_tech_card_stat_label">E2E yield</div>
                  <div className="ax-mps-process_tech_card_stat_value">{formatYield(s.endToEndYield)}</div>
                </div>
              </div>
              {s.bottleneckStep && (
                <Tag color="orange" style={{ margin: 0, alignSelf: 'flex-start' }}>
                  Bottleneck · {s.bottleneckStep}
                </Tag>
              )}
              {/* The card itself selects the tech (via the surrounding <button>) — bottleneck drill-through to */}
              {/* Shop Floor is handled on the pipeline tile, keeping this card focused on tech selection. */}
            </button>
          )
        })}
      </div>
    </div>
  )
})
