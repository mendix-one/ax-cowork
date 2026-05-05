import { observer } from 'mobx-react-lite'
import { Alert, Button, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { AuthLayout } from '../../../shared/auth-layout'
import { useStore } from '../../../shared/store/context'

export const ResetPage = observer(function ResetPage() {
  const { reset } = useStore()

  if (reset.isSent) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="If an account exists for that address, a reset link is on its way."
        footer={
          <RouterLink to="/signin" style={{ color: '#3574f0', textDecoration: 'none' }}>
            Back to sign in
          </RouterLink>
        }
      >
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Didn’t receive an email?
          </Typography>
          <Button variant="outlined" onClick={reset.reset}>
            Try a different email
          </Button>
        </Stack>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we’ll send you a link to set a new password."
      footer={
        <RouterLink to="/signin" style={{ color: '#3574f0', textDecoration: 'none' }}>
          Back to sign in
        </RouterLink>
      }
    >
      <Stack
        component="form"
        spacing={2}
        onSubmit={(e) => {
          e.preventDefault()
          void reset.submit()
        }}
      >
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={reset.email}
          onChange={(e) => reset.setEmail(e.target.value)}
          fullWidth
          autoFocus
        />
        {reset.error && <Alert severity="error">{reset.error}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={reset.isSubmitting}>
          {reset.isSubmitting ? 'Sending…' : 'Send reset link'}
        </Button>
      </Stack>
    </AuthLayout>
  )
})
