import { Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { calcFamilyTechRows } from './analysis.helpers'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Production Family × Spec/Tech analysis. The mock data only carries `tech` per family — we surface it
// alongside the family code as a (tech, family) row and aggregate PO count, batch count, and wafer total.
// Useful as a "what is currently planned to be built, grouped by recipe" rollup.
export const SimulationAnalysisFamilyTech = observer(() => {
  const orders = useSimulationContext().gantt.filteredOrders
  const rows = calcFamilyTechRows(orders)

  return (
    <div className="ax-analysis_section">
      <div className="ax-analysis_section_header">
        <div className="ax-analysis_section_header_title">
          <AxMuiIcon icon="mdiFamilyTree" size={18} />
          <span>Production Family · Spec / Tech analysis</span>
        </div>
      </div>
      <div className="ax-analysis_section_body">
        {rows.length === 0 ? (
          <Typography.Text type="secondary">No families in the current selection.</Typography.Text>
        ) : (
          <table className="ax-analysis_table">
            <thead>
              <tr>
                <th>Tech</th>
                <th>Family</th>
                <th style={{ textAlign: 'right' }}>POs</th>
                <th style={{ textAlign: 'right' }}>Batches</th>
                <th style={{ textAlign: 'right' }}>Wafers</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.tech}::${r.family}`}>
                  <td>
                    <b>{r.tech}</b>
                  </td>
                  <td>{r.family}</td>
                  <td style={{ textAlign: 'right' }}>{r.poCount}</td>
                  <td style={{ textAlign: 'right' }}>{r.batchCount}</td>
                  <td style={{ textAlign: 'right' }}>{r.totalWafers.toLocaleString()}</td>
                  <td>{r.earliestStart}</td>
                  <td>{r.latestEnd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
})
