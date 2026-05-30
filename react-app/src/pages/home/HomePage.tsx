import { Card, Col, Flex, Layout, Row, Space, Tag, Tooltip, Typography, theme } from 'antd'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import logoLight from '@/assets/aplanner-light.png'
import { useStore } from '@/acore/store/store.context'
import type { ProductionLineGroupId } from '@/acore/store/production-line.store'
import { AxMuiIcon, type MdiIconName } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Visual identity per BizGroup — accent + icon. Colors mirror the AntD brand tokens
// (primary / secondary / tertiary) defined in acore/theme.
const GROUP_STYLE: Record<ProductionLineGroupId, { accent: string; icon: MdiIconName }> = {
  SOC: { accent: '#3F51B5', icon: 'mdiChip' },
  Sensor: { accent: '#009688', icon: 'mdiCameraIris' },
  LSI: { accent: '#673AB7', icon: 'mdiMemory' },
}

export const HomePage = observer(() => {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const { productionLine } = useStore()

  const openLine = (id: string) => {
    productionLine.setSelected(id)
    navigate('/eps')
  }

  return (
    <Layout className="ax-layout">
      <Layout.Content
        style={{
          minHeight: '100vh',
          background: `radial-gradient(circle at 20% 0%, ${token.colorPrimaryBg} 0%, ${token.colorBgLayout} 55%, ${token.colorBgLayout} 100%)`,
          padding: '48px 56px',
          overflow: 'auto',
        }}
      >
        <Flex vertical gap={32} style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Flex align="center" justify="space-between" wrap="wrap" gap={16}>
            <Flex align="center" gap={16}>
              <img src={logoLight} alt="ax-cowork" style={{ width: 140, height: 'auto' }} />
              <Flex vertical>
                <Typography.Text type="secondary" style={{ fontSize: 13, letterSpacing: 1.4, textTransform: 'uppercase' }}>
                  ax-cowork · planning suite
                </Typography.Text>
                <Typography.Title level={3} style={{ margin: 0 }}>
                  Select a production line
                </Typography.Title>
              </Flex>
            </Flex>
            <Space size={12}>
              <Tag color="default" style={{ borderRadius: 999, padding: '2px 12px' }}>
                Samsung DSR · Pilot
              </Tag>
              <Tooltip title="Switch language / settings will return in a later release">
                <Tag color="default" style={{ borderRadius: 999, padding: '2px 12px' }}>
                  EN
                </Tag>
              </Tooltip>
            </Space>
          </Flex>

          <Typography.Paragraph type="secondary" style={{ maxWidth: 760, marginBottom: 0 }}>
            Pick the production line to plan. The EPS · IRIS workspace — roadmap versions, headcount portfolio and PROMIS sync — opens scoped to the line you
            choose. You can switch lines later from the workspace header.
          </Typography.Paragraph>

          {productionLine.groups.map((group) => {
            const lines = productionLine.linesByGroup(group.id)
            const style = GROUP_STYLE[group.id]
            return (
              <Flex key={group.id} vertical gap={16}>
                <Flex align="center" gap={12}>
                  <Flex
                    align="center"
                    justify="center"
                    style={{ width: 36, height: 36, borderRadius: 10, background: `${style.accent}1A`, color: style.accent }}
                  >
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
                          borderColor: productionLine.selectedId === line.id ? style.accent : token.colorBorderSecondary,
                          boxShadow: '0 4px 18px rgba(15, 23, 42, 0.05)',
                          cursor: 'pointer',
                        }}
                        styles={{ body: { padding: 20, height: '100%', display: 'flex', flexDirection: 'column', gap: 12 } }}
                      >
                        <Flex align="center" justify="space-between">
                          <Tag color="default" style={{ borderRadius: 999, fontWeight: 600, color: style.accent, borderColor: `${style.accent}55` }}>
                            {line.code}
                          </Tag>
                          {productionLine.selectedId === line.id && (
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

          <Flex align="center" gap={12} style={{ paddingTop: 12, color: token.colorTextTertiary }}>
            <AxMuiIcon icon="mdiInformationOutline" size="1rem" />
            <Typography.Text type="secondary">
              The selected production line scopes the EPS workspace. Plans created here can be referenced from PPS / MPS as upstream / downstream context.
            </Typography.Text>
          </Flex>
        </Flex>
      </Layout.Content>
    </Layout>
  )
})
