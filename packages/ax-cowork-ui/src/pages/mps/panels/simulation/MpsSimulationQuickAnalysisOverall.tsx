import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { observer } from 'mobx-react-lite'
import { DAILY_TOOL_GROUP_USAGE, SHOP_FLOOR_CAPACITY_LIMIT, SHOP_FLOOR_CAPACITY_SAFE, TOOL_GROUP_CAPACITIES } from '../../data/mock-plan'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Two horizontal reference lines drawn on the chart:
//   • Limit — total shop-floor capacity (red / danger, solid).
//   • Safe  — safe-planning threshold = 80% of limit (orange / warning, dashed).
// Attached to a dedicated *non-stacked* host series so their y-positions are absolute chart coordinates
// (markLines on a stacked area series can otherwise get offset by the stack baseline).
const REFERENCE_MARK_LINE = {
  symbol: 'none' as const,
  silent: true,
  lineStyle: { width: 1.5 },
  label: { position: 'insideEndTop' as const, fontSize: 10, fontWeight: 'bold' as const },
  data: [
    {
      yAxis: SHOP_FLOOR_CAPACITY_LIMIT,
      name: 'Limit',
      lineStyle: { color: '#f44336', type: 'solid' as const, width: 2 }, // $ax-violation
      label: { formatter: `Limit · ${SHOP_FLOOR_CAPACITY_LIMIT}`, color: '#f44336' },
    },
    {
      yAxis: SHOP_FLOOR_CAPACITY_SAFE,
      name: 'Safe',
      lineStyle: { color: '#ff9800', type: 'dashed' as const, width: 2 }, // $ax-highload
      label: { formatter: `Safe · ${SHOP_FLOOR_CAPACITY_SAFE}`, color: '#ff9800' },
    },
  ],
}

// Col #1 — Stacked area chart of per-day tool-group usage with two reference mark lines (Limit + Safe).
// Pattern follows the ECharts area-stack example referenced in the spec.
export const MpsSimulationQuickAnalysisOverall = observer(() => {
  const option = useMemo<EChartsOption>(() => {
    const xData = DAILY_TOOL_GROUP_USAGE.map((d) => d.date.slice(5)) // "MM-DD"

    const stackedSeries = TOOL_GROUP_CAPACITIES.map((tg) => ({
      name: tg.name,
      type: 'line' as const,
      stack: 'Total',
      smooth: true,
      showSymbol: false,
      areaStyle: { opacity: 0.85 },
      emphasis: { focus: 'series' as const },
      data: DAILY_TOOL_GROUP_USAGE.map((d) => d.usage[tg.name] ?? 0),
    }))

    // Invisible host series solely for the two reference lines (no stacking, no area, no data points).
    const referenceSeries = {
      name: 'Capacity reference',
      type: 'line' as const,
      data: [],
      showSymbol: false,
      silent: true,
      tooltip: { show: false },
      markLine: REFERENCE_MARK_LINE,
    }

    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      grid: { left: 40, right: 16, top: 12, bottom: 24 },
      xAxis: { type: 'category', boundaryGap: false, data: xData, axisLabel: { fontSize: 10 } },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 10 },
        // Pad above the limit so the red line + label aren't clipped at the top of the chart.
        max: Math.ceil(SHOP_FLOOR_CAPACITY_LIMIT * 1.05),
      },
      series: [...stackedSeries, referenceSeries],
    }
  }, [])

  return (
    <div className="ax-simulation_analysis_card ax-simulation_analysis_card__chart">
      <div className="ax-simulation_analysis_card_header">
        <div className="ax-simulation_analysis_card_header_title">Shop floor — overall capacity</div>
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
