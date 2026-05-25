import { Fragment } from 'react'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { DAY_WIDTH, SIDEBAR_DATE, SIDEBAR_TASK, dayOffset } from './gantt-styles'
import { SimulationGanttToolbar } from './SimulationGanttToolbar'
import { SimulationGanttFilterSidebar } from './SimulationGanttFilterSidebar'
import { SimulationGanttQuickAnalysis } from './SimulationGanttQuickAnalysis'
import { SimulationGanttOrderRow } from './SimulationGanttOrderRow'
import { SimulationGanttFamilyRow } from './SimulationGanttFamilyRow'
import { SimulationGanttBatchRow } from './SimulationGanttBatchRow'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const SimulationGanttPanel = observer((props: MainPanelControls) => {
  const simulation = useSimulationContext()
  const gantt = simulation.gantt
  const anchor = gantt.horizonDates[0]
  const todayOffset = dayOffset(gantt.today, anchor)
  const todayInRange = todayOffset >= 0 && todayOffset < gantt.horizonDates.length

  return (
    <AxDisplayPanel type="main" icon="mdiChartGantt" title={simulation.activeSimulationPlan.name} tools={<SimulationGanttToolbar />} {...props}>
      <div className="ax-gantt">
        <div className="ax-gantt_body">
          {gantt.filterSidebarOpen && <SimulationGanttFilterSidebar />}
          <div className="ax-gantt_body_content">
            <div className="ax-gantt_scroll">
              <table className="ax-gantt_table">
                <thead>
                  {/* Row 1 — sidebar header (rowSpan 2) + month groups */}
                  <tr>
                    <th rowSpan={2} className="ax-gantt_header_sidebar" style={{ top: 0, left: 0, zIndex: 7, minWidth: SIDEBAR_TASK, width: SIDEBAR_TASK }}>
                      Production Order / Family / Batch
                    </th>
                    <th
                      rowSpan={2}
                      className="ax-gantt_header_sidebar"
                      style={{ top: 0, left: SIDEBAR_TASK, zIndex: 7, minWidth: SIDEBAR_DATE, width: SIDEBAR_DATE, textAlign: 'center' }}
                    >
                      Start Date
                    </th>
                    <th
                      rowSpan={2}
                      className="ax-gantt_header_sidebar"
                      style={{ top: 0, left: SIDEBAR_TASK + SIDEBAR_DATE, zIndex: 7, minWidth: SIDEBAR_DATE, width: SIDEBAR_DATE, textAlign: 'center' }}
                    >
                      End Date
                    </th>
                    {gantt.horizonMonthGroups.map((g, i) => (
                      <th key={`${g.month}-${i}`} colSpan={g.days} className="ax-gantt_header_cell" style={{ top: 0 }}>
                        {g.month}
                      </th>
                    ))}
                  </tr>
                  {/* Row 2 — day labels */}
                  <tr>
                    {gantt.horizonLabels.map((label, idx) => (
                      <th key={label + idx} className="ax-gantt_header_cell" style={{ top: 24, minWidth: DAY_WIDTH }}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gantt.filteredOrders.map((order) => (
                    <Fragment key={order.id}>
                      <SimulationGanttOrderRow order={order} anchor={anchor} />
                      {gantt.isExpanded(order.id) &&
                        order.schedule.map((family) => (
                          <Fragment key={family.id}>
                            <SimulationGanttFamilyRow family={family} anchor={anchor} />
                            {gantt.isFamilyExpanded(family.id) &&
                              family.batches.map((batch) => <SimulationGanttBatchRow key={batch.id} batch={batch} anchor={anchor} />)}
                          </Fragment>
                        ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
              {/* Today marker overlay */}
              {todayInRange && (
                <>
                  <div className="ax-gantt_today_line" style={{ left: SIDEBAR_TASK + SIDEBAR_DATE * 2 + todayOffset * DAY_WIDTH + DAY_WIDTH / 2 }} />
                  <div className="ax-gantt_today_badge" style={{ left: SIDEBAR_TASK + SIDEBAR_DATE * 2 + todayOffset * DAY_WIDTH + DAY_WIDTH / 2 }}>
                    TODAY
                  </div>
                </>
              )}
            </div>
            {gantt.quickAnalysisOpen && <SimulationGanttQuickAnalysis />}
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
