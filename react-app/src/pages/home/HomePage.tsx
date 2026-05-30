import { Card, Col, Flex, Layout, Row, Space, Tag, Tooltip, Typography, theme } from 'antd'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import logoLight from '@/assets/aplanner-light.png'
import { AxMuiIcon, type MdiIconName } from '@/shared/mui-icon/AxMuiIcon.tsx'

type AppCard = {
  id: 'pps' | 'eps' | 'mps'
  path: string
  code: string
  title: string
  subtitle: string
  description: string
  icon: MdiIconName
  accent: string
  status: 'live' | 'beta' | 'preview'
  pillar: string
  capabilities: string[]
}

const APPS: AppCard[] = [
  {
    id: 'pps',
    path: '/pps',
    code: 'PPS',
    title: 'Product Planning Simulation',
    subtitle: 'Portfolio and roadmap planning',
    description: 'Shape the product portfolio: align market demand, business cases, and platform investments before engineering and manufacturing commit.',
    icon: 'mdiViewDashboardOutline',
    accent: '#3F51B5',
    status: 'preview',
    pillar: 'PLAN — Portfolio',
    capabilities: ['Demand forecast', 'Portfolio mix', 'Business case'],
  },
  {
    id: 'eps',
    path: '/eps',
    code: 'EPS · IRIS',
    title: 'Engineering Planning Simulation',
    subtitle: 'IRIS — Intelligent Resources Information System',
    description:
      "Samsung DSR's resource planning workspace. P/M planner with concurrent editing, version-managed roadmaps, what-if sandbox, and bi-directional sync with N-PLM / SMDM / GHRP / PROMIS.",
    icon: 'mdiBrain',
    accent: '#673AB7',
    status: 'beta',
    pillar: 'PLAN — R&D · Samsung DSR',
    capabilities: ['P/M Gantt', 'Roadmap versioning', 'Simulation sandbox', 'AI co-pilot'],
  },
  {
    id: 'mps',
    path: '/mps',
    code: 'MPS',
    title: 'Manufacturing Planning Simulation',
    subtitle: 'Fab capacity and order scheduling',
    description: 'Plan production orders against fab capacity. Run what-if simulations, resolve tool group violations and publish a viable shop-floor plan.',
    icon: 'mdiFactory',
    accent: '#009688',
    status: 'live',
    pillar: 'PLAN — Fab',
    capabilities: ['Order schedule', 'Tool group OEE', 'Compare plans'],
  },
]

const STATUS_COLOR: Record<AppCard['status'], string> = {
  live: 'green',
  beta: 'purple',
  preview: 'default',
}

const STATUS_LABEL: Record<AppCard['status'], string> = {
  live: 'LIVE',
  beta: 'BETA',
  preview: 'PREVIEW',
}

export const HomePage = observer(() => {
  const { token } = theme.useToken()
  const navigate = useNavigate()

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
                  Choose a planning workspace
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
            Pick the simulation that matches your planning horizon. Each workspace shares the same gantt, capacity and AI co-pilot patterns,
            so switching between portfolio, engineering (IRIS) and manufacturing planning feels familiar. Samsung DSR planners start with EPS.
          </Typography.Paragraph>

          <Row gutter={[24, 24]}>
            {APPS.map((app) => (
              <Col key={app.id} xs={24} md={12} xl={8}>
                <Card
                  hoverable
                  onClick={() => navigate(app.path)}
                  style={{
                    height: '100%',
                    borderRadius: 16,
                    borderColor: token.colorBorderSecondary,
                    boxShadow: '0 6px 24px rgba(15, 23, 42, 0.06)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                  styles={{ body: { padding: 24, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 } }}
                >
                  <Flex align="center" justify="space-between">
                    <Flex
                      align="center"
                      justify="center"
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: `${app.accent}1A`,
                        color: app.accent,
                      }}
                    >
                      <AxMuiIcon icon={app.icon} size="1.75rem" />
                    </Flex>
                    <Tag color={STATUS_COLOR[app.status]} style={{ borderRadius: 999 }}>
                      {STATUS_LABEL[app.status]}
                    </Tag>
                  </Flex>

                  <Flex vertical gap={4}>
                    <Typography.Text type="secondary" style={{ fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                      {app.code} · {app.pillar}
                    </Typography.Text>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                      {app.title}
                    </Typography.Title>
                    <Typography.Text type="secondary">{app.subtitle}</Typography.Text>
                  </Flex>

                  <Typography.Paragraph style={{ marginBottom: 0, color: token.colorTextSecondary }}>{app.description}</Typography.Paragraph>

                  <Flex wrap="wrap" gap={8} style={{ marginTop: 'auto' }}>
                    {app.capabilities.map((c) => (
                      <Tag key={c} style={{ borderRadius: 999 }}>
                        {c}
                      </Tag>
                    ))}
                  </Flex>

                  <Flex align="center" justify="space-between" style={{ paddingTop: 8 }}>
                    <Typography.Text style={{ color: app.accent, fontWeight: 500 }}>Open workspace</Typography.Text>
                    <AxMuiIcon icon="mdiArrowRight" size="1.2rem" color={app.accent} />
                  </Flex>
                </Card>
              </Col>
            ))}
          </Row>

          <Flex align="center" gap={12} style={{ paddingTop: 12, color: token.colorTextTertiary }}>
            <AxMuiIcon icon="mdiInformationOutline" size="1rem" />
            <Typography.Text type="secondary">
              EPS and MPS share data flow patterns. Plans created in one workspace can be referenced from the others as upstream/downstream context.
            </Typography.Text>
          </Flex>
        </Flex>
      </Layout.Content>
    </Layout>
  )
})
