import { observer } from 'mobx-react-lite'
import { useNavigate, useParams } from 'react-router-dom'
import { Result } from 'antd'
import { createStyles } from 'antd-style'
import { AxMarkdown } from '@ax-cowork/markdown'
import { useStore } from '@/acore/store/store.context'

// Markdown body inherits AntD's CSS reset (zeroed heading margins / list padding),
// so we add minimal prose-style spacing here. Scoped via createStyles so we don't
// leak to the rest of the app.
const useStyles = createStyles(({ token }) => ({
  prose: {
    color: token.colorText,
    fontSize: token.fontSize,
    lineHeight: 1.6,
    '& h1, & h2, & h3': { marginTop: token.marginLG, marginBottom: token.marginSM, fontWeight: 600 },
    '& h1': { fontSize: token.fontSizeHeading2 },
    '& h2': { fontSize: token.fontSizeHeading3 },
    '& h3': { fontSize: token.fontSizeHeading4 },
    '& p': { margin: `${token.marginSM}px 0` },
    '& ul, & ol': { paddingLeft: token.paddingLG, margin: `${token.marginSM}px 0` },
    '& code': { padding: '2px 6px', background: token.colorFillTertiary, borderRadius: 4, fontSize: '0.9em' },
    '& pre': { background: token.colorFillQuaternary, padding: token.padding, borderRadius: 6, overflow: 'auto' },
    '& pre code': { padding: 0, background: 'transparent' },
    '& table': { borderCollapse: 'collapse', margin: `${token.marginSM}px 0`, width: '100%' },
    '& th, & td': { border: `1px solid ${token.colorBorderSecondary}`, padding: '6px 10px', textAlign: 'left' },
    '& th': { background: token.colorFillQuaternary },
  },
}))

export const MarkdownViewPage = observer(() => {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { documents } = useStore()
  const { styles } = useStyles()

  const doc = documents.getById(id)

  if (!doc) {
    return <Result status="404" title="Document not found" subTitle={`No document with id "${id}".`} />
  }

  const handleEditBlock = (blockId: string) => {
    navigate(`/docs/${doc.id}/edit/${blockId}`)
  }

  return (
    <div style={{ height: '100%', overflow: 'auto', background: '#fff' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: 24 }} className={styles.prose}>
        <AxMarkdown source={doc.source} onEditBlock={handleEditBlock} />
      </div>
    </div>
  )
})
