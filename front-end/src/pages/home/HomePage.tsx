import { observer } from 'mobx-react-lite'
import { ConfigProvider, Splitter, theme } from 'antd'
import { createStyles } from 'antd-style'
import { AxSimplePanel } from '../../shared/simple-panel/AxSimplePanel.tsx'
import { TaskInfoView } from './views/TaskInfoView.tsx'
import { ConsoleView } from './views/ConsoleView.tsx'
import { ProgressView } from './views/ProgressView.tsx'
import { GenerativeAIView } from './views/GenerativeAIView.tsx'
import { DocumentView } from './views/DocumentView.tsx'

const useStyles = createStyles(({ token }) => ({
  dragger: {
    '&::before': {
      background: `${token.colorBgLayout} !important`,
    },
    '&:hover::before': {
      background: `${token.colorBgLayout} !important`,
    },
  },
  draggerActive: {
    '&::before': {
      background: `${token.colorBgLayout} !important`,
    },
  },
}))

export const HomePage = observer(() => {
  const { token } = theme.useToken()
  const { styles } = useStyles(token)

  return (
    <ConfigProvider
      theme={{
        components: {
          Splitter: { splitBarSize: 4, splitTriggerSize: 16 },
        },
      }}
    >
      <Splitter
        draggerIcon={null}
        style={{ height: '100%', width: '100%' }}
        classNames={{ dragger: { default: styles.dragger, active: styles.draggerActive } }}
      >
        <Splitter.Panel style={{ padding: 0, paddingRight: '2px' }} defaultSize="75%" min="20%" max="90%">
          <Splitter vertical draggerIcon={null} classNames={{ dragger: { default: styles.dragger, active: styles.draggerActive } }}>
            <Splitter.Panel style={{ padding: 0, paddingBottom: '2px' }} defaultSize="75%" min="15%" max="85%">
              <Splitter draggerIcon={null} classNames={{ dragger: { default: styles.dragger, active: styles.draggerActive } }}>
                <Splitter.Panel style={{ padding: 0, paddingRight: '2px' }} defaultSize="15%" min="10%" max="80%">
                  <AxSimplePanel icon="mdiCardTextOutline" title="Task Info">
                    <TaskInfoView />
                  </AxSimplePanel>
                </Splitter.Panel>
                <Splitter.Panel style={{ padding: 0, paddingLeft: '2px' }} defaultSize="70%" min="10%" max="80%">
                  <AxSimplePanel icon="mdiFileDocumentOutline" title="Document Name">
                    <DocumentView />
                  </AxSimplePanel>
                </Splitter.Panel>
              </Splitter>
            </Splitter.Panel>
            <Splitter.Panel style={{ padding: 0, paddingTop: '2px' }} defaultSize="25%" min="15%" max="85%">
              <AxSimplePanel icon="mdiConsole" title="Console">
                <ConsoleView />
              </AxSimplePanel>
            </Splitter.Panel>
          </Splitter>
        </Splitter.Panel>
        <Splitter.Panel style={{ padding: 0, paddingLeft: '2px' }} defaultSize="25%" min="10%" max="80%">
          <Splitter vertical draggerIcon={null} classNames={{ dragger: { default: styles.dragger, active: styles.draggerActive } }}>
            <Splitter.Panel style={{ padding: 0, paddingBottom: '2px' }} defaultSize="50%" min="15%" max="85%">
              <AxSimplePanel icon="mdiCreationOutline" title="Generative AI">
                <GenerativeAIView />
              </AxSimplePanel>
            </Splitter.Panel>
            <Splitter.Panel style={{ padding: 0, paddingTop: '2px' }} defaultSize="50%" min="15%" max="85%">
              <AxSimplePanel icon="mdiProgressStarFourPoints" title="Progress">
                <ProgressView />
              </AxSimplePanel>
            </Splitter.Panel>
          </Splitter>
        </Splitter.Panel>
      </Splitter>
    </ConfigProvider>
  )
})
