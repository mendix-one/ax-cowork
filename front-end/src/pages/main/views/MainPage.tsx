import { observer } from 'mobx-react-lite'
import { Avatar, Badge, IconButton, Tooltip, Typography } from '@mui/material'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import ForkRightOutlinedIcon from '@mui/icons-material/ForkRightOutlined'
import { AppLayout } from '../../../shared/app-layout'
import { useStore } from '../../../shared/store/context'
import type { LeftTool, RightTool } from '../store/MainStore'
import { Panel } from './Panel'
import { LeftPanelBody, RightPanelBody } from './PanelBodies'
import { RailButton } from './RailButton'
import styles from './MainPage.module.scss'

const LEFT_TOOL_LABELS: Record<LeftTool, string> = {
  project: 'Project',
  commit: 'Commit',
  todo: 'Todo',
}

const RIGHT_TOOL_LABELS: Record<RightTool, string> = {
  ai: 'AI Chat',
  database: 'Database',
  docs: 'Documentation',
}

export const MainPage = observer(function MainPage() {
  const { main } = useStore()

  return (
    <AppLayout
      topLeft={
        <>
          <Typography sx={{ fontWeight: 600, color: '#cfd0d4', fontSize: 13 }}>
            {main.projectName}
          </Typography>
          <span className={styles.branchPill}>
            <ForkRightOutlinedIcon sx={{ fontSize: 14 }} />
            {main.branch}
          </span>
        </>
      }
      topRight={
        <>
          <Tooltip title="Notifications" placement="bottom">
            <IconButton size="small" sx={{ color: '#cfd0d4' }}>
              <Badge badgeContent={main.notificationCount} color="error">
                <NotificationsOutlinedIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings" placement="bottom">
            <IconButton size="small" sx={{ color: '#cfd0d4' }}>
              <SettingsOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: '#3574f0' }}>U</Avatar>
        </>
      }
      leftRail={
        <>
          <RailButton
            tooltip="Project"
            active={main.leftTool === 'project'}
            onClick={() => main.selectLeftTool('project')}
          >
            <FolderOutlinedIcon fontSize="small" />
          </RailButton>
          <RailButton
            tooltip="Commit"
            active={main.leftTool === 'commit'}
            onClick={() => main.selectLeftTool('commit')}
          >
            <AccountTreeOutlinedIcon fontSize="small" />
          </RailButton>
          <RailButton
            tooltip="Todo"
            active={main.leftTool === 'todo'}
            onClick={() => main.selectLeftTool('todo')}
          >
            <ChecklistOutlinedIcon fontSize="small" />
          </RailButton>
        </>
      }
      rightRail={
        <>
          <RailButton
            tooltip="AI Chat"
            active={main.rightTool === 'ai'}
            onClick={() => main.selectRightTool('ai')}
          >
            <AutoAwesomeOutlinedIcon fontSize="small" />
          </RailButton>
          <RailButton
            tooltip="Database"
            active={main.rightTool === 'database'}
            onClick={() => main.selectRightTool('database')}
          >
            <StorageOutlinedIcon fontSize="small" />
          </RailButton>
          <RailButton
            tooltip="Docs"
            active={main.rightTool === 'docs'}
            onClick={() => main.selectRightTool('docs')}
          >
            <DescriptionOutlinedIcon fontSize="small" />
          </RailButton>
        </>
      }
      bottomLeft={<span className={styles.statusText}>{main.filePath}</span>}
      bottomRight={<span className={styles.statusText}>{main.metaInfo}</span>}
    >
      <div className={styles.mainFrame}>
        {main.leftTool && (
          <Panel title={LEFT_TOOL_LABELS[main.leftTool]}>
            <LeftPanelBody tool={main.leftTool} />
          </Panel>
        )}
        <section className={styles.editor}>
          <div className={styles.editorTabs}>
            <span className={styles.tab}>MainPage.tsx</span>
          </div>
          <pre className={styles.editorBody}>
            {`// Main panel — central content for the page.
// Left/right tool panels toggle from the rails.
// Status bar shows file path and meta info.`}
          </pre>
        </section>
        {main.rightTool && (
          <Panel title={RIGHT_TOOL_LABELS[main.rightTool]}>
            <RightPanelBody tool={main.rightTool} />
          </Panel>
        )}
      </div>
    </AppLayout>
  )
})
