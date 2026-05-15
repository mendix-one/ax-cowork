import { lazy, Suspense, useMemo } from 'react'
import type { ReactNode } from 'react'
import Markdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import type { EChartsOption } from 'echarts'
import { ChartBlockSchema, TableBlockSchema } from './schemas'
import { BlockFrame } from './BlockFrame'
import { BlockError } from './blocks/BlockError'
import { TableBlock } from './blocks/TableBlock'

// ECharts is ~1MB before gzip; lazy-load so the view page doesn't pay until a
// chart block actually appears. Suspense fallback below covers the gap.
const LazyChartBlock = lazy(async () => ({ default: (await import('./blocks/ChartBlock')).ChartBlock }))

export type BlockKind = 'chart' | 'table'

export interface AxMarkdownProps {
  source: string
  // Pass to enable the Edit overlay on each block. View-only screens omit this.
  onEditBlock?: (blockId: string, kind: BlockKind) => void
}

type ParseResult = { ok: true; value: unknown } | { ok: false; error: string }

function tryParseJson(raw: string): ParseResult {
  try {
    return { ok: true, value: JSON.parse(raw) }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

function extractCodeText(children: ReactNode): string {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(extractCodeText).join('')
  return ''
}

function buildComponents(onEditBlock: AxMarkdownProps['onEditBlock']): Components {
  return {
    // react-markdown emits <pre><code> for fenced blocks. We strip <pre> so the
    // code override can return any block-level element (BlockFrame etc.)
    // without being trapped inside <pre>. Unknown-language fenced blocks
    // re-add their own <pre> wrapper in the code branch below.
    pre: (props) => <>{props.children}</>,
    code(props) {
      const { className, children } = props
      const match = /language-([\w-]+)/.exec(className || '')
      const lang = match?.[1]

      // Inline code: no language class. Render as-is.
      if (!lang) {
        return <code className={className}>{children}</code>
      }

      const raw = extractCodeText(children)

      if (lang === 'ax-chart') {
        const parsed = tryParseJson(raw)
        if (!parsed.ok) return <BlockError kind="ax-chart" message={parsed.error} source={raw} />
        const result = ChartBlockSchema.safeParse(parsed.value)
        if (!result.success) return <BlockError kind="ax-chart" message={result.error.message} source={raw} />
        const { id, option } = result.data
        return (
          <BlockFrame onEdit={onEditBlock ? () => onEditBlock(id, 'chart') : undefined}>
            <Suspense
              fallback={<div style={{ height: 320, display: 'grid', placeItems: 'center', border: '1px solid #f0f0f0', borderRadius: 6 }}>Loading chart…</div>}
            >
              <LazyChartBlock option={option as EChartsOption} />
            </Suspense>
          </BlockFrame>
        )
      }

      if (lang === 'ax-table') {
        const parsed = tryParseJson(raw)
        if (!parsed.ok) return <BlockError kind="ax-table" message={parsed.error} source={raw} />
        const result = TableBlockSchema.safeParse(parsed.value)
        if (!result.success) return <BlockError kind="ax-table" message={result.error.message} source={raw} />
        return (
          <BlockFrame onEdit={onEditBlock ? () => onEditBlock(result.data.id, 'table') : undefined}>
            <TableBlock block={result.data} />
          </BlockFrame>
        )
      }

      // Unknown language → plain code block, re-add the <pre> wrapper we stripped above.
      return (
        <pre>
          <code className={className}>{children}</code>
        </pre>
      )
    },
  }
}

export function AxMarkdown({ source, onEditBlock }: AxMarkdownProps) {
  const components = useMemo(() => buildComponents(onEditBlock), [onEditBlock])
  return (
    <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]} components={components}>
      {source}
    </Markdown>
  )
}
