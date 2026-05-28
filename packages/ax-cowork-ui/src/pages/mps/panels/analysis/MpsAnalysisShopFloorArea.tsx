import { useMemo, useRef } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../stores/mps.context'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'
import { DAILY_TOOL_GROUP_USAGE, SHOP_FLOOR_CAPACITY_LIMIT, SHOP_FLOOR_CAPACITY_SAFE, TOOL_GROUP_CAPACITIES } from '../../data/mock-plan'

// Two horizontal reference lines drawn on the chart: Safe (orange dashed, 80%) + Limit (red solid, 100%).
const REFERENCE_MARK_LINE = {
  symbol: 'none' as const,
  silent: true,
  lineStyle: { width: 1.5 },
  label: { position: 'insideEndTop' as const, fontSize: 10, fontWeight: 'bold' as const },
  data: [
    {
      yAxis: SHOP_FLOOR_CAPACITY_LIMIT,
      name: 'Limit',
      lineStyle: { color: '#f44336', type: 'solid' as const, width: 2 },
      label: { formatter: `Limit · ${SHOP_FLOOR_CAPACITY_LIMIT}`, color: '#f44336' },
    },
    {
      yAxis: SHOP_FLOOR_CAPACITY_SAFE,
      name: 'Safe',
      lineStyle: { color: '#ff9800', type: 'dashed' as const, width: 2 },
      label: { formatter: `Safe · ${SHOP_FLOOR_CAPACITY_SAFE}`, color: '#ff9800' },
    },
  ],
}

// Full-width stacked area chart of per-day tool-group usage with a dataZoom slider on the bottom.
// Dragging the slider thumbs emits a `dataZoom` event — we capture the corresponding x-range and store
// it on the analysis store as the "shop-floor brush", which the tool-group bar chart then uses for its detail
// date range.
export const MpsAnalysisShopFloorArea = observer(() => {
  const analysis = useMpsContext().analysis
  // Cache the last emitted brush window so onEvents doesn't fire when the value hasn't actually changed.
  const lastBrush = useRef<string>('')

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
      legend: {
        type: 'scroll',
        top: 0,
        textStyle: { fontSize: 10 },
        itemHeight: 8,
        itemWidth: 12,
      },
      grid: { left: 48, right: 16, top: 32, bottom: 56 },
      xAxis: { type: 'category', boundaryGap: false, data: xData, axisLabel: { fontSize: 10 } },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 10 },
        max: Math.ceil(SHOP_FLOOR_CAPACITY_LIMIT * 1.05),
      },
      // Slider zoom acts as the "select a daterange to review detail" affordance from the spec.
      dataZoom: [
        { type: 'inside', xAxisIndex: 0 },
        { type: 'slider', xAxisIndex: 0, height: 18, bottom: 10, brushSelect: false },
      ],
      series: [...stackedSeries, referenceSeries],
    }
  }, [])

  // ECharts `dataZoom` event payload: { start, end } as percentages, or { startValue, endValue } in absolute indices.
  // We translate back to ISO dates from DAILY_TOOL_GROUP_USAGE.
  const onEvents = useMemo(
    () => ({
      dataZoom: (params: unknown) => {
        const p = params as { start?: number; end?: number; batch?: { start?: number; end?: number }[] }
        const range = p.batch?.[0] ?? p
        const startPct = range.start ?? 0
        const endPct = range.end ?? 100
        const total = DAILY_TOOL_GROUP_USAGE.length
        if (total === 0) return
        const startIdx = Math.max(0, Math.floor((startPct / 100) * (total - 1)))
        const endIdx = Math.min(total - 1, Math.ceil((endPct / 100) * (total - 1)))
        const startDate = DAILY_TOOL_GROUP_USAGE[startIdx].date
        const endDate = DAILY_TOOL_GROUP_USAGE[endIdx].date
        // A near-100% range counts as "no brush" — the bar chart then falls back to its own default range.
        const isFullRange = startPct <= 0.5 && endPct >= 99.5
        const key = isFullRange ? '*' : `${startDate}::${endDate}`
        if (key === lastBrush.current) return
        lastBrush.current = key
        if (isFullRange) analysis.clearShopFloorBrush()
        else analysis.setShopFloorBrush({ start: startDate, end: endDate })
      },
    }),
    [analysis],
  )

  return (
    <div className="ax-mps-analysis_section">
      <div className="ax-mps-analysis_section_header">
        <div className="ax-mps-analysis_section_header_title">
          <AxMuiIcon icon="mdiChartAreaspline" size={18} />
          <span>Shop floor capacity</span>
        </div>
        <div className="ax-mps-analysis_section_header_hint">Drag the slider below the chart to pick a detail range for the tool-group view.</div>
      </div>
      <div className="ax-mps-analysis_section_body" style={{ height: 280 }}>
        <ReactECharts option={option} onEvents={onEvents} style={{ height: '100%', width: '100%' }} notMerge lazyUpdate />
      </div>
    </div>
  )
})
