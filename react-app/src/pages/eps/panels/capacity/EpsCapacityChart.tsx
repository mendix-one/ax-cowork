import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { MOCK_FLAT_CELLS, MOCK_DIVISIONS } from '../../data/mock-plan'
import { calcCapacityVsDemand } from '../../helpers/capacity.helpers'

// Resolve `selectedNodeId` (which may be at any depth) to a partial OrgRef the helper understands.
const refForNode = (id: string) => {
  const cellHit = MOCK_FLAT_CELLS.find((e) => e.cell.id === id)
  if (cellHit) return cellHit.ref
  for (const d of MOCK_DIVISIONS) {
    if (d.id === id) return { divisionId: d.id }
    for (const s of d.sites) {
      if (s.id === id) return { divisionId: d.id, siteId: s.id }
      for (const t of s.teams) {
        if (t.id === id) return { divisionId: d.id, siteId: s.id, teamId: t.id }
        for (const g of t.groups) {
          if (g.id === id) return { divisionId: d.id, siteId: s.id, teamId: t.id, groupId: g.id }
          for (const p of g.parts) {
            if (p.id === id) return { divisionId: d.id, siteId: s.id, teamId: t.id, groupId: g.id, partId: p.id }
          }
        }
      }
    }
  }
  return { divisionId: MOCK_DIVISIONS[0].id }
}

export const EpsCapacityChart = observer(() => {
  const store = useEpsContext().capacity
  const points = useMemo(() => calcCapacityVsDemand(refForNode(store.selectedNodeId)), [store.selectedNodeId])

  const option = useMemo<EChartsOption>(() => {
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      grid: { left: 40, right: 16, top: 12, bottom: 28 },
      xAxis: { type: 'category', data: points.map((p) => p.label), boundaryGap: false, axisLabel: { fontSize: 10 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [
        {
          name: 'Headcount',
          type: 'line',
          data: points.map((p) => p.capacity),
          itemStyle: { color: '#37474F' },
          lineStyle: { type: 'dashed' },
          showSymbol: false,
        },
        {
          name: 'Demand',
          type: 'line',
          smooth: true,
          areaStyle: { opacity: 0.4 },
          itemStyle: { color: '#3F51B5' },
          data: points.map((p) => p.demand),
          markPoint: {
            data: points.filter((p) => p.over).map((p) => ({ name: 'Over', xAxis: p.label, yAxis: p.demand, itemStyle: { color: '#f5222d' } })),
          },
        },
      ],
    }
  }, [points])

  return (
    <div className="ax-eps-capacity_chart" style={{ height: 220 }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge lazyUpdate />
    </div>
  )
})
