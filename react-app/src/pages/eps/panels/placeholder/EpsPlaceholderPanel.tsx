import { Flex, Typography, theme } from 'antd'
import { createStyles } from 'antd-style'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { AxMuiIcon, type MdiIconName } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Shared scaffold for not-yet-built main panels. Keeps the new rail entries (Projects / Standard PM /
// Settings) mountable and on-brand until each gets a real implementation — same chrome (header + maximize)
// as the live panels, with a centered placeholder body.
const useStyles = createStyles(({ token }) => ({
  root: {
    height: '100%',
    background: token.colorBgContainer,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: token.paddingLG,
  },
}))

export type EpsPlaceholderPanelProps = MainPanelControls & {
  icon: MdiIconName
  title: string
  description: string
}

export const EpsPlaceholderPanel = ({ icon, title, description, ...controls }: EpsPlaceholderPanelProps) => {
  const { styles } = useStyles()
  const { token } = theme.useToken()
  return (
    <AxDisplayPanel type="main" icon={icon} title={title} {...controls}>
      <div className={styles.root}>
        <Flex vertical align="center" gap={10} style={{ maxWidth: 420, textAlign: 'center' }}>
          <AxMuiIcon icon={icon} size="2.5rem" color={token.colorTextQuaternary} />
          <Typography.Title level={5} style={{ margin: 0 }}>
            {title}
          </Typography.Title>
          <Typography.Text type="secondary">{description}</Typography.Text>
        </Flex>
      </div>
    </AxDisplayPanel>
  )
}
