import { Button, Card, Flex, Layout, Space, Tag, Typography, theme } from 'antd'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

export const PpsPage = observer(() => {
  const { token } = theme.useToken()
  const navigate = useNavigate()

  return (
    <Layout className="ax-layout">
      <Layout.Content style={{ minHeight: '100vh', background: token.colorBgLayout, padding: '48px 56px', overflow: 'auto' }}>
        <Flex vertical gap={24} style={{ maxWidth: 920, margin: '0 auto' }}>
          <Space size={12}>
            <Button type="text" icon={<AxMuiIcon icon="mdiArrowLeft" size="1rem" />} onClick={() => navigate('/')}>
              Back to home
            </Button>
          </Space>
          <Flex vertical gap={8}>
            <Typography.Text type="secondary" style={{ letterSpacing: 1.4, textTransform: 'uppercase', fontSize: 13 }}>
              PPS · Product Planning Simulation
            </Typography.Text>
            <Typography.Title level={2} style={{ margin: 0 }}>
              Product portfolio planning is coming next
            </Typography.Title>
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0, maxWidth: 720 }}>
              PPS shapes the upstream view that feeds EPS and MPS. It lines up market demand, business cases and platform investments before
              engineering and manufacturing commit. The workspace will mirror the EPS / MPS shell — gantt simulation, capacity tuning and an AI
              co-pilot — adapted to portfolio decisions.
            </Typography.Paragraph>
          </Flex>

          <Card style={{ borderRadius: 16 }} styles={{ body: { padding: 24 } }}>
            <Flex vertical gap={16}>
              <Flex align="center" gap={12}>
                <AxMuiIcon icon="mdiClockOutline" size="1.4rem" color={token.colorPrimary} />
                <Typography.Title level={5} style={{ margin: 0 }}>
                  Planned scope
                </Typography.Title>
              </Flex>
              <Flex vertical gap={8}>
                <Typography.Text>· Portfolio mix simulation across product families and platforms.</Typography.Text>
                <Typography.Text>· Demand forecast intake from sales / marketing planning.</Typography.Text>
                <Typography.Text>· Business case scoring against capacity and capital budgets.</Typography.Text>
                <Typography.Text>· Downstream handoff to EPS (R&amp;D plan) and MPS (fab plan).</Typography.Text>
              </Flex>
              <Flex gap={8} wrap="wrap">
                <Tag color="default">Roadmap</Tag>
                <Tag color="default">Demand</Tag>
                <Tag color="default">Capital</Tag>
                <Tag color="purple">Preview</Tag>
              </Flex>
            </Flex>
          </Card>

          <Flex gap={12}>
            <Button type="primary" onClick={() => navigate('/eps')}>
              Open EPS workspace
            </Button>
            <Button onClick={() => navigate('/mps')}>Open MPS workspace</Button>
          </Flex>
        </Flex>
      </Layout.Content>
    </Layout>
  )
})
