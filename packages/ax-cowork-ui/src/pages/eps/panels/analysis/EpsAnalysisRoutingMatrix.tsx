import { Tag, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { TECH_ROUTINGS, TOOL_GROUP_CAPACITIES } from '../../data/mock-plan'
import { calcRoutingMatrix, formatCycle } from '../../helpers/process.helpers'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Routing matrix — tech × tool group. Each cell shows total cycle hours of any step on that group,
// or "—" if the tech doesn't use that group. Helps the planner see flexibility at a glance:
// fewer empty columns means more techs compete for the same group (sharper contention).
// Lives in the Analysis view alongside the family/tech rollups since it's a tech-level snapshot of
// the same data the analysis charts visualise; the Production Process view focuses on the per-tech
// pipeline rather than the cross-tech contention picture.
export const EpsAnalysisRoutingMatrix = observer(() => {
  const matrix = calcRoutingMatrix()
  return (
    <div className="ax-eps-analysis_section">
      <div className="ax-eps-analysis_section_header">
        <div className="ax-eps-analysis_section_header_title">
          <AxMuiIcon icon="mdiSwapHorizontalVariant" size={18} />
          <span>Routing matrix · Tech × Tool group</span>
        </div>
      </div>
      <div className="ax-eps-analysis_section_body" style={{ overflowX: 'auto' }}>
        <table className="ax-eps-analysis_table">
          <thead>
            <tr>
              <th>Tech</th>
              {TOOL_GROUP_CAPACITIES.map((tg) => (
                <th key={tg.name} style={{ textAlign: 'center' }}>
                  {tg.name}
                </th>
              ))}
              <th style={{ textAlign: 'right' }}>Total cycle</th>
            </tr>
          </thead>
          <tbody>
            {TECH_ROUTINGS.map((routing, rowIdx) => {
              const totalHours = routing.steps.reduce((s, st) => s + st.cycleHours, 0)
              return (
                <tr key={routing.tech}>
                  <td>
                    <b>{routing.tech}</b>
                    <div className="text-sm text-neutral-500">{routing.family}</div>
                  </td>
                  {matrix[rowIdx].map((cell) => (
                    <td key={cell.toolGroup} style={{ textAlign: 'center' }}>
                      {cell.stepNames.length === 0 ? (
                        <span style={{ color: 'rgba(0,0,0,0.25)' }}>—</span>
                      ) : (
                        <Tooltip title={cell.stepNames.join(', ')}>
                          <Tag color="blue" style={{ margin: 0 }}>
                            {formatCycle(cell.cycleHours)}
                          </Tag>
                        </Tooltip>
                      )}
                    </td>
                  ))}
                  <td style={{ textAlign: 'right' }}>
                    <b>{formatCycle(totalHours)}</b>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
})
