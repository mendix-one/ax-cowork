import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

export interface ChartBlockProps {
  option: EChartsOption
  height?: number
}

export function ChartBlock({ option, height = 320 }: ChartBlockProps) {
  return (
    <div
      style={{
        border: '1px solid #f0f0f0',
        borderRadius: 6,
        padding: 8,
        background: '#fff',
      }}
    >
      <ReactECharts option={option} style={{ height, width: '100%' }} notMerge lazyUpdate />
    </div>
  )
}
