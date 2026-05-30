import { Avatar, Card, Empty, Flex, Spin, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useAccountStore } from '../store/account.context'

// Lists the caller's active sessions (one per app they're signed into) — sourced from the
// /getProfile GraphQL query the AccountStore runs on modal open. Same Card-per-app layout
// as ApplicationRolesView so the two role-/session-grouping surfaces stay visually consistent.
export const ActiveSessionView = observer(() => {
  const { t } = useTranslation('app')
  const store = useAccountStore()

  if (store.isLoading && store.sessions.length === 0) {
    return (
      <Flex align="center" justify="center" style={{ height: '100%', padding: 0 }}>
        <Spin />
      </Flex>
    )
  }

  if (store.sessions.length === 0) {
    return (
      <Flex align="center" justify="center" style={{ height: '100%', padding: 0 }}>
        <Empty description={t('account.todo')} />
      </Flex>
    )
  }

  return (
    <Flex vertical gap={12} style={{ padding: 0 }}>
      {store.sessions.map((s) => {
        const name = s.app.name ?? s.app.key ?? s.app.uuid
        const initial = (s.app.name ?? s.app.key ?? 'S').charAt(0).toUpperCase()
        return (
          <Card key={s.uuid} size="small" variant="outlined">
            <Flex vertical gap={8}>
              {/* App header — avatar (left) + app name + optional description + app key tag (right). */}
              <Flex align="center" gap={12}>
                <Avatar size={36} src={s.app.avatar ?? undefined}>
                  {initial}
                </Avatar>
                <Flex vertical style={{ minWidth: 0, flex: 1 }}>
                  <Typography.Text strong ellipsis>
                    {name}
                  </Typography.Text>
                  {s.app.description && (
                    <Typography.Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                      {s.app.description}
                    </Typography.Text>
                  )}
                </Flex>
                {s.app.key && <Tag>{s.app.key}</Tag>}
              </Flex>

              {/* Session detail — for now just the expiry. Add more fields here (created-at,
                  IP, "kill session" action) as the surface grows. */}
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Expires {new Date(s.expiresAt).toLocaleString()}
              </Typography.Text>
            </Flex>
          </Card>
        )
      })}
    </Flex>
  )
})
