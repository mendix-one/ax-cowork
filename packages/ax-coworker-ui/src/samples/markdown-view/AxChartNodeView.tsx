import { NodeViewWrapper } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import type { EChartsOption } from 'echarts'
import { BlockError, BlockFrame, ChartBlock, ChartBlockSchema } from '@ax-cowork/markdown'
import { useBlockEditContext } from './blockEditContext'

// Renders inside the TipTap editor as an atom node — body is the raw JSON from
// the original ```ax-chart fence. Parses + validates per render; on failure
// drops to BlockError so the editor never crashes on malformed AI output.
export function AxChartNodeView({ node }: NodeViewProps) {
  const body = (node.attrs.body ?? '') as string
  const ctx = useBlockEditContext()

  let parsed: unknown
  try {
    parsed = JSON.parse(body)
  } catch (err) {
    return (
      <NodeViewWrapper>
        <BlockError kind="ax-chart" message={err instanceof Error ? err.message : String(err)} source={body} />
      </NodeViewWrapper>
    )
  }

  const result = ChartBlockSchema.safeParse(parsed)
  if (!result.success) {
    return (
      <NodeViewWrapper>
        <BlockError kind="ax-chart" message={result.error.message} source={body} />
      </NodeViewWrapper>
    )
  }

  const { id, option } = result.data
  const onEdit = ctx ? () => ctx.openEditor(id) : undefined

  return (
    <NodeViewWrapper>
      <BlockFrame onEdit={onEdit}>
        <ChartBlock option={option as EChartsOption} />
      </BlockFrame>
    </NodeViewWrapper>
  )
}
