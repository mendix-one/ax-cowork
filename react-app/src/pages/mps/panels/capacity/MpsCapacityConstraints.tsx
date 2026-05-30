import { Segmented, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../stores/mps.context'
import type { ConstraintKind, ConstraintSeverity } from '../../data/mock-plan'
import { allConstraints, constraintsFor } from '../../helpers/capacity.helpers'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

const KIND_LABEL: Record<ConstraintKind, string> = {
  pm: 'PM',
  'qual-expiry': 'Qual',
  downtime: 'Down',
  'ramp-up': 'Ramp',
  'recipe-lock': 'Lock',
}

const SEVERITY_COLOR: Record<ConstraintSeverity, string> = {
  info: 'blue',
  warning: 'orange',
  critical: 'red',
}

const KIND_ICON: Record<ConstraintKind, string> = {
  pm: 'mdiWrenchOutline',
  'qual-expiry': 'mdiShieldAlertOutline',
  downtime: 'mdiAlertOctagonOutline',
  'ramp-up': 'mdiTrendingUp',
  'recipe-lock': 'mdiLockOutline',
}

// Constraints panel — surfaces PM windows, qual expirations, downtime, ramp-ups, recipe locks that
// affect the plan. Scope toggle: "Selected group" (default — focuses the planner on what's relevant
// to the tool they're looking at) vs "All shop" (the cross-floor view).
export const MpsCapacityConstraints = observer(() => {
  const store = useMpsContext().capacity
  const group = store.selectedGroup
  const scopedToGroup = store.constraintsScope === 'group'
  const items = scopedToGroup && group ? constraintsFor(group.name) : allConstraints()

  return (
    <div className="ax-mps-analysis_section">
      <div className="ax-mps-analysis_section_header">
        <div className="ax-mps-analysis_section_header_title">
          <AxMuiIcon icon="mdiAlertOctagonOutline" size={18} />
          <span>Constraints ({items.length})</span>
        </div>
        <Segmented
          size="small"
          value={store.constraintsScope}
          onChange={(v) => store.setConstraintsScope(v as 'group' | 'all')}
          options={[
            { label: 'Selected group', value: 'group' },
            { label: 'All shop', value: 'all' },
          ]}
        />
      </div>
      <div className="ax-mps-analysis_section_body">
        {items.length === 0 ? (
          <Typography.Text type="secondary">No constraints in scope.</Typography.Text>
        ) : (
          <table className="ax-mps-analysis_table">
            <thead>
              <tr>
                <th>When</th>
                <th>Kind</th>
                <th>Tool group</th>
                <th>Tool</th>
                <th>Title</th>
                <th>Detail</th>
                <th style={{ textAlign: 'right' }}>Impact</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => {
                const dateLabel = c.start === c.end ? c.start : `${c.start} → ${c.end}`
                const impactPct = Math.round(c.impactRatio * 100)
                return (
                  <tr key={c.id}>
                    <td>{dateLabel}</td>
                    <td>
                      <Tag color={SEVERITY_COLOR[c.severity]} style={{ margin: 0 }}>
                        <AxMuiIcon icon={KIND_ICON[c.kind] as never} size={12} /> {KIND_LABEL[c.kind]}
                      </Tag>
                    </td>
                    <td>{c.toolGroup}</td>
                    <td>{c.toolId ?? '—'}</td>
                    <td>
                      <b>{c.title}</b>
                    </td>
                    <td>{c.detail}</td>
                    <td style={{ textAlign: 'right' }}>
                      {c.impactRatio === 0 ? (
                        <span style={{ color: 'rgba(0,0,0,0.35)' }}>—</span>
                      ) : c.impactRatio < 0 ? (
                        <span style={{ color: '#52c41a' }}>+{Math.abs(impactPct)}%</span>
                      ) : (
                        <span style={{ color: '#f44336' }}>-{impactPct}%</span>
                      )}
                    </td>
                    <td>
                      <Tag color={SEVERITY_COLOR[c.severity]} style={{ margin: 0 }}>
                        {c.severity}
                      </Tag>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
})
