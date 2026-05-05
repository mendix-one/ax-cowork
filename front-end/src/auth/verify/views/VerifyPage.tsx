import { observer } from 'mobx-react-lite'
import { Alert, Button, Link, Stack, TextField } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { AuthLayout } from '../../../shared/auth-layout'
import { useStore } from '../../../shared/store/context'

export const VerifyPage = observer(function VerifyPage() {
  const { verify } = useStore()

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter the 6-character code we sent to your inbox."
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
          void verify.submit()
        }}
      >
        <TextField
          label="Verification code"
          autoComplete="one-time-code"
          value={verify.code}
          onChange={(e) => verify.setCode(e.target.value)}
          slotProps={{
            htmlInput: {
              maxLength: 6,
              style: {
                letterSpacing: '0.4em',
                fontFamily: 'monospace',
                fontSize: 18,
                textAlign: 'center',
                textTransform: 'uppercase',
              },
            },
          }}
          fullWidth
          autoFocus
        />
        {verify.error && <Alert severity="error">{verify.error}</Alert>}
        {verify.resendNotice && <Alert severity="success">{verify.resendNotice}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={verify.isSubmitting}>
          {verify.isSubmitting ? 'Verifying…' : 'Verify'}
        </Button>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={() => void verify.resend()}
          disabled={verify.isResending}
          sx={{ alignSelf: 'center' }}
        >
          {verify.isResending ? 'Sending…' : 'Resend code'}
        </Link>
      </Stack>
    </AuthLayout>
  )
})
