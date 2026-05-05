import { Box, Button, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { Link as RouterLink } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../shared/store/context'
import styles from './HomePage.module.scss'

const NAV_LINKS: { to: string; label: string }[] = [
  { to: '/main', label: 'IDE-style main page' },
  { to: '/signin', label: 'Sign in' },
  { to: '/signup', label: 'Sign up' },
  { to: '/reset', label: 'Reset password' },
  { to: '/verify', label: 'Verify email' },
  { to: '/this-route-does-not-exist', label: '404 (concept)' },
]

export const HomePage = observer(function HomePage() {
  const { counter } = useStore()

  return (
    <Box className={styles.root}>
      <Typography variant="h3" gutterBottom>
        Home
      </Typography>
      <Typography variant="body1" className={styles.count}>
        Count: {counter.count}
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={counter.increment}>
          Increment
        </Button>
        <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={counter.reset}>
          Reset
        </Button>
      </Stack>
      <Typography variant="overline" color="text.secondary">
        Page concepts
      </Typography>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mt: 1 }}>
        {NAV_LINKS.map((link) => (
          <Button key={link.to} variant="text" component={RouterLink} to={link.to}>
            {link.label} →
          </Button>
        ))}
      </Stack>
    </Box>
  )
})
