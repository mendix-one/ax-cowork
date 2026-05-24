// Convert ```ax-chart / ```ax-table fenced blocks into <div data-ax-<kind>="..">
// placeholders. The HTML placeholders survive markdown-it (with html: true)
// and are picked up by AxChartBlockExtension / AxTableBlockExtension's
// parseHTML, which materialize them into TipTap custom nodes.
//
// Body is URI-encoded so quotes, newlines, and unicode in JSON survive the
// HTML attribute. Round-trip back to markdown is handled by each node's
// storage.markdown.serialize — no postprocess needed on output.

const AX_BLOCK_FENCE_REGEX = /```(ax-chart|ax-table)\r?\n([\s\S]*?)\r?\n```/g

export function preprocessMarkdown(md: string): string {
  return md.replace(AX_BLOCK_FENCE_REGEX, (_, tag: string, body: string) => {
    return `<div data-${tag}="${encodeURIComponent(body)}"></div>`
  })
}
