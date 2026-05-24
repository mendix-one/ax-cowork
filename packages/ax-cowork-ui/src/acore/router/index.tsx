import { createBrowserRouter } from 'react-router-dom'
import { RouteError } from './RouteError.tsx'
import { RequireAuth } from './RequireAuth.tsx'
import { RedirectIfAuthed } from './RedirectIfAuthed.tsx'
import { AuthLayout } from '@/layouts/AuthLayout'
import { PageLayout } from '@/layouts/PageLayout'
import { AppLayout } from '@/layouts/AppLayout'

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
    path: '/sample',
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      {
        children: [
          {
            index: true,
            lazy: async () => ({ Component: (await import('@/samples/control-table/ControlTableDemoPage.tsx')).ControlTableDemoPage }),
          },
          {
            path: 'control-table',
            lazy: async () => ({ Component: (await import('@/samples/control-table/ControlTableDemoPage.tsx')).ControlTableDemoPage }),
          },
          {
            path: 'markdown-view',
            lazy: async () => ({ Component: (await import('@/samples/markdown-view/MarkdownViewPage.tsx')).MarkdownViewPage }),
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
    path: '/system-error',
    lazy: async () => ({ Component: (await import('@/pages/error/SystemErrorPage.tsx')).SystemErrorPage }),
  },
  {
    path: '/system-exception',
    lazy: async () => ({ Component: (await import('@/pages/error/SystemExceptionPage.tsx')).SystemExceptionPage }),
  },
  {
    path: '/access-denied',
    lazy: async () => ({ Component: (await import('@/pages/error/AccessDeniedPage.tsx')).AccessDeniedPage }),
  },
  {
    path: '*',
    lazy: async () => ({ Component: (await import('@/pages/error/NotFoundPage.tsx')).NotFoundPage }),
  },
])
