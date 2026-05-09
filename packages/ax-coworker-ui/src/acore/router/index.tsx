import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../../layout/AppLayout.tsx'
import { HomePage } from '../../pages/home/HomePage.tsx'
import { MainPage } from '../../pages/main/MainPage.tsx'
import { NotFoundPage } from '../../pages/error/NotFoundPage.tsx'

export const index = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'main', element: <MainPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
