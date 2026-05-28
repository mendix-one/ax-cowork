import { useMemo } from 'react'
import { DatePicker, Space, Tag } from 'antd'
import dayjs from 'dayjs'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../store/mps.context'
import { DAILY_TOOL_GROUP_USAGE, TOOL_GROUP_CAPACITIES } from '../../data/mock-plan'
import { SAFE_THRESHOLD } from './analysis.helpers'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Color tokens — synced with the schedule-lineage palette (axSchedule in theme.ts) so the bar fills
// share their hue with the Gantt bars and the toolbar legend swatches. Capacity uses Fixed-indigo
// (firm baseline); safe usage uses New-teal (within bounds). Warn/danger remain semantic risk hues.
const COLOR_TOTAL = '#3f51b5' // axSchedule.fixed.bar — capacity baseline
const COLOR_USED_SAFE = '#00897b' // axSchedule.new.bar — normal
const COLOR_USED_WARN = '#EF6C00' // highload (risk)
const COLOR_USED_DANGER = '#C62828' // violation (risk)

// Aggregate per-day usage for each tool group across `start..end` (inclusive), averaging across days.
// The bar chart shows that averaged usage vs each tool group's nominal capacity.
const aggregateUsage = (start: string, end: string) => {
  return TOOL_GROUP_CAPACITIES.map((tg) => {
    const window = DAILY_TOOL_GROUP_USAGE.filter((d) => d.date >= start && d.date <= end)
    const sum = window.reduce((s, d) => s + (d.usage[tg.name] ?? 0), 0)
    const used = window.length ? Math.round(sum / window.length) : tg.used
    return { name: tg.name, total: tg.total, used }
  })
}

// Bar chart of tool-group capacity vs used, with a sub date-range picker on top.
// The sub date range defaults to the master production planning range; the shop-floor area chart's brush,
// when set, overrides it (consumed read-only here — the user can still manually pick a different range).
export const MpsAnalysisToolGroupBars = observer(() => {
  const analysis = useMpsContext().analysis

  // Effective range: brush from the area chart, otherwise toolbar range.
  const start = analysis.shopFloorBrush?.start ?? analysis.startDate
  const end = analysis.shopFloorBrush?.end ?? analysis.endDate

  const groups = useMemo(() => aggregateUsage(start, end), [start, end])

  const option = useMemo<EChartsOption>(() => {
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
        { name: 'Total', type: 'bar', data: totalUnder, itemStyle: { color: COLOR_TOTAL }, barGap: '-100%', z: 1 },
        { name: 'Used', type: 'bar', data: usedUnder, barGap: '-100%', z: 2 },
        { name: 'Used', type: 'bar', data: usedOver, barGap: '-100%', z: 1 },
        { name: 'Total', type: 'bar', data: totalOver, itemStyle: { color: COLOR_TOTAL }, barGap: '-100%', z: 2 },
      ],
    }
  }, [groups])

  return (
    <div className="ax-analysis_section">
      <div className="ax-analysis_section_header">
        <div className="ax-analysis_section_header_title">
          <AxMuiIcon icon="mdiChartBar" size={18} />
          <span>Tool-group capacity</span>
        </div>
        <Space size={6} align="center">
          {analysis.shopFloorBrush && (
            <Tag color="blue" style={{ margin: 0 }}>
              from shop-floor selection
            </Tag>
          )}
          <DatePicker.RangePicker
            size="small"
            allowClear={false}
            value={[dayjs(start), dayjs(end)]}
            onChange={(values) => {
              if (!values || !values[0] || !values[1]) return
              // Manual pick overrides the brush.
              analysis.setShopFloorBrush({ start: values[0].format('YYYY-MM-DD'), end: values[1].format('YYYY-MM-DD') })
            }}
          />
        </Space>
      </div>
      <div className="ax-analysis_section_body" style={{ height: 260 }}>
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge lazyUpdate />
      </div>
    </div>
  )
})
