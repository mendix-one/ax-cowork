import { Button, Flex, Progress, Space, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { utilColor } from './gantt-styles'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

const VIOLATIONS: { id: string; msg: string }[] = [
  { id: 'v1', msg: 'HARC Etch overload days 08–10' },
  { id: 'v2', msg: 'Probe over-capacity days 01–03' },
  { id: 'v3', msg: 'PO-119 M1 slip +2d (HARC overload)' },
]

export const SimulationGanttQuickAnalysis = observer(() => {
  const gantt = useSimulationContext().gantt
  return (
    <div className="ax-gantt_analysis">
      <div className="ax-gantt_analysis_header">
        <span>Quick Analysis</span>
        <Button
          size="small"
          type="text"
          className="ax-antd-button-icon-small"
          icon={<AxMuiIcon icon="mdiClose" size="1.15rem" />}
          onClick={() => gantt.toggleQuickAnalysis()}
        />
      </div>
      <div className="ax-gantt_analysis_body">
        <div className="ax-gantt_analysis_grid">
          <div className="ax-gantt_analysis_card">
            <div className="ax-gantt_analysis_title">Shop floor — overall capacity</div>
            <Flex align="center" justify="space-between" gap="small">
              <Typography.Text style={{ fontSize: 12 }}>Utilization</Typography.Text>
              <Typography.Text strong style={{ fontSize: 12, color: utilColor(74) }}>
                74%
              </Typography.Text>
            </Flex>
            <Progress percent={74} size="small" showInfo={false} strokeColor={utilColor(74)} />
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
              On-track range 60–80% · current horizon
            </Typography.Text>
          </div>
          <div className="ax-gantt_analysis_card">
            <div className="ax-gantt_analysis_title">Tool-group capacities</div>
            {gantt.workloadStrip.map((w) => (
              <div key={w.toolGroup} className="ax-gantt_analysis_row">
                <Typography.Text style={{ fontSize: 12 }}>{w.toolGroup}</Typography.Text>
                <Flex align="center" gap={6}>
                  <Progress percent={w.utilization} size="small" style={{ width: 80 }} showInfo={false} strokeColor={utilColor(w.utilization)} />
                  <Typography.Text style={{ fontSize: 12, color: utilColor(w.utilization) }} strong>
                    {w.utilization}%
                  </Typography.Text>
                </Flex>
              </div>
            ))}
          </div>
          <div className="ax-gantt_analysis_card">
            <div className="ax-gantt_analysis_title">Violations / high-load</div>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              {VIOLATIONS.map((v) => (
                <Flex key={v.id} align="center" gap={6}>
                  <Tag color="red" style={{ margin: 0 }}>
                    ⚠
                  </Tag>
                  <Typography.Text style={{ fontSize: 12 }}>{v.msg}</Typography.Text>
                </Flex>
              ))}
            </Space>
          </div>
        </div>
      </div>
    </div>
  )
})
