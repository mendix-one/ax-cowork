import type { ReactNode } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import styles from './RailButton.module.scss'

interface RailButtonProps {
  tooltip: string
  active: boolean
  onClick: () => void
  children: ReactNode
}

export function RailButton({ tooltip, active, onClick, children }: RailButtonProps) {
  return (
    <Tooltip title={tooltip} placement="right">
      <IconButton
        size="small"
        onClick={onClick}
        className={`${styles.button} ${active ? styles.active : ''}`}
      >
        {children}
      </IconButton>
    </Tooltip>
  )
}
