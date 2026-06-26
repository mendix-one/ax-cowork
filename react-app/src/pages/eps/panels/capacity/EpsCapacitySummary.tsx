import { Card, Col, Flex, Progress, Row, Statistic, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

const LEVEL_LABEL: Record<string, string> = {
  division: 'Department',
  site: 'Site',
  team: 'Team',
  group: 'Group',
  part: 'Part',
  cell: 'Cell',
}

// Headcount summary box for the selected org node — totals + the engineering-skills distribution that the
// portfolio is aligned to. Read-only: the numbers are master data rolled up from the Cells beneath the node.
export const EpsCapacitySummary = observer(() => {
  const store = useEpsContext().capacity
  const meta = store.selectedMeta
  const cells = store.selectedCells
  const skills = store.selectedSkillTotals
  const top = skills[0]

  return (
    <Card
      size="small"
      title={
        <Flex align="center" gap={8}>
          <span>{meta?.label ?? 'Organization'}</span>
          {meta && <Tag color="blue">{LEVEL_LABEL[meta.level] ?? meta.level}</Tag>}
        </Flex>
      }
      extra={
        <Flex align="center" gap={6}>
          <AxMuiIcon icon="mdiSyncCircle" size={15} color="#52c41a" />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Synced from {store.source} · {store.syncedAt}
          </Typography.Text>
        </Flex>
      }
    >
      <Row gutter={[16, 8]}>
        <Col xs={12} sm={6}>
          <Statistic title="Total headcount" value={store.selectedHeadcount} suffix="HC" />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic title="Org units (cells)" value={cells.length} />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic title="Distinct skills" value={skills.length} />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic title="Top skill" value={top?.skill ?? '—'} valueStyle={{ fontSize: 18 }} suffix={top ? `· ${top.count}` : ''} />
        </Col>
      </Row>

      <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', margin: '12px 0 6px' }}>
        Engineering-skills distribution
      </Typography.Text>
      <Flex vertical gap={4}>
        {skills.map((s) => (
          <Flex key={s.skill} align="center" gap={10}>
            <Typography.Text style={{ width: 120, fontSize: 12 }} ellipsis>
              {s.skill}
            </Typography.Text>
            <Progress percent={Math.round(s.share * 100)} size="small" style={{ flex: 1, margin: 0 }} format={(p) => `${p}%`} />
            <Typography.Text strong style={{ width: 36, textAlign: 'right' }}>
              {s.count}
            </Typography.Text>
          </Flex>
        ))}
      </Flex>
    </Card>
  )
})
