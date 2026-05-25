import { Button, Card, Flex, Progress, Space, Tag, Typography } from 'antd'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import type { BackgroundTask } from './background.store'
import { AxDisplayPanel, type SubPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

const useStyles = createStyles(({ token }) => ({
  root: {
    height: '100%',
    overflow: 'auto',
    padding: token.padding,
    background: token.colorBgContainer,
  },
  card: {
    marginBottom: token.padding,
  },
}))

function statusTag(s: BackgroundTask['status']) {
  if (s === 'running') return <Tag color="processing">⏳ Running</Tag>
  if (s === 'success') return <Tag color="green">✓ Success</Tag>
  if (s === 'warning') return <Tag color="orange">⚠ Warning</Tag>
  return <Tag color="red">✗ Failed</Tag>
}

const Item = observer(({ t }: { t: BackgroundTask }) => (
  <Card size="small" style={{ marginBottom: 8 }}>
    <Flex justify="space-between" align="center" wrap>
      <Space direction="vertical" size={0}>
        <Space size={6}>
          <Typography.Text strong>{t.label}</Typography.Text>
          {statusTag(t.status)}
        </Space>
        {t.trigger && (
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Trigger: {t.trigger}
          </Typography.Text>
        )}
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Started {t.startedAt}
          {t.duration ? ` — ${t.duration}` : ''}
        </Typography.Text>
        {t.result && <Typography.Text style={{ fontSize: 12 }}>Result: {t.result}</Typography.Text>}
      </Space>
      <Space direction="vertical" align="end">
        {t.status === 'running' && t.progress !== undefined && (
          <>
            <Progress percent={t.progress} size="small" style={{ width: 100 }} />
            {t.eta && (
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                ETA {t.eta}
              </Typography.Text>
            )}
          </>
        )}
        {t.status === 'running' && <Button size="small">Cancel</Button>}
        {t.action && <Button size="small">{t.action}</Button>}
      </Space>
    </Flex>
  </Card>
))

export const SimulationBackgroundPanel = observer((props: SubPanelControls) => {
  const { styles } = useStyles()
  const store = useSimulationContext().background
  return (
    <AxDisplayPanel type="sub" icon="mdiProgressStarFourPoints" title="Background Tasks" {...props}>
      <div className={styles.root}>
        <div className={styles.card}>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Running ({store.running.length})
          </Typography.Text>
          <div style={{ marginTop: 6 }}>
            {store.running.map((t) => (
              <Item key={t.id} t={t} />
            ))}
          </div>
        </div>
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Recent ({store.recent.length})
          </Typography.Text>
          <div style={{ marginTop: 6 }}>
            {store.recent.map((t) => (
              <Item key={t.id} t={t} />
            ))}
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
