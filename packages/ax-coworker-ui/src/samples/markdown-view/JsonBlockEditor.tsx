import { Splitter } from 'antd'
import { AxMarkdown } from '@ax-cowork/markdown'

export interface JsonBlockEditorProps {
  draft: string
  onDraftChange: (next: string) => void
  tag: 'ax-chart' | 'ax-table'
}

// Raw JSON editor — extracted from the original BlockEditor. Lives behind the
// "JSON" tab; intended for power users / cases the form can't represent.
export function JsonBlockEditor({ draft, onDraftChange, tag }: JsonBlockEditorProps) {
  const previewSource = '```' + tag + '\n' + draft + '\n```\n'

  return (
    <Splitter layout="vertical" style={{ height: '100%' }}>
      <Splitter.Panel defaultSize="55%" min="20%" max="80%">
        <textarea
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          spellCheck={false}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            padding: 12,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 13,
            lineHeight: 1.6,
            resize: 'none',
            background: '#fafafa',
          }}
        />
      </Splitter.Panel>
      <Splitter.Panel>
        <div style={{ height: '100%', overflow: 'auto', padding: 12 }}>
          <AxMarkdown source={previewSource} />
        </div>
      </Splitter.Panel>
    </Splitter>
  )
}
