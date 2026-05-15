// Markdown source mutation helpers used by the edit flow.
//
// We use a tight regex rather than a full remark/mdast pipeline because our
// block syntax is locked down: ```ax-(chart|table)\n<json>\n```. The regex
// only matches fenced blocks whose info string is exactly ax-chart or ax-table,
// so user-authored markdown with similar-looking fences (e.g. ```axolotl```)
// can't be confused with our blocks.

import type { BlockKind } from './AxMarkdown'

const BLOCK_REGEX = /```(ax-(?:chart|table))\r?\n([\s\S]*?)\r?\n```/g

export interface FoundBlock {
  kind: BlockKind
  tag: 'ax-chart' | 'ax-table'
  body: string
  start: number
  end: number
}

function tagToKind(tag: 'ax-chart' | 'ax-table'): BlockKind {
  return tag === 'ax-chart' ? 'chart' : 'table'
}

export function findBlock(source: string, blockId: string): FoundBlock | null {
  // Reset stateful regex; using a fresh RegExp avoids cross-call lastIndex bugs.
  const re = new RegExp(BLOCK_REGEX.source, BLOCK_REGEX.flags)
  let m: RegExpExecArray | null
  while ((m = re.exec(source)) !== null) {
    const tag = m[1] as 'ax-chart' | 'ax-table'
    const body = m[2]
    try {
      const parsed = JSON.parse(body) as { id?: unknown }
      if (typeof parsed.id === 'string' && parsed.id === blockId) {
        return {
          kind: tagToKind(tag),
          tag,
          body,
          start: m.index,
          end: m.index + m[0].length,
        }
      }
    } catch {
      // Block has invalid JSON — skip, can't match by id.
    }
  }
  return null
}

export function replaceBlock(source: string, blockId: string, newBody: string): string | null {
  const found = findBlock(source, blockId)
  if (!found) return null
  const fence = '```' + found.tag + '\n' + newBody.trim() + '\n```'
  return source.slice(0, found.start) + fence + source.slice(found.end)
}
