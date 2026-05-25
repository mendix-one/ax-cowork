import { Button, Card, Flex, Select, Space, Statistic, Tag, Typography } from 'antd'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { AxDisplayPanel, type SubPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

const useStyles = createStyles(({ token }) => ({
  root: {
    padding: token.padding,
    height: '100%',
    overflow: 'auto',
    background: token.colorBgContainer,
  },
  ganttPlaceholder: {
    height: 220,
    background: token.colorFillAlter,
    border: `1px dashed ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusSM,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: token.colorTextSecondary,
    marginBottom: token.padding,
  },
}))

export const SimulationComparePanel = observer((props: SubPanelControls) => {
  const { styles } = useStyles()
  const simulation = useSimulationContext()
  const compare = simulation.compare
  const planOptions = simulation.simulationPlans.map((p) => ({ value: p.id, label: p.name }))

  return (
    <AxDisplayPanel type="sub" icon="mdiBookOpenOutline" title="Compare / Split" {...props}>
      <div className={styles.root}>
        <Space size={6} style={{ marginBottom: 12 }} wrap>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Right plan:
          </Typography.Text>
          <Select size="small" value={compare.rightPlanId} onChange={(v) => compare.setRightPlan(v)} options={planOptions} style={{ width: 200 }} />
        </Space>

        <div className={styles.ganttPlaceholder}>
          <Space direction="vertical" align="center">
            <AxMuiIcon icon="mdiChartGantt" size={32} />
            <Typography.Text>Gantt — Plan B (AI-proposed 06:14)</Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Synchronized scroll with the left plan
            </Typography.Text>
          </Space>
        </div>

        <Card size="small" title="Diff summary" style={{ marginBottom: 12 }}>
          <Flex gap="middle" wrap>
            <Statistic title="Commits at risk" value="1" suffix={<Tag color="green">−2</Tag>} valueStyle={{ fontSize: 18 }} />
            <Statistic title="Bottleneck util" value="76%" suffix={<Tag color="green">−13%</Tag>} valueStyle={{ fontSize: 18 }} />
            <Statistic title="Plan adherence" value="91%" suffix={<Tag color="green">+4%</Tag>} valueStyle={{ fontSize: 18 }} />
            <Statistic title="Lots affected" value="18" valueStyle={{ fontSize: 18 }} />
          </Flex>
        </Card>

        <Card size="small" title={`Changes (${compare.diffs.length})`}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {compare.diffs.map((d) => (
              <Flex key={d.id} justify="space-between" align="center" gap="small">
                <Typography.Text style={{ fontSize: 12 }}>• {d.text}</Typography.Text>
                <Tag color="default">{d.reason}</Tag>
              </Flex>
            ))}
          </Space>
        </Card>

        <Space style={{ marginTop: 16 }}>
          <Button size="small">Discard Plan B</Button>
          <Button size="small">Edit Plan B</Button>
          <Button type="primary" size="small">
            Commit Plan B → publish
          </Button>
        </Space>
      </div>
    </AxDisplayPanel>
  )
})
