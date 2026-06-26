import { Card, Col, Flex, Row, Tag, Typography, theme } from 'antd'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useHomeContext } from '@/pages/home/stores/home.context'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Main content of the home shell — the production-line selector (SOC / Sensor / LSI groups → line cards).
// All catalog data, the per-group visual identity and the "last used" highlight come from the HomeStore;
// picking a line scopes the shared selection (via the store) and opens the EPS workspace.
export const HomeLineSelector = observer(() => {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const home = useHomeContext()

  const openLine = (id: string) => {
    home.select(id)
    navigate('/eps')
  }

  return (
    <div
      style={{
        minHeight: '100%',
        padding: '40px 48px',
      }}
    >
      <Flex vertical gap={32} style={{ maxWidth: 1200, margin: '0 auto' }}>
        {home.groups.map((group) => {
          const lines = home.linesByGroup(group.id)
          const style = home.groupStyle(group.id)
          return (
            <Flex key={group.id} vertical gap={16}>
              <Flex align="center" gap={12}>
                <Flex align="center" justify="center" style={{ width: 36, height: 36, borderRadius: 10, background: `${style.accent}1A`, color: style.accent }}>
                  <AxMuiIcon icon={style.icon} size="1.4rem" />
                </Flex>
                <Flex vertical>
                  <Typography.Title level={5} style={{ margin: 0 }}>
                    {group.label}
                  </Typography.Title>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {group.description}
                  </Typography.Text>
                </Flex>
              </Flex>

              <Row gutter={[20, 20]}>
                {lines.map((line) => (
                  <Col key={line.id} xs={24} sm={12} xl={8}>
                    <Card
                      hoverable
                      onClick={() => openLine(line.id)}
                      style={{
                        height: '100%',
                        borderRadius: 14,
                        borderColor: home.selectedId === line.id ? style.accent : token.colorBorderSecondary,
                        boxShadow: '0 4px 18px rgba(15, 23, 42, 0.05)',
                        cursor: 'pointer',
                      }}
                      styles={{ body: { padding: 20, height: '100%', display: 'flex', flexDirection: 'column', gap: 12 } }}
                    >
                      <Flex align="center" justify="space-between">
                        <Tag color="default" style={{ borderRadius: 999, fontWeight: 600, color: style.accent, borderColor: `${style.accent}55` }}>
                          {line.code}
                        </Tag>
                        {home.selectedId === line.id && (
                          <Tag color="processing" style={{ borderRadius: 999 }}>
                            LAST USED
                          </Tag>
                        )}
                      </Flex>

                      <Flex vertical gap={2}>
                        <Typography.Title level={5} style={{ margin: 0 }}>
                          {line.name}
                        </Typography.Title>
                        <Typography.Text type="secondary">{line.description}</Typography.Text>
                      </Flex>

                      <Flex align="center" justify="space-between" style={{ marginTop: 'auto', paddingTop: 8 }}>
                        <Typography.Text style={{ color: style.accent, fontWeight: 500 }}>Open in EPS</Typography.Text>
                        <AxMuiIcon icon="mdiArrowRight" size="1.2rem" color={style.accent} />
                      </Flex>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Flex>
          )
        })}
      </Flex>
    </div>
  )
})
