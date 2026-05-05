import type { ReactNode } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import styles from './AuthLayout.module.scss'

interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <Box className={styles.root}>
      <div className={styles.brand}>ax-cowork</div>
      <Paper elevation={2} className={styles.card}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: subtitle ? 0.5 : 3 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {subtitle}
          </Typography>
        )}
        {children}
      </Paper>
      {footer && <div className={styles.footer}>{footer}</div>}
    </Box>
  )
}
