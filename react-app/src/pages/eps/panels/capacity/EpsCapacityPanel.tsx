import { Flex, Space, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { EpsCapacityOrgTree } from './EpsCapacityOrgTree'
import { EpsCapacitySummary } from './EpsCapacitySummary'
import { EpsCapacityTable } from './EpsCapacityTable'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Headcount Portfolio — read-only master data, aligned to the Organization hierarchy and the Engineering
// Skills taxonomy, synced in from the HR system (GHRP).
//   • Left  = Department › Site › Team › Group › Part navigator (headcount rolls up).
//   • Right = summary box (totals + skill distribution) + Organization × Skill detail table.

const HeadcountToolbar = observer(() => {
  const store = useEpsContext().capacity
  return (
    <Flex align="center" justify="space-between" gap="small" className="ax-eps-simulation_toolbar" style={{ width: '100%' }}>
      <Typography.Text type="secondary" className="text-sm">
        Read-only Headcount Portfolio — master data aligned to organization × engineering skills. Pick an org node to inspect its headcount.
      </Typography.Text>
      <Space size={8}>
        <Tag icon={<AxMuiIcon icon="mdiCloudCheckOutline" size={13} />} color="blue" style={{ margin: 0 }}>
          Synced from {store.source}
        </Tag>
        <Typography.Text type="secondary" className="text-sm">
          {store.syncedAt}
        </Typography.Text>
      </Space>
    </Flex>
  )
})

export const EpsCapacityPanel = observer((props: MainPanelControls) => {
  return (
    <AxDisplayPanel type="main" icon="mdiAccountGroupOutline" title="Headcount Portfolio" tools={<HeadcountToolbar />} {...props}>
      <div className="ax-eps-capacity">
        <div className="ax-eps-capacity_body">
          <EpsCapacityOrgTree />
          <div className="ax-eps-capacity_main">
            <div className="ax-eps-analysis_scroll">
              <div className="ax-eps-analysis_section">
                <EpsCapacitySummary />
              </div>
              <div className="ax-eps-analysis_section">
                <div className="ax-eps-analysis_section_title">Headcount detail · Organization × Skill</div>
                <EpsCapacityTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
