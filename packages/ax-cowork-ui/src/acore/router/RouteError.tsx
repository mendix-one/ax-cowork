import { Button, Result } from 'antd'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

export const RouteError = () => {
  const error = useRouteError()

  let title = 'Something went wrong'
  let detail = 'An unexpected error occurred. Please try again.'

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`
    detail = typeof error.data === 'string' ? error.data : detail
  } else if (error instanceof Error) {
    detail = error.message
  }

  return (
    <Result
      status="error"
      title={title}
      subTitle={detail}
      extra={
        <Button type="primary" onClick={() => window.location.reload()}>
          Reload
        </Button>
      }
    />
  )
}
