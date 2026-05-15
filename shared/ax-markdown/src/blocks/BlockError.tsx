export interface BlockErrorProps {
  kind: string
  message: string
  source: string
}

export function BlockError({ kind, message, source }: BlockErrorProps) {
  return (
    <div
      style={{
        border: '1px solid #ffccc7',
        background: '#fff2f0',
        borderRadius: 6,
        padding: 12,
        margin: '8px 0',
        fontFamily: 'monospace',
        fontSize: 12,
        color: '#a8071a',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        [{kind}] block error: {message}
      </div>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#595959' }}>{source}</pre>
    </div>
  )
}
