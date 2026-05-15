import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { RequireAuth } from './RequireAuth.tsx'
import { RedirectIfAuthed } from './RedirectIfAuthed.tsx'
import { RouteError } from './RouteError.tsx'

export const index = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          {
            index: true,
            lazy: async () => ({ Component: (await import('@/pages/home/HomePage.tsx')).HomePage }),
          },
          {
            path: 'control-table',
            lazy: async () => ({ Component: (await import('@/pages/control-table-demo/ControlTableDemoPage.tsx')).ControlTableDemoPage }),
          },
        ],
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    errorElement: <RouteError />,
    children: [
      {
        element: <RedirectIfAuthed />,
        children: [
          {
            path: 'signin',
            lazy: async () => ({ Component: (await import('@/pages/auth/SignInPage.tsx')).SignInPage }),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    lazy: async () => ({ Component: (await import('@/pages/error/NotFoundPage.tsx')).NotFoundPage }),
  },
])
