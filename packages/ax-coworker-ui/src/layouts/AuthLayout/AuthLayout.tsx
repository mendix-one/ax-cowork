import { Suspense } from 'react'
import { Layout, theme } from 'antd'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import iconLight from '@/assets/icon.png'
import { PageFallback } from '@/acore/router/PageFallback.tsx'
import { AuthLayoutTop } from './AuthLayoutTop.tsx'
import { AuthLayoutBottom } from './AuthLayoutBottom.tsx'
import { AuthLayoutLeft } from './AuthLayoutLeft.tsx'
import { AuthLayoutRight } from './AuthLayoutRight.tsx'

export const AuthLayout = () => {
  const { token } = theme.useToken()
  const { t } = useTranslation()

  return (
    <Layout className="ax-layout">
      <AuthLayoutTop />
      <Layout className="ax-layout_middle">
        <AuthLayoutLeft />
        <Layout.Content className="ax-layout_main">
          <div className="w-full h-full flex items-center justify-center" style={{ background: token.colorBgLayout }}>
            <div className="w-full max-w-sm rounded-md shadow-md p-8" style={{ background: token.colorBgContainer }}>
              <header className="flex flex-col items-center mb-6 gap-2">
                <img src={iconLight} alt={t('brand.name')} width={48} height={48} />
                <h1 className="text-lg font-semibold" style={{ color: token.colorText }}>
                  {t('brand.name')}
                </h1>
              </header>
              <Suspense fallback={<PageFallback />}>
                <Outlet />
              </Suspense>
            </div>
          </div>
        </Layout.Content>
        <AuthLayoutRight />
      </Layout>
      <AuthLayoutBottom />
    </Layout>
  )
}
