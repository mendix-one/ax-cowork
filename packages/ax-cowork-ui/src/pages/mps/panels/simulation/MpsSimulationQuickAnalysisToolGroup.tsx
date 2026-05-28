import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { observer } from 'mobx-react-lite'
import { TOOL_GROUP_CAPACITIES } from '../../data/mock-plan'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Threshold colors (Update 3 — aligned with $ax-* tokens).
const SAFE_THRESHOLD = 0.8
const COLOR_TOTAL = '#37474F' // $ax-capacity — total tool-group capacity
const COLOR_USED_SAFE = '#0277BD' // $ax-normal    — usage under 80% of total
const COLOR_USED_WARN = '#EF6C00' // $ax-highload  — 80% ≤ usage ≤ total
const COLOR_USED_DANGER = '#C62828' // $ax-violation — usage > total

// Col #2 — Tool-group capacity vs usage. Per spec:
//   • Used color: green when usage < 80% of total, orange when 80% ≤ usage ≤ total, red when usage > total.
//   • When usage > total, the z-order swaps so the Total (cap) bar is drawn in front of the Usage bar —
//     the in-cap region shows as light-blue, the overflow extends above in red.
// Implemented as four series (Total/Used split into "under" + "over" buckets) so each row gets its own z-order.
export const MpsSimulationQuickAnalysisToolGroup = observer(() => {
  const option = useMemo<EChartsOption>(() => {
    const groups = TOOL_GROUP_CAPACITIES

    // Per-row data, indexed by xAxis position. null values are skipped by ECharts.
    const totalUnder = groups.map((g) => (g.used <= g.total ? g.total : null))
    const totalOver = groups.map((g) => (g.used > g.total ? g.total : null))
    const usedUnder = groups.map((g) => {
      if (g.used > g.total) return null
      const ratio = g.used / g.total
      const color = ratio >= SAFE_THRESHOLD ? COLOR_USED_WARN : COLOR_USED_SAFE
      return { value: g.used, itemStyle: { color } }
    })
    const usedOver = groups.map((g) => (g.used > g.total ? { value: g.used, itemStyle: { color: COLOR_USED_DANGER } } : null))

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: unknown) => {
          const arr = params as { name: string }[]
          const name = arr[0]?.name ?? ''
          const g = groups.find((x) => x.name === name)
          if (!g) return ''
          const pct = ((g.used / g.total) * 100).toFixed(0)
          const overflow = g.used > g.total ? `<br/><span style="color:#f5222d">Over by ${g.used - g.total}</span>` : ''
          return `<b>${name}</b><br/>Used: ${g.used} (${pct}%)<br/>Total: ${g.total}${overflow}`
        },
      },
      grid: { left: 40, right: 16, top: 12, bottom: 50 },
      xAxis: {
        type: 'category',
        data: groups.map((g) => g.name),
        axisLabel: { fontSize: 10, rotate: 30 },
      },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [
        // Non-overflow rows: Total behind, Used in front.
        {
          name: 'Total',
          type: 'bar',
          data: totalUnder,
          itemStyle: { color: COLOR_TOTAL },
          barGap: '-100%',
          z: 1,
        },
        {
          name: 'Used',
          type: 'bar',
          data: usedUnder,
          barGap: '-100%',
          z: 2,
        },
        // Overflow rows: Used behind (red, taller), Total in front (blue cap reference).
        {
          name: 'Used',
          type: 'bar',
          data: usedOver,
          barGap: '-100%',
          z: 1,
        },
        {
          name: 'Total',
          type: 'bar',
          data: totalOver,
          itemStyle: { color: COLOR_TOTAL },
          barGap: '-100%',
          z: 2,
        },
      ],
    }
  }, [])

  return (
    <div className="ax-simulation_analysis_card ax-simulation_analysis_card__chart">
      <div className="ax-simulation_analysis_card_header">
        <div className="ax-simulation_analysis_card_header_title">Tool-group capacities</div>
        <div className="ax-simulation_analysis_card_header_option">
          <button className="ax-simulation_analysis_card_header_option_button" type="button" title={'Large view'}>
            <AxMuiIcon icon={'mdiArrowExpandAll'} size="1.15rem" className="ax-simulation_analysis_header_option_button_icon" />
          </button>
        </div>
      </div>
      <div className="ax-simulation_analysis_card_chart_box">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge lazyUpdate />
      </div>
    </div>
  )
})
