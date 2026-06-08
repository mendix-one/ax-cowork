import { useEffect, useState } from 'react'
import { Card, Descriptions, Empty, Flex, Input, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'

// Inline editor for the selected member (factor): rename, set/clear the short code, and read its place in
// the hierarchy. Edits commit to the store on blur / Enter.
export const EpsFactorsNodeDetail = observer(() => {
  const factors = useEpsContext().factors
  const node = factors.selectedNode
  const level = node ? factors.levelById(node.levelId) : null

  const [name, setName] = useState('')
  const [code, setCode] = useState('')

  // Re-seed the local drafts whenever the selected member changes.
  useEffect(() => {
    setName(node?.name ?? '')
    setCode(node?.code ?? '')
  }, [node?.id, node?.name, node?.code])

  if (!node) {
    return (
      <Card size="small" title="Member detail">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Select a member to edit" />
      </Card>
    )
  }

  const commitName = () => {
    const next = name.trim()
    if (next && next !== node.name) factors.renameNode(node.id, next)
    else setName(node.name)
  }

  const commitCode = () => {
    if (code !== (node.code ?? '')) factors.setNodeCode(node.id, code)
  }

  return (
    <Card size="small" title="Member detail" extra={level && <Tag color="blue">{level.name}</Tag>}>
      <Flex vertical gap={12}>
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Name
          </Typography.Text>
          <Input value={name} onChange={(e) => setName(e.target.value)} onBlur={commitName} onPressEnter={commitName} />
        </div>
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Code <Typography.Text type="secondary">(optional short tag)</Typography.Text>
          </Typography.Text>
          <Input value={code} placeholder="—" onChange={(e) => setCode(e.target.value)} onBlur={commitCode} onPressEnter={commitCode} />
        </div>
        <Descriptions size="small" column={1} styles={{ label: { width: 110 } }}>
          <Descriptions.Item label="Level">{level?.name ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Children">{node.children.length}</Descriptions.Item>
        </Descriptions>
      </Flex>
    </Card>
  )
})
