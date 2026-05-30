import { Button, Card, Collapse, Flex, Space, Tag, Typography } from 'antd'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../stores/mps.context'
import type { Recommendation } from '../../stores/recommendations.store'
import { AxDisplayPanel, type SubPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

const useStyles = createStyles(({ token }) => ({
  root: {
    height: '100%',
    overflow: 'auto',
    padding: token.padding,
    background: token.colorBgContainer,
  },
  card: {
    marginBottom: 8,
  },
}))

const priorityColor = (p: Recommendation['priority']) => (p === 'HIGH' ? 'red' : p === 'MED' ? 'orange' : 'default')

const RecCard = observer(({ r }: { r: Recommendation }) => {
  const { styles } = useStyles()
  return (
    <Card size="small" className={styles.card}>
      <Flex justify="space-between" align="flex-start" gap="small" wrap>
        <div style={{ minWidth: 0 }}>
          <Space size={6} align="center">
            <Tag color={priorityColor(r.priority)}>{r.priority}</Tag>
            <span style={{ color: '#faad14' }}>{'★'.repeat(r.stars)}</span>
            <Typography.Text strong>{r.title}</Typography.Text>
          </Space>
          <div>
            <Typography.Text style={{ fontSize: 12 }}>{r.description}</Typography.Text>
          </div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Impact: {r.impact}
          </Typography.Text>
        </div>
        <Space direction="vertical" size={4} align="end">
          {r.action === 'preview' && <Button size="small">Preview</Button>}
          {r.action === 'open' && <Button size="small">Open</Button>}
          <Button size="small" type="text">
            Skip
          </Button>
        </Space>
      </Flex>
    </Card>
  )
})

export const MpsRecommendationsPanel = observer((props: SubPanelControls) => {
  const { styles } = useStyles()
  const store = useMpsContext().recommendations
  return (
    <AxDisplayPanel type="sub" icon="mdiLightbulbOnOutline" title="Recommendations" {...props}>
      <div className={styles.root}>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          New ({store.recommendations.length})
        </Typography.Text>
        <div style={{ marginTop: 6 }}>
          {store.recommendations.map((r) => (
            <RecCard key={r.id} r={r} />
          ))}
        </div>
        <Collapse
          size="small"
          ghost
          items={[
            {
              key: 'skipped',
              label: `Skipped (${store.skippedCount})`,
              children: (
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Dismissed recommendations train the AI to suppress similar items.
                </Typography.Text>
              ),
            },
          ]}
        />
      </div>
    </AxDisplayPanel>
  )
})
