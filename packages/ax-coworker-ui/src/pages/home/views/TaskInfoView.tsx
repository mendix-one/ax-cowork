import { observer } from 'mobx-react-lite'
import { Collapse, ConfigProvider } from 'antd'
import { AxMuiIcon } from '../../../shared/mui-icon/AxMuiIcon.tsx'
import { AxScrollBox } from '../../../shared/scroll-box/AxScrollBox.tsx'

const item = (icon: string, label: string, key?: number | string) => (
  <div key={key} className="flex items-center gap-2 px-2 py-1 text-neutral-700 hover:bg-neutral-100 cursor-pointer rounded">
    <AxMuiIcon icon={icon} size={16} />
    <span>{label}</span>
  </div>
)

const repeated = (icon: string, label: string, count: number) => Array.from({ length: count }, (_, i) => item(icon, label, i))

export const TaskInfoView = observer(() => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Collapse: {
            headerPadding: '4px 8px',
            contentPadding: '8px',
            borderlessContentPadding: '8px',
          },
        },
      }}
    >
      <AxScrollBox>
        <Collapse
          bordered={false}
          defaultActiveKey={['materials', 'linked', 'related', 'history']}
          items={[
            {
              key: 'materials',
              label: <span className="font-medium">Materials</span>,
              children: (
                <>
                  {item('mdiFlagOutline', 'Status', 'status')}
                  {item('mdiAlertOctagonOutline', 'Priority', 'priority')}
                  {item('mdiCalendarOutline', 'Date', 'date')}
                  {item('mdiTagOutline', 'Tag', 'tag')}
                  {item('mdiInformationOutline', 'Other Information', 'other')}
                </>
              ),
            },
            {
              key: 'linked',
              label: <span className="font-semibold">Linked Items</span>,
              children: <>{repeated('mdiLinkVariant', 'Sample Item of Linked', 3)}</>,
            },
            {
              key: 'related',
              label: <span className="font-semibold">Related Links</span>,
              children: <>{repeated('mdiOpenInNew', 'Sample Item of Linked', 3)}</>,
            },
            {
              key: 'history',
              label: <span className="font-semibold">History</span>,
              children: <>{repeated('mdiHistory', 'Sample Sample of change', 5)}</>,
            },
          ]}
        />
      </AxScrollBox>
    </ConfigProvider>
  )
})
