import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { observer } from 'mobx-react-lite'
import { MOCK_ORG_DEMAND_BY_TEAM } from '../../data/mock-plan'

// Organization Resources usage / plan — per-Team headcount vs current planned SPM demand.
// Colour rule: blue when demand < 80% of headcount, orange when 80% ≤ demand ≤ headcount,
// red when demand > headcount.
const SAFE_THRESHOLD = 0.8
const COLOR_TOTAL = '#CFD8DC' // soft ceiling (Blue Grey 100)
const COLOR_SAFE = '#0277BD'
const COLOR_WARN = '#EF6C00'
const COLOR_DANGER = '#C62828'

export const EpsAnalysisToolGroupBars = observer(() => {
  const option = useMemo<EChartsOption>(() => {
    const rows = MOCK_ORG_DEMAND_BY_TEAM
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: 50, right: 20, top: 12, bottom: 90 },
      xAxis: {
        type: 'category',
        data: rows.map((r) => r.label),
        axisLabel: { fontSize: 10, rotate: 30, interval: 0, width: 130, overflow: 'truncate' },
      },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      legend: { top: 0, right: 10, textStyle: { fontSize: 11 }, data: ['Headcount', 'Demand'] },
      series: [
        { name: 'Headcount', type: 'bar', data: rows.map((r) => r.headcount), itemStyle: { color: COLOR_TOTAL }, barGap: '-100%', z: 1 },
        {
          name: 'Demand',
          type: 'bar',
          data: rows.map((r) => {
            const ratio = r.headcount > 0 ? r.demand / r.headcount : 0
            const color = r.demand > r.headcount ? COLOR_DANGER : ratio >= SAFE_THRESHOLD ? COLOR_WARN : COLOR_SAFE
            return { value: r.demand, itemStyle: { color } }
          }),
          barGap: '-100%',
          z: 2,
        },
      ],
    }
  }, [])

  return (
    <div className="ax-eps-analysis_section">
      <div className="ax-eps-analysis_section_title">Organization Resources — headcount vs planned demand</div>
      <div className="ax-eps-analysis_chart" style={{ height: 260 }}>
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge lazyUpdate />
      </div>
    </div>
  )
})
