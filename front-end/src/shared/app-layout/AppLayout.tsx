import type { ReactNode } from 'react'
import styles from './AppLayout.module.scss'

interface AppLayoutProps {
  topLeft: ReactNode
  topRight: ReactNode
  leftRail?: ReactNode
  rightRail?: ReactNode
  bottomLeft: ReactNode
  bottomRight: ReactNode
  children: ReactNode
}

export function AppLayout({
  topLeft,
  topRight,
  leftRail,
  rightRail,
  bottomLeft,
  bottomRight,
  children,
}: AppLayoutProps) {
  return (
    <div className={styles.root}>
      <header className={styles.top}>
        <div className={styles.topSection}>{topLeft}</div>
        <div className={styles.topSection}>{topRight}</div>
      </header>
      <aside className={styles.leftRail}>{leftRail}</aside>
      <main className={styles.center}>{children}</main>
      <aside className={styles.rightRail}>{rightRail}</aside>
      <footer className={styles.bottom}>
        <div className={styles.bottomSection}>{bottomLeft}</div>
        <div className={styles.bottomSection}>{bottomRight}</div>
      </footer>
    </div>
  )
}
