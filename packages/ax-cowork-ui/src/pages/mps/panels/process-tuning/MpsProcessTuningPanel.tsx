import { Button, Descriptions, Flex, Progress, Segmented, Space, Tag, Typography } from 'antd'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../store/mps.context'
import type { TuneSuggestion } from './process-tuning.store'
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
    height: 140,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusSM,
    padding: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  chartLine: {
    position: 'absolute',
    left: 12,
    right: 12,
    height: 1,
    background: token.colorBorder,
  },
}))

const TuneItem = observer(({ s, active, onClick }: { s: TuneSuggestion; active: boolean; onClick: () => void }) => {
  const { styles, cx } = useStyles()
  return (
    <div className={cx(styles.item, active && styles.itemActive)} onClick={onClick}>
      <Flex justify="space-between" align="center">
        <Typography.Text strong>{s.id}</Typography.Text>
        <Tag color={s.direction === 'faster' ? 'green' : 'orange'}>
          Δ {s.delta > 0 ? '+' : ''}
          {s.delta.toFixed(1)}%
        </Tag>
      </Flex>
      <Typography.Text>{s.toolGroup} · {s.recipe}</Typography.Text>
      <div>
        <Typography.Text type="secondary" className="text-sm">
          Confidence {s.confidence}%
        </Typography.Text>
      </div>
    </div>
  )
})

const SpcChart = observer(({ spec, actual }: { spec: number; actual: number }) => {
  const { styles } = useStyles()
  return (
    <div className={styles.chart}>
      <Typography.Text type="secondary" style={{ fontSize: 11 }}>
        SPC run chart — last 90 days (mock)
      </Typography.Text>
      <div className={styles.chartLine} style={{ top: '36%' }} />
      <Typography.Text style={{ position: 'absolute', top: 22, right: 12, fontSize: 11 }} type="secondary">
        UCL
      </Typography.Text>
      <div className={styles.chartLine} style={{ top: '50%', background: '#1677ff', height: 2 }} />
      <Typography.Text style={{ position: 'absolute', top: 38, right: 12, fontSize: 11, color: '#1677ff' }}>spec {spec} min</Typography.Text>
      <div className={styles.chartLine} style={{ top: '64%', background: '#f5222d', borderStyle: 'dashed', borderBottom: '1px dashed #f5222d', height: 0 }} />
      <Typography.Text style={{ position: 'absolute', top: 70, right: 12, fontSize: 11, color: '#f5222d' }}>median {actual} min</Typography.Text>
      <div className={styles.chartLine} style={{ top: '80%' }} />
      <Typography.Text style={{ position: 'absolute', top: 90, right: 12, fontSize: 11 }} type="secondary">
        LCL
      </Typography.Text>
    </div>
  )
})

const TuneDetail = observer(({ s }: { s: TuneSuggestion }) => {
  return (
    <>
      <Typography.Title level={5} style={{ marginTop: 0 }}>
        TUNE {s.id} — {s.toolGroup} / Recipe {s.recipe}
      </Typography.Title>
      <Descriptions size="small" column={2} bordered>
        <Descriptions.Item label="Spec process time">{s.specMinutes} min/chamber</Descriptions.Item>
        <Descriptions.Item label="Actual median">
          {s.actualMinutes} min (last 90 days, n={s.sampleCount})
        </Descriptions.Item>
        <Descriptions.Item label="Suggested tune">
          {s.delta > 0 ? '+' : ''}
          {s.delta.toFixed(1)}% → {s.actualMinutes} min
        </Descriptions.Item>
        <Descriptions.Item label="Confidence">
          <Space>
            <Progress percent={s.confidence} size="small" style={{ width: 80 }} showInfo={false} />
            <span>{s.confidence}%</span>
          </Space>
        </Descriptions.Item>
      </Descriptions>

      <Typography.Title level={5} style={{ marginTop: 16 }}>
        SPC run chart — last 90 days
      </Typography.Title>
      <SpcChart spec={s.specMinutes} actual={s.actualMinutes} />

      <Typography.Title level={5} style={{ marginTop: 16 }}>
        Schedule impact if accepted
      </Typography.Title>
      <ul style={{ paddingInlineStart: 18, marginTop: 0 }}>
        {s.impact.map((i, idx) => (
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
          Send evidence to Process Eng
        </Button>
      </Space>

      <div style={{ marginTop: 12 }}>
        <Typography.Text type="secondary" className="text-sm">
          History: {s.id} raised by AI {s.raisedAt}
        </Typography.Text>
      </div>
    </>
  )
})

export const MpsProcessTuningPanel = observer((props: MainPanelControls) => {
  const { styles } = useStyles()
  const store = useMpsContext().processTuning
  return (
    <AxDisplayPanel type="main" icon="mdiTuneVerticalVariant" title="Process Tuning Logic" {...props}>
      <div className={styles.root}>
        <div className={styles.list}>
          <Segmented
            size="small"
            value={store.tab}
            onChange={(v) => store.setTab(v as 'pending' | 'accepted' | 'sent')}
            options={[
              { label: `Pending ${store.pending.length}`, value: 'pending' },
              { label: 'Accepted 12', value: 'accepted' },
              { label: 'Sent to PE 9', value: 'sent' },
            ]}
            block
            style={{ marginBottom: 12 }}
          />
          {store.pending.map((s) => (
            <TuneItem key={s.id} s={s} active={s.id === store.selectedId} onClick={() => store.select(s.id)} />
          ))}
        </div>
        <div className={styles.detail}>{store.selected ? <TuneDetail s={store.selected} /> : null}</div>
      </div>
    </AxDisplayPanel>
  )
})
