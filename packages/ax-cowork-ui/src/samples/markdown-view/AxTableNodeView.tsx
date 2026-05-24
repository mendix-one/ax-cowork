import { NodeViewWrapper } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import { BlockError, BlockFrame, TableBlock, TableBlockSchema } from '@ax-cowork/markdown'
import { useBlockEditContext } from './blockEditContext'

// Mirrors AxChartNodeView. See that file for the parse/validate strategy.
export function AxTableNodeView({ node }: NodeViewProps) {
  const body = (node.attrs.body ?? '') as string
  const ctx = useBlockEditContext()

  let parsed: unknown
  try {
    parsed = JSON.parse(body)
  } catch (err) {
    return (
      <NodeViewWrapper>
        <BlockError kind="ax-table" message={err instanceof Error ? err.message : String(err)} source={body} />
      </NodeViewWrapper>
    )
  }

  const result = TableBlockSchema.safeParse(parsed)
  if (!result.success) {
    return (
      <NodeViewWrapper>
        <BlockError kind="ax-table" message={result.error.message} source={body} />
      </NodeViewWrapper>
    )
  }

  const onEdit = ctx ? () => ctx.openEditor(result.data.id) : undefined

  return (
    <NodeViewWrapper>
      <BlockFrame onEdit={onEdit}>
        <TableBlock block={result.data} />
      </BlockFrame>
    </NodeViewWrapper>
  )
}
