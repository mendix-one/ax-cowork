import { Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { calcTechSummaries, formatCycle, formatYield } from './production-process.helpers'

// Left rail — list of techs with rollup figures driven by the current Adjustment selection.
// Selecting a tech drives the pipeline + step detail on the right.
export const SimulationProductionProcessTechList = observer(() => {
  const sim = useSimulationContext()
  const process = sim.productionProcess
  const summaries = calcTechSummaries(sim.gantt.filteredOrders)

  return (
    <div className="ax-process_tech_list">
      <div className="ax-process_tech_list_header">Technology routings</div>
      <div className="ax-process_tech_list_body">
        {summaries.map((s) => {
          const isActive = s.tech === process.selectedTech
          return (
            <button key={s.tech} type="button" className={`ax-process_tech_card ${isActive ? 'is-active' : ''}`} onClick={() => process.selectTech(s.tech)}>
              <div className="ax-process_tech_card_top">
                <div className="ax-process_tech_card_title">{s.tech}</div>
                <Tag color={s.bitDensity === 'QLC' ? 'purple' : 'blue'} style={{ margin: 0 }}>
                  {s.bitDensity}
                </Tag>
              </div>
              <Typography.Text type="secondary" className="text-sm">
                {s.family} · {s.layers}L
              </Typography.Text>
              <div className="ax-process_tech_card_stats">
                <div>
                  <div className="ax-process_tech_card_stat_label">POs in plan</div>
                  <div className="ax-process_tech_card_stat_value">{s.poCount}</div>
                </div>
                <div>
                  <div className="ax-process_tech_card_stat_label">Wafers</div>
                  <div className="ax-process_tech_card_stat_value">{s.totalWafers.toLocaleString()}</div>
                </div>
                <div>
                  <div className="ax-process_tech_card_stat_label">Cycle</div>
                  <div className="ax-process_tech_card_stat_value">{formatCycle(s.totalCycleHours)}</div>
                </div>
                <div>
                  <div className="ax-process_tech_card_stat_label">E2E yield</div>
                  <div className="ax-process_tech_card_stat_value">{formatYield(s.endToEndYield)}</div>
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
