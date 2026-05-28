import { Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../store/mps.context'
import { calcMilestoneRows } from './analysis.helpers'
import type { MilestoneState } from '../../data/mock-plan'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

const STATE_TAG: Record<MilestoneState, { color: string; label: string }> = {
  new: { color: 'cyan', label: 'New' },
  normal: { color: 'blue', label: 'On track' },
  late: { color: 'orange', label: 'Late' },
  cannot: { color: 'red', label: 'Cannot' },
}

// Shipment milestone analysis — one row per milestone across all visible POs.
// Sorted by date so the operator sees the next commitment at the top.
export const MpsAnalysisMilestones = observer(() => {
  const orders = useMpsContext().gantt.filteredOrders
  const rows = calcMilestoneRows(orders)

  return (
    <div className="ax-analysis_section">
      <div className="ax-analysis_section_header">
        <div className="ax-analysis_section_header_title">
          <AxMuiIcon icon="mdiCalendarCheckOutline" size={18} />
          <span>Shipment milestone analysis ({rows.length})</span>
        </div>
      </div>
      <div className="ax-analysis_section_body">
        {rows.length === 0 ? (
          <Typography.Text type="secondary">No milestones in the current selection.</Typography.Text>
        ) : (
          <table className="ax-analysis_table">
            <thead>
              <tr>
                <th>Date</th>
                <th>PO</th>
                <th>Cust</th>
                <th>Milestone</th>
                <th>PF</th>
                <th style={{ textAlign: 'right' }}>Wafers</th>
                <th>State</th>
                <th>Slip</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.poId}::${r.label}::${r.date}`}>
                  <td>{r.date}</td>
                  <td>
                    <b>{r.poId}</b>
                  </td>
                  <td>{r.customerShort}</td>
                  <td>{r.label}</td>
                  <td>{r.pfList.join(', ') || '—'}</td>
                  <td style={{ textAlign: 'right' }}>{r.wafers.toLocaleString()}</td>
                  <td>
                    <Tag color={STATE_TAG[r.state].color} style={{ margin: 0 }}>
                      {STATE_TAG[r.state].label}
                    </Tag>
                  </td>
                  <td>
                    {r.slipDays > 0 ? (
                      <Tag color={r.slipDays > 2 ? 'red' : 'orange'} style={{ margin: 0 }}>
                        +{r.slipDays}d{r.cause ? ` · ${r.cause}` : ''}
                      </Tag>
                    ) : (
                      <Tag color="green" style={{ margin: 0 }}>
                        ok
                      </Tag>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
})
