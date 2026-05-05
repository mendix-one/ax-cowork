import { observer } from 'mobx-react-lite'
import { Alert, Button, Stack, TextField } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { AuthLayout } from '../../../shared/auth-layout'
import { useStore } from '../../../shared/store/context'

export const SigninPage = observer(function SigninPage() {
  const { signin } = useStore()

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back. Sign in to continue to ax-cowork."
      footer={
        <>
          New here?{' '}
          <RouterLink to="/" style={{ color: '#3574f0', textDecoration: 'none' }}>
            Create an account
          </RouterLink>
        </>
      }
    >
      <Stack
        component="form"
        spacing={2}
        onSubmit={(e) => {
          e.preventDefault()
          void signin.submit()
        }}
      >
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={signin.email}
          onChange={(e) => signin.setEmail(e.target.value)}
          fullWidth
          autoFocus
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={signin.password}
          onChange={(e) => signin.setPassword(e.target.value)}
          fullWidth
        />
        {signin.error && <Alert severity="error">{signin.error}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={signin.isSubmitting}>
          {signin.isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
        <RouterLink
          to="/"
          style={{
            color: '#3574f0',
            textDecoration: 'none',
            fontSize: 13,
            textAlign: 'right',
          }}
        >
          Forgot password?
        </RouterLink>
      </Stack>
    </AuthLayout>
  )
})
