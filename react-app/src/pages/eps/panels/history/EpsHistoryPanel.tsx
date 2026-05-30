import { Button, Card, Flex, Select, Space, Tag, Typography } from 'antd'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import type { HistoryEntry } from '../../stores/history.store'
import { AxDisplayPanel, type SubPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

const useStyles = createStyles(({ token }) => ({
  root: {
    height: '100%',
    overflow: 'auto',
    padding: token.padding,
    background: token.colorBgContainer,
  },
  group: {
    fontSize: 12,
    color: token.colorTextSecondary,
    margin: `${token.padding}px 0 ${token.paddingXS}px`,
    fontWeight: 600,
  },
}))

const typeMeta = (e: HistoryEntry) => {
  if (e.type === 'commit') return { color: 'blue', icon: 'mdiContentSaveOutline' as const, label: 'commit' }
  if (e.type === 'tune') return { color: 'purple', icon: 'mdiTuneVerticalVariant' as const, label: 'tune' }
  if (e.type === 'import') return { color: 'cyan', icon: 'mdiTrayArrowDown' as const, label: 'import' }
  return { color: 'orange', icon: 'mdiCreationOutline' as const, label: 'replan' }
}

const Entry = observer(({ e }: { e: HistoryEntry }) => {
  const meta = typeMeta(e)
  return (
    <Card size="small" style={{ marginBottom: 8 }}>
      <Flex justify="space-between" align="flex-start" gap="small">
        <div>
          <Space size={6} align="center">
            <Typography.Text strong>{e.time}</Typography.Text>
            <Tag color={meta.color} icon={<AxMuiIcon icon={meta.icon} size={12} />}>
              {meta.label}
            </Tag>
            {e.actor === 'AI' ? <Tag>🤖 AI</Tag> : <Tag>{e.actor}</Tag>}
            {e.failed && <Tag color="red">failed</Tag>}
          </Space>
          <div>
            <Typography.Text>{e.label}</Typography.Text>
          </div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {e.summary}
          </Typography.Text>
        </div>
        <Space orientation="vertical" size={4} align="end">
          <Button size="small">Diff</Button>
          {e.canRevert && <Button size="small">Revert</Button>}
        </Space>
      </Flex>
    </Card>
  )
})

export const EpsHistoryPanel = observer((props: SubPanelControls) => {
  const { styles } = useStyles()
  const store = useEpsContext().history

  const grouped = store.filtered.reduce<Record<string, HistoryEntry[]>>((acc, e) => {
    if (!acc[e.group]) acc[e.group] = []
    acc[e.group].push(e)
    return acc
  }, {})

  return (
    <AxDisplayPanel type="sub" icon="mdiHistory" title="Schedule Change History" {...props}>
      <div className={styles.root}>
        <Select
          size="small"
          value={store.filter}
          onChange={(v) => store.setFilter(v)}
          style={{ width: '100%', marginBottom: 8 }}
          options={[
            { value: 'all', label: 'All' },
            { value: 'commit', label: 'Commits' },
            { value: 'replan', label: 'AI replans' },
            { value: 'tune', label: 'Tunes' },
            { value: 'import', label: 'Imports' },
          ]}
        />
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group}>
            <div className={styles.group}>{group}</div>
            {items.map((e) => (
              <Entry key={e.id} e={e} />
            ))}
          </div>
        ))}
      </div>
    </AxDisplayPanel>
  )
})
