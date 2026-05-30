import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { observer } from 'mobx-react-lite'
import { MOCK_ORG_DEMAND_BY_TEAM } from '../../data/mock-plan'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// "Headcount" reads as a soft ceiling; "Demand" carries the threshold color so the bar reads like a
// battery gauge from any distance.
const SAFE_THRESHOLD = 0.8
const COLOR_TOTAL = '#CFD8DC' // headcount ceiling (Blue Grey 100)
const COLOR_USED_SAFE = '#0277BD' // demand under 80%
const COLOR_USED_WARN = '#EF6C00' // demand 80% ≤ available
const COLOR_USED_DANGER = '#C62828' // demand > available

// Col #2 — Organization Resources usage/plan.
//   • Each row = a Team (Division › Site › Team) in the Organization hierarchy.
//   • Total bar = headcount (person-months equivalent assuming 1 month window).
//   • Used bar  = current planned SPM demand under that org node.
//   • Colour rule matches the spec: safe / highload (≥80%) / violation (>100%).
export const EpsSimulationQuickAnalysisToolGroup = observer(() => {
  const option = useMemo<EChartsOption>(() => {
    const rows = MOCK_ORG_DEMAND_BY_TEAM

    // Per-row data, indexed by xAxis position. null values are skipped by ECharts.
    const totalUnder = rows.map((r) => (r.demand <= r.headcount ? r.headcount : null))
    const totalOver = rows.map((r) => (r.demand > r.headcount ? r.headcount : null))
    const usedUnder = rows.map((r) => {
      if (r.demand > r.headcount) return null
      const ratio = r.headcount > 0 ? r.demand / r.headcount : 0
      const color = ratio >= SAFE_THRESHOLD ? COLOR_USED_WARN : COLOR_USED_SAFE
      return { value: r.demand, itemStyle: { color } }
    })
    const usedOver = rows.map((r) => (r.demand > r.headcount ? { value: r.demand, itemStyle: { color: COLOR_USED_DANGER } } : null))

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: unknown) => {
          const arr = params as { name: string }[]
          const name = arr[0]?.name ?? ''
          const r = rows.find((x) => x.label === name)
          if (!r) return ''
          const pct = r.headcount > 0 ? ((r.demand / r.headcount) * 100).toFixed(0) : '0'
          const overflow = r.demand > r.headcount ? `<br/><span style="color:#f5222d">Over by ${r.demand - r.headcount}</span>` : ''
          return `<b>${name}</b><br/>Demand: ${r.demand} P/M (${pct}%)<br/>Headcount: ${r.headcount}${overflow}`
        },
      },
      grid: { left: 40, right: 16, top: 12, bottom: 80 },
      xAxis: {
        type: 'category',
        data: rows.map((r) => r.label),
        // Slight angle + ellipsis so the team names don't run together.
        axisLabel: {
          fontSize: 10,
          rotate: 35,
          interval: 0,
          width: 120,
          overflow: 'truncate',
        },
      },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [
        // Non-overflow rows: Total behind, Used in front.
        { name: 'Headcount', type: 'bar', data: totalUnder, itemStyle: { color: COLOR_TOTAL }, barGap: '-100%', z: 1 },
        { name: 'Demand', type: 'bar', data: usedUnder, barGap: '-100%', z: 2 },
        // Overflow rows: Used behind (red, taller), Total in front (blue cap reference).
        { name: 'Demand', type: 'bar', data: usedOver, barGap: '-100%', z: 1 },
        { name: 'Headcount', type: 'bar', data: totalOver, itemStyle: { color: COLOR_TOTAL }, barGap: '-100%', z: 2 },
      ],
    }
  }, [])

  return (
    <div className="ax-eps-simulation_analysis_card ax-eps-simulation_analysis_card__chart">
      <div className="ax-eps-simulation_analysis_card_header">
        <div className="ax-eps-simulation_analysis_card_header_title">Organization resources usage / plan</div>
        <div className="ax-eps-simulation_analysis_card_header_option">
          <button className="ax-eps-simulation_analysis_card_header_option_button" type="button" title={'Large view'}>
            <AxMuiIcon icon={'mdiArrowExpandAll'} size="1.15rem" className="ax-eps-simulation_analysis_header_option_button_icon" />
          </button>
        </div>
      </div>
      <div className="ax-eps-simulation_analysis_card_chart_box">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge lazyUpdate />
      </div>
    </div>
  )
})
