import { observer } from 'mobx-react-lite'
import { ConfigProvider, Splitter } from 'antd'
import { createStyles } from 'antd-style'
import { DocumentTabs } from './views/DocumentTabs'
import { TaskListPanel } from './views/TaskListPanel'
import { OutlinePanel } from './views/OutlinePanel'
import { DocumentPanel } from './views/DocumentPanel'
import { CommentsPanel } from './views/CommentsPanel'
import './main-page.scss'

const useStyles = createStyles(() => ({
  dragger: {
    '&::before': {
      background: '#bfbfbf !important',
    },
    '&:hover::before': {
      background: '#bfbfbf !important',
    },
  },
  draggerActive: {
    '&::before': {
      background: '#bfbfbf !important',
    },
  },
}))

export const MainPage = observer(() => {
  const { styles } = useStyles()

  return (
    <ConfigProvider
      theme={{
        components: {
          Splitter: { splitBarSize: 2, splitTriggerSize: 16 },
        },
      }}
    >
      <div className="main-page">
        <DocumentTabs />
        <Splitter className="main-page__panels" draggerIcon={null} classNames={{ dragger: { default: styles.dragger, active: styles.draggerActive } }}>
          <Splitter.Panel defaultSize="18%" min="10%" max="40%">
            <TaskListPanel />
          </Splitter.Panel>
          <Splitter.Panel defaultSize="18%" min="10%" max="40%">
            <OutlinePanel />
          </Splitter.Panel>
          <Splitter.Panel defaultSize="45%" min="20%" max="80%">
            <DocumentPanel />
          </Splitter.Panel>
          <Splitter.Panel defaultSize="19%" min="10%" max="40%">
            <CommentsPanel />
          </Splitter.Panel>
        </Splitter>
      </div>
    </ConfigProvider>
  )
})
