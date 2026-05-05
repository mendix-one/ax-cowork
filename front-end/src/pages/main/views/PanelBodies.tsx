import type { LeftTool, RightTool } from '../store/MainStore'
import styles from './MainPage.module.scss'

export function LeftPanelBody({ tool }: { tool: LeftTool }) {
  if (tool === 'project') {
    return (
      <ul className={styles.tree}>
        <li>📁 src</li>
        <li className={styles.indent}>📁 pages</li>
        <li className={styles.indent2}>📁 main</li>
        <li className={styles.indent3}>📄 MainPage.tsx</li>
        <li className={styles.indent}>📁 shared</li>
      </ul>
    )
  }
  if (tool === 'commit') return <em className={styles.muted}>No staged changes</em>
  return <em className={styles.muted}>No tasks</em>
}

export function RightPanelBody({ tool }: { tool: RightTool }) {
  if (tool === 'ai') {
    return (
      <>
        <p>AI chat (concept).</p>
        <p className={styles.muted}>Ask anything about the project.</p>
      </>
    )
  }
  if (tool === 'database') return <em className={styles.muted}>No connections</em>
  return <em className={styles.muted}>Recently visited docs appear here</em>
}
