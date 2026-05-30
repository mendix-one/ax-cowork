import { useMemo } from 'react'
import { Alert, Button, Modal, Space, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../stores/mps.context'
import { runPreflight, summarize, type PreflightFinding } from '../helpers/preflight.helpers'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Save-time confirmation modal. Runs pre-flight validators against the current plan + constraints and shows
// pass / warning / critical findings, each with optional drill-through. The planner can "Save anyway",
// "Fix first" (closes modal and drills to the first critical issue), or cancel.
export type MpsPreflightModalProps = {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  // Caller-supplied label, e.g. "Save Gantt plan" / "Save Production Order edits".
  actionLabel?: string
}

const SEVERITY_COLOR: Record<PreflightFinding['severity'], string> = {
  pass: 'green',
  warning: 'orange',
  critical: 'red',
}

export const MpsPreflightModal = observer((props: MpsPreflightModalProps) => {
  const sim = useMpsContext()
  // Modal only renders when `open` flips true; computing findings each render is fine. The memo keeps it
  // stable when the user is just hovering the modal (the orders array reference is observable via MobX).
  const findings = useMemo(() => runPreflight({ orders: sim.simulation.orders }), [sim.simulation.orders])
  const summary = summarize(findings)

  const drill = (f: PreflightFinding) => {
    if (!f.drillTarget) return
    if (f.drillTarget.kind === 'toolGroup') sim.navigateToToolGroup(f.drillTarget.name)
    else sim.navigateToOrder(f.drillTarget.id)
    props.onCancel()
  }

  const firstCritical = findings.find((f) => f.severity === 'critical')

  const banner = summary.ok ? (
    <Alert type="success" message="All validators passed" description="No capacity overloads, constraint overlaps, or shape issues detected. Safe to save." showIcon style={{ marginBottom: 12 }} />
  ) : summary.critical > 0 ? (
    <Alert
      type="error"
      message={`${summary.critical} critical issue${summary.critical > 1 ? 's' : ''} · ${summary.warning} warning${summary.warning !== 1 ? 's' : ''}`}
      description="Saving may publish a plan that violates capacity or known constraints. Review the list below."
      showIcon
      style={{ marginBottom: 12 }}
    />
  ) : (
    <Alert type="warning" message={`${summary.warning} warning${summary.warning > 1 ? 's' : ''}`} description="Plan is not strictly invalid but the planner should review the items below." showIcon style={{ marginBottom: 12 }} />
  )

  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      width={720}
      title={
        <Space>
          <AxMuiIcon icon="mdiShieldCheckOutline" size={18} />
          <span>Pre-flight check · {props.actionLabel ?? 'Save plan'}</span>
        </Space>
      }
      footer={
        <Space>
          <Button onClick={props.onCancel}>Cancel</Button>
          {firstCritical && (
            <Button danger onClick={() => drill(firstCritical)}>
              Fix first issue
            </Button>
          )}
          <Button type="primary" danger={summary.critical > 0} onClick={props.onConfirm}>
            {summary.ok ? 'Save' : summary.critical > 0 ? 'Save anyway' : 'Save'}
          </Button>
        </Space>
      }
    >
      {banner}
      {findings.length === 0 ? null : (
        <table className="ax-mps-analysis_table">
          <thead>
            <tr>
              <th style={{ width: 110 }}>Severity</th>
              <th style={{ width: 110 }}>Category</th>
              <th>Title</th>
              <th>Detail</th>
              <th style={{ width: 100 }} />
            </tr>
          </thead>
          <tbody>
            {findings.map((f) => (
              <tr key={f.id}>
                <td>
                  <Tag color={SEVERITY_COLOR[f.severity]} style={{ margin: 0 }}>
                    {f.severity}
                  </Tag>
                </td>
                <td>{f.category}</td>
                <td>
                  <b>{f.title}</b>
                </td>
                <td>
                  <Typography.Text className="text-sm">{f.detail}</Typography.Text>
                </td>
                <td>
                  {f.drillTarget && (
                    <Button size="small" type="link" onClick={() => drill(f)}>
                      Open
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Modal>
  )
})
