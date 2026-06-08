import { Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import type { FlatCellEntry } from '../../data/mock-plan'
import { cellSkillCount } from '../../helpers/capacity.helpers'

// Headcount detail — the Organization × Skill matrix for the selected node. Rows are the Cells beneath the
// node (with their org path), columns are the skills present in the subtree; the footer totals each skill.
export const EpsCapacityTable = observer(() => {
  const store = useEpsContext().capacity
  const cells = store.selectedCells
  const skills = store.selectedSkillTotals

  const columns: ColumnsType<FlatCellEntry> = [
    {
      title: 'Organization unit',
      key: 'unit',
      fixed: 'left',
      width: 220,
      render: (_, e) => (
        <div>
          <Typography.Text strong>{e.cell.name}</Typography.Text>
          <Typography.Text type="secondary" style={{ display: 'block', fontSize: 11 }}>
            {/* Team › Group › Part — the org path above the cell */}
            {e.path.slice(2, 5).join(' › ')}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: 'HC',
      key: 'headcount',
      align: 'right',
      width: 64,
      fixed: 'left',
      render: (_, e) => <Typography.Text strong>{e.cell.headcount}</Typography.Text>,
    },
    ...skills.map<ColumnsType<FlatCellEntry>[number]>((s) => ({
      title: s.skill,
      key: s.skill,
      align: 'right',
      width: 80,
      render: (_, e) => {
        const c = cellSkillCount(e.cell, s.skill)
        return c ? c : <span style={{ color: '#d9d9d9' }}>·</span>
      },
    })),
  ]

  return (
    <Table<FlatCellEntry>
      size="small"
      rowKey={(e) => e.cell.id}
      columns={columns}
      dataSource={cells}
      pagination={false}
      scroll={{ x: 'max-content', y: 360 }}
      onRow={(e) => ({
        onClick: () => store.selectNode(e.cell.id),
        style: { cursor: 'pointer' },
      })}
      rowClassName={(e) => (e.cell.id === store.selectedNodeId ? 'ant-table-row-selected' : '')}
      summary={() => (
        <Table.Summary fixed>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}>
              <Typography.Text strong>Total · {cells.length} cells</Typography.Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="right">
              <Typography.Text strong>{store.selectedHeadcount}</Typography.Text>
            </Table.Summary.Cell>
            {skills.map((s, i) => (
              <Table.Summary.Cell key={s.skill} index={i + 2} align="right">
                <Typography.Text strong>{s.count}</Typography.Text>
              </Table.Summary.Cell>
            ))}
          </Table.Summary.Row>
        </Table.Summary>
      )}
    />
  )
})
