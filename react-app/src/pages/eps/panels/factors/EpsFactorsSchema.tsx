import { useState } from 'react'
import { Button, Card, Flex, Input, Popconfirm, Tag, Tooltip, Typography, theme } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import type { FactorLevel } from '../../stores/factors.store'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// The hierarchy schema row — one chip per level (root → leaf), with the member count and inline rename.
// A level can only be removed when it holds no members, so the hierarchy stays consistent.
const LevelChip = observer(({ level, index, isLeaf }: { level: FactorLevel; index: number; isLeaf: boolean }) => {
  const { token } = theme.useToken()
  const factors = useEpsContext().factors
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(level.name)
  const count = factors.levelCount(level.id)

  const commit = () => {
    const next = draft.trim()
    if (next) factors.renameLevel(level.id, next)
    else setDraft(level.name)
    setEditing(false)
  }

  return (
    <Card size="small" styles={{ body: { padding: '6px 10px' } }} style={{ minWidth: 132 }}>
      <Flex vertical gap={2}>
        <Flex align="center" justify="space-between" gap={8}>
          <Typography.Text type="secondary" style={{ fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            L{index + 1}
            {isLeaf ? ' · leaf' : ''}
          </Typography.Text>
          {count === 0 && (
            <Popconfirm title="Remove this empty level?" okText="Remove" onConfirm={() => factors.removeLevel(level.id)}>
              <Button
                type="text"
                size="small"
                aria-label={`Remove ${level.name}`}
                icon={<AxMuiIcon icon="mdiClose" size={13} />}
                style={{ width: 20, height: 20 }}
              />
            </Popconfirm>
          )}
        </Flex>
        {editing ? (
          <Input
            size="small"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onPressEnter={commit}
            style={{ fontWeight: 600 }}
          />
        ) : (
          <Tooltip title="Rename level">
            <Typography.Text strong style={{ cursor: 'text' }} onClick={() => setEditing(true)}>
              {level.name}
            </Typography.Text>
          </Tooltip>
        )}
        <Tag color={count ? 'blue' : 'default'} style={{ margin: 0, width: 'fit-content', borderColor: count ? undefined : token.colorBorderSecondary }}>
          {count} {count === 1 ? 'member' : 'members'}
        </Tag>
      </Flex>
    </Card>
  )
})

export const EpsFactorsSchema = observer(() => {
  const factors = useEpsContext().factors
  const hierarchy = factors.selectedHierarchy
  const levels = hierarchy.levels
  const balanced = factors.isBalanced(hierarchy)

  return (
    <Card size="small" title={`Levels · ${hierarchy.name}`} extra={<Tag color={balanced ? 'green' : 'gold'}>{balanced ? 'Balanced' : 'Unbalanced'}</Tag>}>
      <Flex align="center" gap={6} wrap="wrap">
        {levels.map((level, i) => (
          <Flex key={level.id} align="center" gap={6}>
            {i > 0 && <AxMuiIcon icon="mdiChevronRight" size={18} color="#bfbfbf" />}
            <LevelChip level={level} index={i} isLeaf={i === levels.length - 1} />
          </Flex>
        ))}
        <Tooltip title="Append a leaf level">
          <Button type="dashed" icon={<AxMuiIcon icon="mdiPlus" size={16} />} onClick={() => factors.addLevel()} style={{ marginLeft: 6 }}>
            Level
          </Button>
        </Tooltip>
      </Flex>
    </Card>
  )
})
