import type { ReactNode } from 'react'
import styles from './Panel.module.scss'

interface PanelProps {
  title: string
  children: ReactNode
}

export function Panel({ title, children }: PanelProps) {
  return (
    <aside className={styles.panel}>
      <header className={styles.header}>
        <span className={styles.title}>{title}</span>
      </header>
      <div className={styles.body}>{children}</div>
    </aside>
  )
}
