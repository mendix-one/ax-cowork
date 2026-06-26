import { Button, Flex, Popconfirm, Tag, Typography } from 'antd'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import type { FactorDimension, FactorShape } from '../../stores/factors.store'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'
import { EpsFactorsHierarchyBar } from './EpsFactorsHierarchyBar.tsx'
import { EpsFactorsSchema } from './EpsFactorsSchema.tsx'
import { EpsFactorsTree } from './EpsFactorsTree.tsx'
import { EpsFactorsNodeDetail } from './EpsFactorsNodeDetail.tsx'

// Shape badge shown on each dimension in the sidebar.
const SHAPE_TAG: Record<FactorShape, { label: string; color: string }> = {
  single: { label: 'Single hierarchy', color: 'blue' },
  multi: { label: 'Multi-hierarchy', color: 'geekblue' },
  snowflake: { label: 'Snowflake', color: 'purple' },
}

const useStyles = createStyles(({ token }) => ({
  root: {
    height: '100%',
    display: 'flex',
    background: token.colorBgContainer,
  },
  sidebar: {
    flex: '0 0 240px',
    width: 240,
    borderRight: `1px solid ${token.colorBorderSecondary}`,
    overflow: 'auto',
    padding: token.paddingSM,
    display: 'flex',
    flexDirection: 'column',
    gap: token.paddingXS,
  },
  dim: {
    textAlign: 'left',
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    background: token.colorBgContainer,
    padding: token.paddingSM,
    cursor: 'pointer',
    transition: 'all .15s',
    '&:hover': { borderColor: token.colorPrimaryBorderHover, background: token.colorPrimaryBg },
    '&.is-active': { borderColor: token.colorPrimary, background: token.colorPrimaryBg, boxShadow: `inset 0 0 0 1px ${token.colorPrimary}` },
  },
  content: {
    flex: 1,
    minWidth: 0,
    overflow: 'auto',
    padding: token.paddingSM,
    display: 'flex',
    flexDirection: 'column',
    gap: token.paddingSM,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 320px',
    gap: token.paddingSM,
    alignItems: 'start',
  },
}))

const FactorsToolbar = observer(() => {
  const factors = useEpsContext().factors
  return (
    <Flex align="center" gap={8}>
      {factors.dirty && <Tag color="warning">Unsaved schema edits</Tag>}
      <Popconfirm
        title="Reset schema"
        description="Discard all edits and restore the seeded schema?"
        okText="Reset"
        onConfirm={() => factors.reset()}
        disabled={!factors.dirty}
      >
        <Button size="small" disabled={!factors.dirty} icon={<AxMuiIcon icon="mdiRestore" size={14} />}>
          Reset
        </Button>
      </Popconfirm>
    </Flex>
  )
})

const DimensionButton = observer(({ dim }: { dim: FactorDimension }) => {
  const { styles, cx } = useStyles()
  const factors = useEpsContext().factors
  const active = factors.selectedDimensionId === dim.id
  const shape = SHAPE_TAG[dim.shape]
  const hierLabel = dim.hierarchies.length === 1 ? '1 hierarchy' : `${dim.hierarchies.length} hierarchies`
  return (
    <button type="button" className={cx(styles.dim, active && 'is-active')} onClick={() => factors.selectDimension(dim.id)}>
      <Flex align="center" gap={10}>
        <AxMuiIcon icon={dim.icon} size="1.5rem" color={active ? undefined : '#8c8c8c'} />
        <Flex vertical style={{ minWidth: 0 }}>
          <Typography.Text strong ellipsis>
            {dim.name}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>
            {hierLabel} · {factors.dimensionMemberCount(dim)} members
          </Typography.Text>
        </Flex>
      </Flex>
      <Tag color={shape.color} style={{ marginTop: 8 }}>
        {shape.label}
      </Tag>
    </button>
  )
})

export const EpsFactorsPanel = observer((props: MainPanelControls) => {
  const { styles } = useStyles()
  const factors = useEpsContext().factors
  const dim = factors.selectedDimension

  return (
    <AxDisplayPanel type="main" icon="mdiHubOutline" title="Factors Control" tools={<FactorsToolbar />} {...props}>
      <div className={styles.root}>
        <div className={styles.sidebar}>
          <Typography.Text type="secondary" style={{ fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            Factor dimensions
          </Typography.Text>
          {factors.dimensions.map((d) => (
            <DimensionButton key={d.id} dim={d} />
          ))}
        </div>

        <div className={styles.content}>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            {dim.description}
          </Typography.Paragraph>
          <EpsFactorsHierarchyBar />
          <EpsFactorsSchema />
          <div className={styles.grid}>
            <EpsFactorsTree />
            <EpsFactorsNodeDetail />
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
