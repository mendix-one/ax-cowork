import { useState } from 'react'
import { Button, Card, Flex, Input, Popconfirm, Tag, Tooltip, Typography } from 'antd'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import type { FactorHierarchy } from '../../stores/factors.store'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

const useStyles = createStyles(({ token }) => ({
  chip: {
    position: 'relative',
    textAlign: 'left',
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    background: token.colorBgContainer,
    padding: '8px 10px',
    minWidth: 150,
    cursor: 'pointer',
    transition: 'all .15s',
    '&:hover': { borderColor: token.colorPrimaryBorderHover },
    '&.is-active': { borderColor: token.colorPrimary, boxShadow: `inset 0 0 0 1px ${token.colorPrimary}`, background: token.colorPrimaryBg },
  },
  hub: {
    border: `1px solid ${token.colorPrimary}`,
    background: token.colorPrimaryBg,
    color: token.colorPrimary,
    borderRadius: 999,
    padding: '4px 14px',
    fontWeight: 600,
  },
  stem: {
    width: 1,
    height: 14,
    background: token.colorBorder,
  },
  branches: {
    borderTop: `1px solid ${token.colorBorderSecondary}`,
    paddingTop: token.paddingSM,
    width: '100%',
  },
}))

// One selectable hierarchy / branch. The active chip exposes rename + remove controls.
const HierarchyChip = observer(({ h }: { h: FactorHierarchy }) => {
  const { styles, cx } = useStyles()
  const factors = useEpsContext()
  const store = factors.factors
  const active = store.selectedHierarchyId === h.id
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(h.name)

  const commit = () => {
    const next = draft.trim()
    if (next) store.renameHierarchy(h.id, next)
    else setDraft(h.name)
    setEditing(false)
  }

  return (
    <div className={cx(styles.chip, active && 'is-active')} onClick={() => store.selectHierarchy(h.id)}>
      <Flex vertical gap={2}>
        <Flex align="center" justify="space-between" gap={6}>
          {editing ? (
            <Input
              size="small"
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onPressEnter={commit}
              onClick={(e) => e.stopPropagation()}
              style={{ fontWeight: 600, maxWidth: 130 }}
            />
          ) : (
            <Typography.Text strong>{h.name}</Typography.Text>
          )}
          {active && !editing && (
            <Flex align="center" gap={2} onClick={(e) => e.stopPropagation()}>
              <Tooltip title="Rename">
                <Button
                  type="text"
                  size="small"
                  style={{ width: 22, height: 22 }}
                  icon={<AxMuiIcon icon="mdiPencilOutline" size={13} />}
                  onClick={() => setEditing(true)}
                />
              </Tooltip>
              <Popconfirm
                title="Remove this hierarchy and its members?"
                okText="Remove"
                okButtonProps={{ danger: true }}
                onConfirm={() => store.removeHierarchy(h.id)}
              >
                <Button type="text" size="small" danger style={{ width: 22, height: 22 }} icon={<AxMuiIcon icon="mdiClose" size={13} />} />
              </Popconfirm>
            </Flex>
          )}
        </Flex>
        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
          {store.memberCount(h)} members · {h.levels.length} {h.levels.length === 1 ? 'level' : 'levels'}
        </Typography.Text>
        <Tag color={store.isBalanced(h) ? 'green' : 'gold'} style={{ margin: 0, width: 'fit-content' }}>
          {store.isBalanced(h) ? 'Balanced' : 'Unbalanced'}
        </Tag>
      </Flex>
    </div>
  )
})

const AddHierarchyButton = observer(({ label }: { label: string }) => {
  const store = useEpsContext().factors
  return (
    <Button type="dashed" style={{ height: 'auto', minHeight: 60 }} icon={<AxMuiIcon icon="mdiPlus" size={16} />} onClick={() => store.addHierarchy()}>
      {label}
    </Button>
  )
})

// Hierarchy selector — adapts to the dimension's schema shape:
//   single     → nothing (one hierarchy, handled by the schema/tree directly)
//   multi      → a row of selectable hierarchy chips
//   snowflake  → a hub node with the branches fanning out beneath it
export const EpsFactorsHierarchyBar = observer(() => {
  const { styles } = useStyles()
  const store = useEpsContext().factors
  const dim = store.selectedDimension

  if (dim.shape === 'single') return null

  if (dim.shape === 'snowflake') {
    return (
      <Card size="small" title="Snowflake branches" extra={<Tag color="purple">Snowflake</Tag>}>
        <Flex vertical align="center" gap={0}>
          <div className={styles.hub}>{dim.hub ?? dim.name}</div>
          <div className={styles.stem} />
          <Flex wrap gap={8} justify="center" className={styles.branches}>
            {dim.hierarchies.map((h) => (
              <HierarchyChip key={h.id} h={h} />
            ))}
            <AddHierarchyButton label="Branch" />
          </Flex>
        </Flex>
      </Card>
    )
  }

  // multi
  return (
    <Card size="small" title="Hierarchies" extra={<Tag color="geekblue">Multi-hierarchy</Tag>}>
      <Flex wrap gap={8}>
        {dim.hierarchies.map((h) => (
          <HierarchyChip key={h.id} h={h} />
        ))}
        <AddHierarchyButton label="Hierarchy" />
      </Flex>
    </Card>
  )
})
