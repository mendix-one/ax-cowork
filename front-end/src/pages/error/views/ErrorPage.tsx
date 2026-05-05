import { observer } from 'mobx-react-lite'
import { Box, Button, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useStore } from '../../../shared/store/context'

export const ErrorPage = observer(function ErrorPage() {
  const { error } = useStore()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <Stack spacing={2} sx={{ alignItems: 'center', maxWidth: 420, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
          {error.code}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {error.message}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The page you’re looking for doesn’t exist or has been moved.
        </Typography>
        <Button variant="contained" component={RouterLink} to="/">
          Go home
        </Button>
      </Stack>
    </Box>
  )
})
