import { useMemo } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { EditorView } from '@codemirror/view'

export interface SourceEditorProps {
  value: string
  onChange: (next: string) => void
}

export function SourceEditor({ value, onChange }: SourceEditorProps) {
  // Soft-wrap long lines so block JSON doesn't push horizontal scroll.
  const extensions = useMemo(() => [markdown(), EditorView.lineWrapping], [])

  return (
    <div style={{ height: '100%', overflow: 'hidden' }}>
      <CodeMirror
        value={value}
        height="100%"
        style={{ height: '100%', fontSize: 13 }}
        extensions={extensions}
        onChange={onChange}
        basicSetup={{ lineNumbers: true, foldGutter: true, highlightActiveLine: false }}
      />
    </div>
  )
}
