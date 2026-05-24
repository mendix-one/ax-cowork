import { Avatar, Card, Empty, Flex, Spin, Tag, Tooltip, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useAccountStore } from '../store/account.context'

// Lists the apps the caller has at least one role in, grouped per app. Data is sourced
// from the /getProfile GraphQL query the AccountStore runs on modal open.
export const ApplicationRolesView = observer(() => {
  const { t } = useTranslation('app')
  const store = useAccountStore()

  if (store.isLoading && store.appRoles.length === 0) {
    return (
      <Flex align="center" justify="center" style={{ height: '100%', padding: 0 }}>
        <Spin />
      </Flex>
    )
  }

  if (store.appRoles.length === 0) {
    return (
      <Flex align="center" justify="center" style={{ height: '100%', padding: 0 }}>
        <Empty description={t('account.todo')} />
      </Flex>
    )
  }

  return (
    <Flex vertical gap={12} style={{ padding: 0 }}>
      {store.appRoles.map(({ app, roles }) => {
        const initial = (app.name ?? app.key).charAt(0).toUpperCase()
        return (
          <Card key={app.uuid || app.key} size="small" variant="outlined">
            <Flex vertical gap={8}>
              {/* App header — avatar on the left, app name + key on the right. */}
              <Flex align="center" gap={12}>
                <Avatar size={36} src={app.avatar ?? undefined}>
                  {initial}
                </Avatar>
                <Flex vertical style={{ minWidth: 0, flex: 1 }}>
                  <Typography.Text strong ellipsis>
                    {app.name}
                  </Typography.Text>
                  {app.description && (
                    <Typography.Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                      {app.description}
                    </Typography.Text>
                  )}
                </Flex>
                <Tag>{app.key}</Tag>
              </Flex>

              {/* Roles for this app — each role is a tag; the description (if any) is in a tooltip. */}
              <Flex wrap gap={4}>
                {roles.map((r) => {
                  const tag = (
                    <Tag key={r.key} color="blue">
                      {r.name}
                    </Tag>
                  )
                  return r.description ? (
                    <Tooltip key={r.key} title={r.description}>
                      {tag}
                    </Tooltip>
                  ) : (
                    tag
                  )
                })}
              </Flex>
            </Flex>
          </Card>
        )
      })}
    </Flex>
  )
})
