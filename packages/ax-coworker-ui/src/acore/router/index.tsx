import { createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { PageLayout } from '@/layouts/PageLayout'
import { RequireAuth } from './RequireAuth.tsx'
import { RouteError } from './RouteError.tsx'
import { RedirectIfAuthed } from './RedirectIfAuthed.tsx'

export const index = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    errorElement: <RouteError />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          {
            index: true,
            lazy: async () => ({ Component: (await import('@/pages/simulation/SimulationPage.tsx')).SimulationPage }),
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
