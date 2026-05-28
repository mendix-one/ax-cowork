import { Flex, Space, Typography } from 'antd'
import { observer } from 'mobx-react-lite'

// Process view is read-only — no date picker, no save/undo. The Technology Routings list lives in a
// persistent left sidebar (like the Adjustment sidebar on the other panels), so there's no toggle
// here either. Toolbar carries just the help text describing what this view is.
export const MpsProcessToolbar = observer(() => {
  return (
    <Flex align="center" justify="space-between" gap="small" className="ax-simulation_toolbar" style={{ width: '100%' }}>
      <Space size={10}>
        <Typography.Text type="secondary" className="text-sm">
          Read-only view of the manufacturing routing per technology — pick a tech on the left to see its pipeline.
        </Typography.Text>
      </Space>
    </Flex>
  )
})
