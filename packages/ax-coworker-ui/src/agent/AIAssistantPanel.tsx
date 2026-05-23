import { type KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import { Avatar, Button, Empty, Flex, Input, Space, Spin, Typography } from 'antd'
import { createStyles } from 'antd-style'
import { AxDisplayPanel, type SubPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

type Role = 'user' | 'assistant'
type Message = { id: string; role: Role; content: string }

const useStyles = createStyles(({ token }) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: token.padding,
    gap: token.padding,
  },
  messages: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    paddingRight: token.paddingXXS,
  },
  empty: {
    margin: 'auto 0',
  },
  bubble: {
    maxWidth: '78%',
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
}))

export const AIAssistantPanel = (props: SubPanelControls) => {
  const { styles, cx } = useStyles()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, isThinking])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isThinking) return
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsThinking(true)
    window.setTimeout(() => {
      const reply: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `(mocked) I heard: "${text}"`,
      }
      setMessages((prev) => [...prev, reply])
      setIsThinking(false)
    }, 600)
  }

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = input.trim().length > 0 && !isThinking

  return (
    <AxDisplayPanel type="sub" icon="mdiCreationOutline" title="AI Assistant" {...props}>
      <Flex vertical gap="small" className={styles.root}>
        <div ref={listRef} className={styles.messages}>
          {messages.length === 0 && !isThinking ? (
            <Empty className={styles.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} description="Ask anything to get started" />
          ) : (
            <Flex vertical gap="small">
              {messages.map((m) => (
                <Flex key={m.id} justify={m.role === 'user' ? 'flex-end' : 'flex-start'} gap="small" align="flex-start">
                  {m.role === 'assistant' && (
                    <Avatar size="small" className={styles.avatarAssistant} icon={<AxMuiIcon icon="mdiCreationOutline" size={14} />} />
                  )}
                  <div className={cx(styles.bubble, m.role === 'user' ? styles.userBubble : styles.assistantBubble)}>
                    <Typography.Text style={{ color: 'inherit' }}>{m.content}</Typography.Text>
                  </div>
                  {m.role === 'user' && <Avatar size="small" className={styles.avatarUser} icon={<AxMuiIcon icon="mdiAccountOutline" size={14} />} />}
                </Flex>
              ))}
              {isThinking && (
                <Flex justify="flex-start" gap="small" align="center">
                  <Avatar size="small" className={styles.avatarAssistant} icon={<AxMuiIcon icon="mdiCreationOutline" size={14} />} />
                  <Spin size="small" />
                </Flex>
              )}
            </Flex>
          )}
        </div>
        <Space.Compact style={{ width: '100%' }}>
          <Input.TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoSize={{ minRows: 1, maxRows: 4 }}
            placeholder="Ask AI Assistant…"
            disabled={isThinking}
          />
          <Button type="primary" icon={<AxMuiIcon icon="mdiSend" size={16} />} onClick={handleSend} disabled={!canSend} />
        </Space.Compact>
      </Flex>
    </AxDisplayPanel>
  )
}
