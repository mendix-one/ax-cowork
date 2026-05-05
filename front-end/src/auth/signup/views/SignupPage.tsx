import { observer } from 'mobx-react-lite'
import { Alert, Button, Stack, TextField } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { AuthLayout } from '../../../shared/auth-layout'
import { useStore } from '../../../shared/store/context'

export const SignupPage = observer(function SignupPage() {
  const { signup } = useStore()

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start collaborating with ax-cowork in a minute."
      footer={
        <>
          Already have an account?{' '}
          <RouterLink to="/signin" style={{ color: '#3574f0', textDecoration: 'none' }}>
            Sign in
          </RouterLink>
        </>
      }
    >
      <Stack
        component="form"
        spacing={2}
        onSubmit={(e) => {
          e.preventDefault()
          void signup.submit()
        }}
      >
        <TextField
          label="Name"
          autoComplete="name"
          value={signup.name}
          onChange={(e) => signup.setName(e.target.value)}
          fullWidth
          autoFocus
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={signup.email}
          onChange={(e) => signup.setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          value={signup.password}
          onChange={(e) => signup.setPassword(e.target.value)}
          fullWidth
        />
        <TextField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={signup.confirmPassword}
          onChange={(e) => signup.setConfirmPassword(e.target.value)}
          fullWidth
        />
        {signup.error && <Alert severity="error">{signup.error}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={signup.isSubmitting}>
          {signup.isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </Stack>
    </AuthLayout>
  )
})
