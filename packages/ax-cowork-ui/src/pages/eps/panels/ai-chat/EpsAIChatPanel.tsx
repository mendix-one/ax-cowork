import { type KeyboardEventHandler } from 'react'
import { Avatar, Button, Card, Flex, Input, Space, Spin, Tag, Typography } from 'antd'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { AxDisplayPanel, type SubPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

const useStyles = createStyles(({ token }) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: token.padding,
    gap: token.padding,
    background: token.colorBgContainer,
  },
  meta: {
    fontSize: 12,
    color: token.colorTextSecondary,
  },
  messages: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    paddingInlineEnd: token.paddingXXS,
  },
  bubble: {
    maxWidth: '92%',
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    borderRadius: token.borderRadiusLG,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  userBubble: {
    background: token.colorPrimary,
    color: token.colorTextLightSolid,
  },
  assistantBubble: {
    background: token.colorFillSecondary,
    color: token.colorText,
  },
  avatarAssistant: {
    background: token.colorPrimaryBg,
    color: token.colorPrimary,
    flexShrink: 0,
  },
  avatarUser: {
    background: token.colorFillTertiary,
    color: token.colorText,
    flexShrink: 0,
  },
  scenario: {
    marginTop: token.paddingXS,
    padding: 8,
    borderRadius: token.borderRadiusSM,
    background: token.colorBgContainer,
    border: `1px solid ${token.colorBorderSecondary}`,
  },
}))

export const EpsAIChatPanel = observer((props: SubPanelControls) => {
  const { styles, cx } = useStyles()
  const simulation = useEpsContext()
  const store = simulation.aiChat

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      store.send()
    }
  }

  return (
    <AxDisplayPanel type="sub" icon="mdiCreationOutline" title="AI Assistant" {...props}>
      <Flex vertical gap="small" className={styles.root}>
        <Space size={6} className={styles.meta} wrap>
          <span>{simulation.activeEpsPlan.name}</span>
          <span>·</span>
          <span>{simulation.activeProductionLine.name}</span>
          <span>·</span>
          <span>Context: 2 lots selected (PO-119, PO-120)</span>
        </Space>

        <div className={styles.messages}>
          <Flex vertical gap="small">
            {store.messages.map((m) => (
              <Flex key={m.id} justify={m.role === 'user' ? 'flex-end' : 'flex-start'} gap="small" align="flex-start">
                {m.role === 'assistant' && <Avatar size="small" className={styles.avatarAssistant} icon={<AxMuiIcon icon="mdiCreationOutline" size={14} />} />}
                <div className={cx(styles.bubble, m.role === 'user' ? styles.userBubble : styles.assistantBubble)}>
                  <Typography.Text style={{ color: 'inherit' }}>{m.content}</Typography.Text>
                  {m.scenarios?.map((s) => (
                    <div key={s.id} className={styles.scenario}>
                      <Flex justify="space-between" align="center">
                        <Typography.Text strong>
                          ▶ {s.letter}: {s.title}
                        </Typography.Text>
                        <Button size="small">Preview</Button>
                      </Flex>
                      <Typography.Text style={{ fontSize: 12 }} type="secondary">
                        {s.detail}
                      </Typography.Text>
                    </div>
                  ))}
                  {m.explainability && (
                    <div style={{ marginTop: 8 }}>
                      <Typography.Text style={{ fontSize: 12 }}>Why A first?</Typography.Text>
                      <ul style={{ paddingInlineStart: 18, margin: 0 }}>
                        {m.explainability.map((e, i) => (
                          <li key={i}>
                            <Typography.Text style={{ fontSize: 12 }}>{e}</Typography.Text>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {m.role === 'user' && <Avatar size="small" className={styles.avatarUser} icon={<AxMuiIcon icon="mdiAccountOutline" size={14} />} />}
              </Flex>
            ))}
            {store.thinking && (
              <Flex justify="flex-start" gap="small" align="center">
                <Avatar size="small" className={styles.avatarAssistant} icon={<AxMuiIcon icon="mdiCreationOutline" size={14} />} />
                <Spin size="small" />
              </Flex>
            )}
          </Flex>
        </div>

        <Card size="small" style={{ background: 'transparent' }}>
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>
            Quick prompts
          </Typography.Text>
          <Space size={6} wrap style={{ marginTop: 4 }}>
            {store.quickPrompts.map((p) => (
              <Tag key={p} style={{ cursor: 'pointer' }} onClick={() => store.setInput(p + ': ')}>
                {p}
              </Tag>
            ))}
          </Space>
        </Card>

        <Space.Compact style={{ width: '100%' }}>
          <Input.TextArea
            value={store.input}
            onChange={(e) => store.setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoSize={{ minRows: 1, maxRows: 4 }}
            placeholder="Ask AI Assistant…"
            disabled={store.thinking}
          />
          <Button type="primary" icon={<AxMuiIcon icon="mdiSend" size={16} />} onClick={() => store.send()} disabled={!store.input.trim() || store.thinking} />
        </Space.Compact>
      </Flex>
    </AxDisplayPanel>
  )
})
