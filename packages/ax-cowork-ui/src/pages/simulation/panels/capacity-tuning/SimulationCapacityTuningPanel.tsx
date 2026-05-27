import { Button, Descriptions, Flex, Progress, Segmented, Space, Tag, Typography } from 'antd'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import type { CapacityTune } from './capacity-tuning.store'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

const useStyles = createStyles(({ token }) => ({
  root: {
    height: '100%',
    display: 'flex',
    overflow: 'hidden',
    background: token.colorBgContainer,
  },
  list: {
    width: 320,
    padding: token.padding,
    overflow: 'auto',
    borderRight: `1px solid ${token.colorBorderSecondary}`,
  },
  detail: {
    flex: 1,
    minWidth: 0,
    padding: token.padding,
    overflow: 'auto',
  },
  item: {
    padding: 8,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusSM,
    marginBottom: 8,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  itemActive: {
    background: token.colorPrimaryBg,
    borderColor: token.colorPrimary,
  },
  chart: {
    height: 160,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusSM,
    padding: 12,
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
    gap: 4,
  },
  bar: {
    flex: 1,
    background: token.colorPrimary,
    borderRadius: 2,
    minHeight: 4,
  },
}))

const TrendChart = observer(({ trend, modeled }: { trend: number[]; modeled: number }) => {
  const { styles } = useStyles()
  const max = Math.max(...trend, modeled) * 1.05
  const min = Math.min(...trend, modeled) * 0.95
  return (
    <div className={styles.chart}>
      <Typography.Text style={{ position: 'absolute', top: 6, left: 12, fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>
        Realized WSPM — last 12 weeks (mock)
      </Typography.Text>
      {trend.map((v, i) => {
        const h = ((v - min) / (max - min)) * 100
        return <div key={i} className={styles.bar} style={{ height: `${Math.max(6, h)}%` }} title={`wk${i + 1}: ${v.toLocaleString()}`} />
      })}
    </div>
  )
})

const Item = observer(({ t, active, onClick }: { t: CapacityTune; active: boolean; onClick: () => void }) => {
  const { styles, cx } = useStyles()
  return (
    <div className={cx(styles.item, active && styles.itemActive)} onClick={onClick}>
      <Flex justify="space-between" align="center">
        <Typography.Text strong>{t.id}</Typography.Text>
        <Tag color={t.deltaPct > 0 ? 'green' : 'orange'}>
          Δ {t.deltaPct > 0 ? '+' : ''}
          {t.deltaPct.toFixed(1)}%
        </Tag>
      </Flex>
      <Typography.Text>{t.toolGroup}</Typography.Text>
      <div>
        <Typography.Text type="secondary" className="text-sm">
          Confidence {t.confidence}%
        </Typography.Text>
      </div>
    </div>
  )
})

const Detail = observer(({ t }: { t: CapacityTune }) => (
  <>
    <Typography.Title level={5} style={{ marginTop: 0 }}>
      TUNE {t.id} — {t.toolGroup}
    </Typography.Title>
    <Descriptions size="small" column={2} bordered>
      <Descriptions.Item label="Modeled effective capacity">{t.modeledWspm.toLocaleString()} WSPM</Descriptions.Item>
      <Descriptions.Item label="Realized (12-wk avg)">
        {t.realizedWspm.toLocaleString()} WSPM ({t.deltaPct > 0 ? '+' : ''}
        {t.deltaPct.toFixed(1)}%)
      </Descriptions.Item>
      <Descriptions.Item label="Suggested tune">{t.realizedWspm.toLocaleString()} WSPM</Descriptions.Item>
      <Descriptions.Item label="Confidence">
        <Space>
          <Progress percent={t.confidence} size="small" style={{ width: 80 }} showInfo={false} />
          <span>{t.confidence}%</span>
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label="Driver hypothesis" span={2}>
        {t.driverHypothesis}
      </Descriptions.Item>
    </Descriptions>

    <Typography.Title level={5} style={{ marginTop: 16 }}>
      Realized WSPM — last 12 weeks
    </Typography.Title>
    <TrendChart trend={t.trend} modeled={t.modeledWspm} />

    <Typography.Title level={5} style={{ marginTop: 16 }}>
      Schedule impact if accepted
    </Typography.Title>
    <ul style={{ paddingInlineStart: 18, marginTop: 0 }}>
      {t.impact.map((i, idx) => (
        <li key={idx}>
          <Typography.Text>{i}</Typography.Text>
        </li>
      ))}
    </ul>

    <Space style={{ marginTop: 16 }}>
      <Button type="primary" size="small" icon={<AxMuiIcon icon="mdiCheck" size={14} />}>
        Accept tune
      </Button>
      <Button size="small" icon={<AxMuiIcon icon="mdiClose" size={14} />}>
        Reject
      </Button>
      <Button size="small" icon={<AxMuiIcon icon="mdiSend" size={14} />}>
        Send evidence to Equip Eng
      </Button>
    </Space>
  </>
))

export const SimulationCapacityTuningPanel = observer((props: MainPanelControls) => {
  const { styles } = useStyles()
  const store = useSimulationContext().capacityTuning
  return (
    <AxDisplayPanel type="main" icon="mdiCogTransferOutline" title="Capacity Tuning Logic" {...props}>
      <div className={styles.root}>
        <div className={styles.list}>
          <Segmented
            size="small"
            value={store.tab}
            onChange={(v) => store.setTab(v as 'pending' | 'accepted' | 'sent')}
            options={[
              { label: `Pending ${store.pending.length}`, value: 'pending' },
              { label: 'Accepted 6', value: 'accepted' },
              { label: 'Sent to EE 3', value: 'sent' },
            ]}
            block
            style={{ marginBottom: 12 }}
          />
          {store.pending.map((t) => (
            <Item key={t.id} t={t} active={t.id === store.selectedId} onClick={() => store.select(t.id)} />
          ))}
        </div>
        <div className={styles.detail}>{store.selected ? <Detail t={store.selected} /> : null}</div>
      </div>
    </AxDisplayPanel>
  )
})
